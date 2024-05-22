import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set, useModalState } from "bumbag"
import { FieldValues } from "../../layout/Grid"
import { Trans, FormattedDateTime, FormattedNumber, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { SubmitCancel } from "../../button/ActionButtons"
import { Tab as _Tab, TabPanel } from "../../tab"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { useAgentHistory, useAgentHistoryList } from "./client"
import { pastWeek } from "../../date/range"
import { Table, useTable, toApiParams, pageCount } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import textColumn from "../../table/column/textColumn"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Descending } from "../../table/order"
import { endOfDay } from "date-fns"
import { isString } from "lodash-es"
import { equals, includes, pipe, prop } from "ramda"
import Modal from "../../dialog/Modal"
import { DetailDisclosure } from "../../dialog/Disclosure"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { QqLabel, WeChatLabel } from "./AgentContactInfo"
import { AgentStatusLabel } from "../AgentStatus"
import {
  ActionTypeTrans,
  AddTrans,
  DetailTrans,
  EditingRecordsTrans,
  OperatorTrans,
  RemarkTrans
} from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import { EmailTrans, PhoneTrans, RealNameTrans } from "../../trans/User"
import { TimeTrans } from "../../trans/Date"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans,
  useCardGameTrans,
  useEGameTrans,
  useLiveDealerTrans,
  useLotteryTrans,
  useSportsbookTrans,
  useVirtualSportsTrans
} from "../../trans/Game"
import { useProductFeeTrans } from "../../trans/Platform"

const Key = "AgentHistoryList"

export const AgentHistoryListTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <EditingRecordsTrans />
    </_Tab>
  )
}

export const AgentHistoryListPanel = ({
  agentId,
  brandId,
  record,
  ...props
}) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = pastWeek()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    from: dateRange.start,
    to: endOfDay(dateRange.end)
  })

  let { pageSize, from, to } = state
  let { isLoading, data, error, mutate, emptyData } = useAgentHistoryList(
    isActive ? agentId : undefined,
    toApiParams({ ...state, sortby: "CreatedOn", orderby: Descending })
  )

  let columns = useColumns({ items: data?.items })

  return (
    <TabPanel tabId={Key} {...props}>
      <Stack>
        <SearchBar
          from={from}
          to={to}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </TabPanel>
  )
}

const SearchBar = ({ from, to, search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
          />
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
      return <Trans data-type={Create} {...CreateTrans} />
    case Update:
      return <Trans data-type={Update} {...UpdateTrans} />
    default:
      return value
  }
}

const useColumns = ({ items = [], brandId }) =>
  useMemo(
    () => [
      dateTimeColumn({
        accessor: "createdOn",
        Header: <TimeTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "action",
        Header: <ActionTypeTrans />,
        disableSortBy: true,
        Cell: ActionTypeLabel
      }),
      textColumn({
        accessor: "modifier",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "detail",
        accessor: (row) => row,
        Header: <DetailTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <AgentHistoryDialogDisclosure
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

const AgentHistoryDialogDisclosure = ({
  action,
  eventId,
  brandId,
  id,
  dialogId = "agent-history-dialog"
}) => {
  let dialog = useModalState()

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <DetailDisclosure id={id} {...dialog} />
      {dialog.visible && (
        <AgentHistoryDialog
          action={action}
          eventId={eventId}
          brandId={brandId}
          dialog={dialog}
          dialogId={dialogId}
        />
      )}
    </>
  )
}

const AgentHistoryDialog = ({
  action,
  eventId,
  brandId,
  dialog,
  dialogId,
  ...props
}) => {
  let { isLoading, data: detail, error } = useAgentHistory(eventId)

  let items = detail?.changeSets
  let columns = useAgentHistoryColumns({
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
    <Modal id={dialogId} title={<Box padding="1ch"></Box>} {...dialog}>
      <Table columns={columns} data={items} />
    </Modal>
  )
}

//TODO: move to?
const Replace = "replace"
const Add = "add"
const Remove = "remove"
const RemoveTrans = {
  zh: "移除",
  en: "Remove"
}
const OperationLabel = ({ value = "" }) => {
  switch (value) {
    case Replace:
      return <Trans data-type={Replace} {...UpdateTrans} />
    case Add:
      return <AddTrans data-type={Add} />
    case Remove:
      return <Trans data-type={Remove} {...RemoveTrans} />
    default:
      return value
  }
}

const useAgentHistoryColumns = ({ items = [], brandId }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "op",
        Header: <ActionTypeTrans />,
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

const PasswordLabel = () => <Trans zh="登入密码" en="Login Password" />
const WithdrawPassword = () => <Trans zh="提款密码" en="Withdrawal Password" />

const ProductFee = {
  LiveDealer: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let liveDealer = useLiveDealerTrans()
      return `${productFee}: ${liveDealer}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let liveDealer = useLiveDealerTrans()
      return `${productFee}: ${liveDealer}`
    }
  },
  Sportsbook: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let sports = useSportsbookTrans()
      return `${productFee}: ${sports}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let sports = useSportsbookTrans()
      return `${productFee}: ${sports}`
    }
  },
  EGame: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let egame = useEGameTrans()
      return `${productFee}: ${egame}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let egame = useEGameTrans()
      return `${productFee}: ${egame}`
    }
  },
  CardGame: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let cardGame = useCardGameTrans()
      return `${productFee}: ${cardGame}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let cardGame = useCardGameTrans()
      return `${productFee}: ${cardGame}`
    }
  },
  Lottery: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let lottery = useLotteryTrans()
      return `${productFee}: ${lottery}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let lottery = useLotteryTrans()
      return `${productFee}: ${lottery}`
    }
  },
  VirtualSports: {
    Current: () => {
      let productFee = useProductFeeTrans()
      let virtualSport = useVirtualSportsTrans()
      return `${productFee}: ${virtualSport}`
    },
    Next: () => {
      let productFee = useProductFeeTrans()
      let virtualSport = useVirtualSportsTrans()
      return `${productFee}: ${virtualSport}`
    }
  }
}

const StringValue = ({ value = "" }) =>
  isString(value) ? value : JSON.stringify(value)

const getPath = prop("path")

const LabelValueList = [
  [pipe(getPath, equals("/RealName")), RealNameTrans],
  [pipe(getPath, equals("/status")), StatusTrans, AgentStatusLabel],
  [pipe(getPath, includes("/Remark")), RemarkTrans],

  [pipe(getPath, equals("/Phone")), PhoneTrans],
  [pipe(getPath, equals("/Email")), EmailTrans],
  [pipe(getPath, equals("/Wechat")), WeChatLabel],
  [pipe(getPath, equals("/Qq")), QqLabel],

  [pipe(getPath, equals("/password")), PasswordLabel],
  [pipe(getPath, equals("/withdrawPassword")), WithdrawPassword],

  [
    pipe(getPath, equals("/currentLiveDealerPercentage")),
    ProductFee.LiveDealer.Current
  ],
  [
    pipe(getPath, equals("/nextLiveDealerPercentage")),
    ProductFee.LiveDealer.Next
  ],
  [
    pipe(getPath, equals("/currentSportsPercentage")),
    ProductFee.Sportsbook.Current
  ],
  [pipe(getPath, equals("/nextSportsPercentage")), ProductFee.Sportsbook.Next],
  [pipe(getPath, equals("/currentSlotPercentage")), ProductFee.EGame.Current],
  [pipe(getPath, equals("/nextSlotPercentage")), ProductFee.EGame.Next],
  [
    pipe(getPath, equals("/currentCardGamePercentage")),
    ProductFee.CardGame.Current
  ],
  [pipe(getPath, equals("/nextCardGamePercentage")), ProductFee.CardGame.Next],
  [
    pipe(getPath, equals("/currentLotteryPercentage")),
    ProductFee.Lottery.Current
  ],
  [pipe(getPath, equals("/nextLotteryPercentage")), ProductFee.Lottery.Next],
  [
    pipe(getPath, equals("/currentVirtualSportsPercentage")),
    ProductFee.VirtualSports.Current
  ],
  [
    pipe(getPath, equals("/nextVirtualSportsPercentage")),
    ProductFee.VirtualSports.Next
  ]
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

/*
const AgentOperation = {
  Info: "Info",
  Contact: "Contact",
  Password: "Password",
  PayPassword: "PayPassword",
  Bank: "Bank",
  Agent: "Agent"
}

const AgentOperationLabel = ({ value, ...props }) => {
  switch (value) {
    case AgentOperation.Info:
      return <Trans zh="修改代理信息" en="Edit Agent Info" {...props} />
    case AgentOperation.Contact:
      return <Trans zh="修改联系信息" en="Edit Contact Info" {...props} />
    case AgentOperation.Password:
      return <Trans zh="修改登入密码" en="Change Login Password" {...props} />
    case AgentOperation.PayPassword:
      return (
        <Trans zh="修改提款密码" en="Change Withdrawal Password" {...props} />
      )
    case AgentOperation.Bank:
      return <Trans zh="修改银行卡信息" en="Edit Bank" {...props} />
    case AgentOperation.Agent:
      return <Trans zh="修改上级" en="Edit Upper Level Agent" {...props} />
    default:
      return value
  }
}
*/
