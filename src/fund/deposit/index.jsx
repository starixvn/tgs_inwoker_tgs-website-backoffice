import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useLocation } from "react-router-dom"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  FieldStack,
  Blockquote
} from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import AutoSizer from "react-virtualized-auto-sizer"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  FormattedNumberDecimal,
  Trans,
  useLangCode,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn, { noWrapTextColumn } from "../../table/column/textColumn"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { today } from "../../date/range"
import { useFundDepositFormList, API } from "./client"
import { Update } from "./menu"
import {
  PaymentMethodLabel,
  PaymentMethodSelect
} from "../../payment/method/PaymentMethod"
import { VerifyFundDepositDisclosure } from "./VerifyFundDeposit"
import { ViewFundDepositDisclosure } from "./ViewFundDeposit"
import FundDepositStatus, {
  FundDepositStatusBox,
  FundDepositStatusLabel,
  FundDepositStatusSelect,
  isFundDepositApproved
} from "./FundDepositStatus"
import { SortOrder } from "../../table/order"
import { startOfNextDay } from "../../date/startOfNextDay"
import { sortBy, head, partial } from "lodash-es"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import { subDays, parseISO, isAfter, isSameDay, isValid, max } from "date-fns"
import {
  PlatformPaymentProviderSelect,
  PlatformPaymentTransferType
} from "../../payment/PlatformPaymentProviderSelect"
import { ActionTrans, OperatorTrans, RemarkTrans } from "../../trans/Action"
import {
  ActualDepositAmountTrans,
  DepositAmountTrans,
  DepositListTrans,
  DepositPaymentMethodTrans,
  PaymentNameTrans,
  TransferFeeTrans,
  useChannelNameTrans,
  useDepositPaymentMethodTrans,
  usePaymentProviderTrans
} from "../../trans/Payment"
import { UserNameTrans, useUserNameTrans } from "../../trans/User"
import {
  GmsIdTrans,
  ThirdPartyIdTrans,
  useGmsIdTrans,
  useSystemIdTrans,
  useThirdPartyIdTrans
} from "../../trans/Platform"
import { ApplicationTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"
import { PromotionAmountTrans, PromotionNameTrans } from "../../trans/Promotion"
import { useTotalDepositAmountTrans } from "../../trans/Field"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { UpperLevelAgentTrans } from "../../trans/Agent"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<DepositListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const SecondInMilliseconds = 1000
const MinuteInMilliseconds = 60000

const Body = ({}) => {
  let brandId = usePlatformId()

  let location = useLocation()

  let todayRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: "",
    channel: "",
    payment: "",
    method: "",
    status: location?.state?.status ?? FundDepositStatus.UnprocessedStatus,
    thirdOrderNo: "",
    orderNo: "",
    beginCreateOn: todayRange.start,
    endCreateOn: todayRange.end,
    beginUpdateOn: undefined,
    endUpdateOn: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    bc: state.beginCreateOn,
    ec: startOfNextDay(state.endCreateOn),
    bu: state.beginUpdateOn,
    eu: startOfNextDay(state.endUpdateOn),
    sortby: "CreatedOn",
    orderby: SortOrder.Descending,
    culture
  })

  let {
    pageIndex,
    pageSize,
    username,
    channel,
    method,
    status,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  } = state
  let {
    data = {},
    isLoading,
    mutate: mutateFormList,
    error,
    emptyData
  } = useFundDepositFormList(brandId, toSearchParams(), {
    refreshInterval: 10 * SecondInMilliseconds //10s
  })

  useEffect(() => {
    if (location?.state?.fromNotify) {
      todayRange = today()
      setState({
        pageIndex: 0,
        username: "",
        channel: "",
        payment: "",
        method: "",
        status: location?.state?.status ?? "",
        thirdOrderNo: "",
        orderNo: "",
        id: "",
        beginCreateOn: todayRange.start,
        endCreateOn: todayRange.end,
        beginUpdateOn: undefined,
        endUpdateOn: undefined
      })

      mutateFormList(undefined)
    }
  }, [location?.state?.fromNotify])

  let [items, setItems] = useState([])
  let [isUpdateAvailable, setUpdateAvailable] = useState(false)
  let [delayUpdate, setDelayUpdate] = useState(false)

  let [autoLoading, setAutoLoading] = useState(false)

  const showUpdates = () => {
    let newApplications = newApplicationsFromToday(data.items, items)
    if (newApplications.length) {
    }

    setAutoLoading(true)
    setItems(clone(data.items))
    setUpdateAvailable(false)

    setTimeout(() => {
      setAutoLoading(false)
    }, 0.5 * SecondInMilliseconds)
  }

  useEffect(() => {
    if (!delayUpdate && isUpdateAvailable) {
      showUpdates()
    }
  }, [delayUpdate, isUpdateAvailable])

  const mutate = () => {
    mutateFormList()
    setDelayUpdate(false)
  }

  useEffect(() => {
    let hasUpdate = data?.items && !equals(items, data?.items)
    setUpdateAvailable(hasUpdate)

    if (hasUpdate && !delayUpdate) {
      showUpdates()
    }
  }, [JSON.stringify(data?.items)])

  let QueryMaxRangeDays = 31
  let DataRetentionDays = 90
  let minDate = subDays(todayRange.start, DataRetentionDays)

  let columns = useColumns({ mutate, items, brandId, setDelayUpdate })
  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          username={username}
          channel={channel}
          payment={state.payment}
          method={method}
          status={status}
          thirdOrderNo={state.thirdOrderNo}
          orderNo={state.orderNo}
          id={state.id}
          beginCreateOn={beginCreateOn}
          endCreateOn={endCreateOn}
          beginUpdateOn={beginUpdateOn}
          endUpdateOn={endUpdateOn}
          minDate={minDate}
          maxRangeDays={QueryMaxRangeDays}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading || autoLoading}
        />
        {data?.items?.length > 0 && (
          <Box>
            <DownloadButton
              id="export-report"
              isLoading={isLoading}
              href={urlWith(
                toSearchParams(),
                `${API}/exportDeposit/${brandId}`
              )}
              download="Deposit.xlsx"
            />
          </Box>
        )}
      </Level>
      <Table
        id="deposit"
        columns={columns}
        data={items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading || autoLoading}
        getRowId={(row) => row.id}
        localStorageKey={TableLocalStorageKey}
        toggleColumnHidden={true}
        menubar={Level}
        menuAddonBefore={<Summary key="summary" total={data?.sum} />}
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const Summary = ({ total, totalPromotion }) => {
  let totalDepositAmountLabel = useTotalDepositAmountTrans()
  if (!Number.isFinite(total)) {
    return null
  }

  return (
    <Blockquote borderColor="primary" padding="0.75rem">
      <Set>
        <Box>
          <Heading use="h5">
            {`${totalDepositAmountLabel}：`}
            <FormattedNumberDecimal
              id="total-amount"
              value={total}
              placeholder="-"
            />
          </Heading>
        </Box>
        {Number.isFinite(totalPromotion) && (
          <Box>
            <Heading use="h5">
              <Trans zh="优惠金额总计：" en="Total Promotion Amount：" />
              <FormattedNumberDecimal
                id="total-promotion-amount"
                value={totalPromotion}
                placeholder="-"
              />
            </Heading>
          </Box>
        )}
      </Set>
    </Blockquote>
  )
}

const newApplicationsFromToday = (first = [], second = []) => {
  if (!second || second.length === 0) {
    return []
  }

  let today = new Date()
  let lastMaxApplicationTime = max(
    second.reduce((times, { createdOn }) => {
      let value = parseISO(createdOn)
      if (isValid(value)) {
        times.push(value)
      }

      return times
    }, [])
  )

  const findSameById = (id, list = []) => list.find((item) => item.id === id)

  let result = first.filter(({ createdOn, id }) => {
    createdOn = parseISO(createdOn)
    return (
      isSameDay(today, createdOn) &&
      isAfter(createdOn, lastMaxApplicationTime) &&
      !findSameById(id, second)
    )
  })

  return result
}

const SearchBar = ({
  brandId,
  username,
  channel,
  payment,
  method,
  status,
  thirdOrderNo,
  orderNo,
  id,
  beginCreateOn,
  endCreateOn,
  beginUpdateOn,
  endUpdateOn,
  minDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      channel,
      payment,
      method,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn
    }
  })

  useEffect(() => {
    formMethods.reset({
      username,
      channel,
      payment,
      method,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn
    })
  }, [
    username,
    channel,
    payment,
    method,
    status,
    thirdOrderNo,
    orderNo,
    id,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  ])

  let usernameInputPlaceholder = useUserNameTrans()

  let channelNameInputPlaceholder = useChannelNameTrans()

  let paymentProviderPlaceholder = usePaymentProviderTrans()

  let paymentMethodPlaceholder = useDepositPaymentMethodTrans()

  let externalIdPlaceholder = useThirdPartyIdTrans()

  let orderIdPlaceholder = useGmsIdTrans()

  let idPlaceholder = useSystemIdTrans()
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <FieldStack id="field-stack" orientation="vertical" spacing="minor-2">
          <Set orientation="horizontal">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={usernameInputPlaceholder}
            />
            <InputField
              name="channel"
              showEmptyFieldValueAddonAfter
              placeholder={channelNameInputPlaceholder}
            />
            <PlatformPaymentProviderSelect
              name="payment"
              brandId={brandId}
              transferType={PlatformPaymentTransferType.Deposit}
              placeholder={paymentProviderPlaceholder}
            />
            <PaymentMethodSelect
              name="method"
              placeholder={paymentMethodPlaceholder}
            />
            <FundDepositStatusSelect id="status" name="status" />
            <InputField
              name="thirdOrderNo"
              placeholder={externalIdPlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <InputField
              name="orderNo"
              placeholder={orderIdPlaceholder}
              showEmptyFieldValueAddonAfter
            />
            <InputField
              name="id"
              placeholder={idPlaceholder}
              showEmptyFieldValueAddonAfter
            />
          </Set>
          <Set orientation="horizontal">
            <DateInputRangeField
              label={<ApplicationTimeTrans />}
              startProps={{
                name: "beginCreateOn"
              }}
              endProps={{
                name: "endCreateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
            />
            <DateInputRangeField
              label={<UpdatedTimeTrans />}
              startProps={{
                name: "beginUpdateOn"
              }}
              endProps={{
                name: "endUpdateOn"
              }}
              minDate={minDate}
              maxRangeDays={maxRangeDays}
            />
            <SearchButton
              isLoading={isLoading}
              disabled={isLoading}
              alignSelf="flex-end"
            />
          </Set>
        </FieldStack>
      </form>
    </FormProvider>
  )
}

const StatusCell = ({ value }) => {
  return <FundDepositStatusBox value={value} data-status={value} />
}

const useColumns = ({ brandId, items = [], mutate, setDelayUpdate }) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      noWrapTextColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "orderNo",
        Header: <GmsIdTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "thirdPartyOrderNo",
        Header: <ThirdPartyIdTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        id: "paymentMethod",
        accessor: (row) => row,
        Header: <DepositPaymentMethodTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box>
              <PaymentMethodLabel value={value?.paymentMethodId} />
            </Box>
          )
        }
      }),
      noWrapTextColumn({
        accessor: "channelName",
        Header: <PaymentNameTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <DepositAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "actualAmount",
        accessor: (row) => row,
        Header: <ActualDepositAmountTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let { status, amount, actualAmount } = record
          if (!isFundDepositApproved(status)) {
            return null
          }

          return <FormattedNumberDecimal value={actualAmount ?? amount} />
        }
      }),
      numberDecimalColumn({
        id: "handlingFee",
        accessor: (row) => row,
        Header: <TransferFeeTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let approved = isFundDepositApproved(record?.status)
          if (approved) {
            return (
              <FormattedNumberDecimal
                value={record?.handlingFee}
                placeholder="-"
              />
            )
          }
          return "-"
        }
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <ApplicationTimeTrans />,
        disableSortBy: true
      }),

      dateTimeColumn({
        accessor: "updatedOn",
        Header: <UpdatedTimeTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: StatusCell
      }),
      noWrapTextColumn({
        accessor: "agentName",
        Header: <UpperLevelAgentTrans />,
        disableSortBy: true,
        Cell: ({ value = "-" }) => {
          return value || "-"
        }
      }),
      noWrapTextColumn({
        accessor: "reviewedUsername",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      noWrapTextColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      }),
      noWrapTextColumn({
        accessor: "promotionName",
        Header: <PromotionNameTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "bonus",
        accessor: (row) => row,
        Header: <PromotionAmountTrans />,
        disableSortBy: true,
        toValue: (record = {}) => {
          //TODO: confirm backend field name & test case
          let amount = record?.promotionDetail?.bonus ?? record?.bonus
          return amount
        }
      })
    ]

    if (hasUpdateMenu) {
      columns.push(
        noWrapTextColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <ActionTrans />,
          Cell: ({ value }) => {
            let underReview =
              value?.status === FundDepositStatus.Review ||
              value?.status === FundDepositStatus.WaitingPayment
            return (
              <Set
                alignX="center"
                orientation="horizontal"
                css={css`
                  width: max-content;
                `}
              >
                {underReview && (
                  <VerifyFundDepositDisclosure
                    id="verify-deposit-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    playerCode={value.playerCode}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                <ViewFundDepositDisclosure
                  id="view-deposit-dialog-disclosure"
                  brandId={brandId}
                  formId={value.id}
                  playerCode={value.playerCode}
                  onVisibleChange={(visible) => {
                    let delayUpdate = visible
                    setDelayUpdate(delayUpdate)
                  }}
                />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items), setDelayUpdate])
}
