import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, useModalState, Set, Table } from "bumbag"
import {
  useTable,
  Table as DataTable,
  pageCount,
  toApiParams
} from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayerHistoryList, usePlayerHistory } from "./client"
import { Trans, useTrans } from "../../i18n"
import { pastWeek } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import AlertDialog from "../../dialog/Alert"
import { isDev } from "../../env"
import { DetailDisclosure } from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import Modal from "../../dialog/Modal"
import { PlayerStatusLabel } from "../PlayerStatus"
import { equals, includes, pipe, prop } from "ramda"
import {
  UserNameLabel,
  RealNameLabel,
  VIPLevelLabel,
  AgentUsernameLabel,
  StatusLabel,
  BirthdayLabel,
  RemarkLabel
} from "./player"
import {
  MobileLabel,
  EmailLabel,
  QQLabel,
  LineLabel,
  MessengerLabel,
  TelegramLabel,
  ViberLabel,
  WhatsappLabel,
  WeChatLabel
} from "./contact"
import { boolean } from "boolean"
import { PlayerIdentityStateIcon } from "../player-identity/PlayerIdentityState"
import { isString } from "lodash-es"
import { FieldValues } from "../../layout/Grid"
import { VipLevelIdLabel } from "../../vip-levels/VipLevel"
import { AgentIdUsername } from "../../agent/agent-list/AgentUsername"

export const Key = "history"

export const PlayerHistoryListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="操作记录" en="Operating records" />
    </_Tab>
  )
}

export const PlayerHistoryListPanel = ({ playerCode, brandId, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    from: dateRange.start,
    to: dateRange.end
  })

  let { pageSize, from, to } = state
  let { isLoading, data, error, mutate, deleteCache } = usePlayerHistoryList(
    isActive ? playerCode : undefined,
    toApiParams({ ...state, sortby: "createdOn", orderby: Descending })
  )

  let columns = useColumns({ items: data?.items, brandId })
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          start={from}
          end={to}
          search={({ start, end, ...data } = {}) => {
            setState({
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <DataTable
          columns={columns}
          data={data?.items}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}

const SearchBar = ({ start, end, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const Create = "Create"
const CreateTrans = {
  zh: "新增",
  en: "Create"
}

const Update = "Update"
const UpdateTrans = {
  zh: "更新",
  en: "Update"
}
const ActionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Create:
      return <Trans {...CreateTrans} />
    case Update:
      return <Trans {...UpdateTrans} />
    default:
      return value
  }
}

const useColumns = ({ items = [], brandId }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="操作时间" en="Operation Time" />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      textColumn({
        accessor: "action",
        Header: <Trans zh="操作项" en="Operation Item" />,
        disableSortBy: true,
        Cell: ActionTypeLabel
      }),
      textColumn({
        accessor: "modifier",
        Header: <Trans zh="操作者" en="Operator" />,
        disableSortBy: true
      }),
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <Trans zh="详情" en="Detail" />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <PlayerHistoryDialogDisclosure
                action={record?.action}
                eventId={record?.eventId}
                brandId={brandId}
              />
            </Set>
          )
        }
      })
    ],
    [JSON.stringify(items)]
  )

const PlayerHistoryDialogDisclosure = ({ action, eventId, brandId }) => {
  let dialog = useModalState()

  return (
    <>
      <DetailDisclosure {...dialog} />
      {dialog.visible && (
        <PlayerHistoryDialog
          action={action}
          eventId={eventId}
          brandId={brandId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const PlayerHistoryDialog = ({
  action,
  eventId,
  brandId,
  dialog,
  ...props
}) => {
  let { isLoading, data: detail, error } = usePlayerHistory(eventId)

  let items = detail?.changeSets
  let columns = usePlayerHistoryColumns({
    items: detail?.changeSets,
    brandId
  })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...dialog} onClickClose={dialog.hide} />
  }

  return (
    <Modal title={<Box padding="1ch"></Box>} {...dialog}>
      <DataTable columns={columns} data={items} />
    </Modal>
  )
}

const Replace = "replace"
const Add = "add"
const AddTrans = {
  zh: "新增",
  en: "Add"
}
const Remove = "remove"
const RemoveTrans = {
  zh: "移除",
  en: "Remove"
}
const OperationLabel = ({ value = "" }) => {
  switch (value) {
    case Replace:
      return <Trans {...UpdateTrans} />
    case Add:
      return <Trans {...AddTrans} />
    case Remove:
      return <Trans {...RemoveTrans} />
    default:
      return value
  }
}
const usePlayerHistoryColumns = ({ items = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "op",
        Header: <Trans zh="操作" en="Operation" />,
        disableSortBy: true,
        Cell: OperationLabel
      }),
      textColumn({
        id: "label",
        accessor: (row) => row,
        Header: <Trans zh="栏位" en="Field" />,
        disableSortBy: true,
        Cell: ChangeSetLabel
      }),
      textColumn({
        id: "value",
        accessor: (row) => row,
        Header: <Trans zh="值" en="Value" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return <ChangeSetField value={value} brandId={brandId} />
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}

const StringValue = ({ value = "" }) =>
  isString(value) ? value : JSON.stringify(value)

const IdentityAuthenticationLabel = () => (
  <Trans zh="身份认证" en="Identity Authentication" />
)

const IdentityAuthenticationIcon = ({ value = "" }) => {
  let isAuth = boolean(value)
  return <PlayerIdentityStateIcon value={isAuth} />
}

const PasswordLabel = () => <Trans zh="密码" en="Password" />

const isAddPlayer = pipe(prop("op"), equals(Add))
const getPath = prop("path")

const Player = ({ value: player = {}, brandId }) => {
  return (
    <FieldValues>
      {player.username && (
        <>
          <Box alignX="left">
            <UserNameLabel />
          </Box>
          <Box alignY="center">{player.username}</Box>
        </>
      )}
      {player.vipId && (
        <>
          <Box alignX="left">
            <VIPLevelLabel />
          </Box>

          <Box alignX="left">
            <VipLevelIdLabel value={player.vipId} brandId={brandId} />
          </Box>
        </>
      )}
      {player.agentId && (
        <>
          <Box alignX="left">
            <AgentUsernameLabel />
          </Box>
          <Box alignX="left">
            <AgentIdUsername value={player.agentId} />
          </Box>
        </>
      )}
      {player.status && (
        <>
          <Box alignX="left">
            <StatusLabel />
          </Box>
          <Box alignX="left">
            <PlayerStatusLabel value={player.status} />
          </Box>
        </>
      )}
    </FieldValues>
  )
}

const AreaCodeLabel = () => <Trans zh="区号" en="Area Code" />

const LabelValueList = [
  [pipe(getPath, equals("/properties/RealName")), RealNameLabel],
  [pipe(getPath, equals("/properties/Birthdate")), BirthdayLabel],
  [pipe(getPath, equals("/properties/VipId")), VIPLevelLabel, VipLevelIdLabel],
  [
    pipe(getPath, equals("/properties/AgentId")),
    AgentUsernameLabel,
    AgentIdUsername
  ],
  [pipe(getPath, includes("/Remark")), RemarkLabel],
  [
    pipe(getPath, equals("/identityAuthentication")),
    IdentityAuthenticationLabel,
    IdentityAuthenticationIcon
  ],

  [pipe(getPath, equals("/status")), StatusLabel, PlayerStatusLabel],

  [pipe(getPath, equals("/properties/AreaCode")), AreaCodeLabel],
  [pipe(getPath, equals("/properties/Phone")), MobileLabel],
  [pipe(getPath, equals("/properties/Email")), EmailLabel],
  [pipe(getPath, equals("/properties/Qq")), QQLabel],
  [pipe(getPath, equals("/properties/Wechat")), WeChatLabel],
  [pipe(getPath, equals("/properties/Telegram")), TelegramLabel],
  [pipe(getPath, equals("/properties/Viber")), ViberLabel],
  [pipe(getPath, equals("/properties/FacebookMessenger")), MessengerLabel],
  [pipe(getPath, equals("/properties/Line")), LineLabel],
  [pipe(getPath, equals("/properties/WhatsApp")), WhatsappLabel],

  [pipe(getPath, equals("/password")), PasswordLabel],

  [isAddPlayer, StringValue, Player]
]

const toLabel = (value) => {
  let result = LabelValueList.find(([fn]) => {
    return fn(value)
  })
  let labelIndex = 1
  return result?.[labelIndex] ?? StringValue
}

const toField = (value) => {
  let result = LabelValueList.find(([fn]) => {
    return fn(value)
  })
  let fieldIndex = 2
  return result?.[fieldIndex] ?? StringValue
}

const ChangeSetLabel = ({ value = {} }) => {
  let Label = toLabel(value)
  return <Label value={value.path} />
}

const ChangeSetField = ({ value = {}, brandId }) => {
  let Field = toField(value)
  return <Field value={value.value} brandId={brandId} />
}
