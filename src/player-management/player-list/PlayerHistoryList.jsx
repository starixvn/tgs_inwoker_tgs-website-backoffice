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
import { equals, includes } from "ramda"
import {
  StatusLabel,
  BirthdayLabel,
  RealNameLabel,
  RemarkLabel
} from "./player"
import {
  LineLabel,
  MessengerLabel,
  TelegramLabel,
  ViberLabel,
  WhatsappLabel
} from "./contact"
import { boolean } from "boolean"
import { PlayerIdentityStateIcon } from "../player-identity/PlayerIdentityState"

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

const isCreate = equals(Create)
const isUpdate = equals(Update)

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
    items: detail?.changeSets
  })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...dialog} onClickClose={dialog.hide} />
  }

  //TODO: update vs create table?
  return (
    <Modal title=" " {...dialog}>
      {JSON.stringify(items)}
      <DataTable columns={columns} data={items} />
    </Modal>
  )
}

const OperationColumnLabel = () => <Trans zh="操作" en="Operation" />
const FieldColumnLabel = () => <Trans zh="栏位" en="Field" />
const ValueColumnKabel = () => <Trans zh="值" en="Value" />

//TODO: fields?
const PlayerTable = ({ player = [] }) => {
  return (
    <Table>
      <PlayerTableHead />
      <Table.Body></Table.Body>
    </Table>
  )
}

const PlayerTableHead = () => {
  return (
    <Table.Head>
      <Table.Row>
        <Table.HeadCell>
          <OperationColumnLabel />
        </Table.HeadCell>
        <Table.HeadCell>
          <FieldColumnLabel />
        </Table.HeadCell>
        <Table.HeadCell>
          <ValueColumnKabel />
        </Table.HeadCell>
      </Table.Row>
    </Table.Head>
  )
}

const PlayerBody = ({ player = [] }) => {
  return <Table.Body></Table.Body>
}

//TODO
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
        Header: <OperationColumnLabel />,
        disableSortBy: true,
        Cell: OperationLabel
      }),
      textColumn({
        id: "label",
        accessor: (row) => row,
        Header: FieldColumnLabel,
        disableSortBy: true,
        Cell: ChangeSetLabel
      }),
      textColumn({
        id: "value",
        accessor: (row) => row,
        Header: ValueColumnKabel,
        disableSortBy: true,
        Cell: ({ value }) => {
          return <ChangeSetField value={value} brandId={brandId} />
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}

//TODO:
const StringValue = ({ value = "" }) => value

//TODO: identityAuthentication Label & checkbox or icon?
const IdentityAuthenticationLabel = () => (
  <Trans zh="身份认证" en="Identity Authentication" />
)

//TODO: add tooltip?
const IdentityAuthenticationIcon = ({ value = "" }) => {
  let isAuth = boolean(value)
  return <PlayerIdentityStateIcon value={isAuth} />
}

const PasswordLabel = () => <Trans zh="密码" en="Password" />

//TODO: test each one
const PathLabelValueList = [
  [equals("/password"), PasswordLabel],
  [equals("/RealName"), RealNameLabel],
  [equals("/status"), StatusLabel, PlayerStatusLabel],
  [
    equals("/identityAuthentication"),
    IdentityAuthenticationLabel,
    IdentityAuthenticationIcon
  ],
  [equals("//Remark"), RemarkLabel],
  [includes("/Birthdate"), BirthdayLabel],
  [includes("/FacebookMessenger"), MessengerLabel],
  [includes("/Line"), LineLabel],
  [includes("/WhatsApp"), WhatsappLabel],
  [includes("/Viber"), ViberLabel],
  [includes("/Telegram", TelegramLabel)]
]

const toLabel = (path = "") => {
  let result = PathLabelValueList.find(([fn]) => {
    return fn(path)
  })
  let labelIndex = 1
  return result?.[labelIndex] ?? StringValue
}

const toField = (path = "") => {
  let result = PathLabelValueList.find(([fn]) => {
    return fn(path)
  })
  let fieldIndex = 2
  return result?.[fieldIndex] ?? StringValue
}

const ChangeSetLabel = ({ value = {} }) => {
  let Label = toLabel(value.path)
  return <Label value={value.path} />
}

const ChangeSetField = ({ value = {}, brandId }) => {
  let Field = toField(value.path)
  return <Field value={value.value} brandId={brandId} />
}
