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
  Flex,
  Level,
  FieldStack,
  Blockquote
} from "bumbag"
import PageContent from "../../page/Content"
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
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { today } from "../../date/range"
import FundWithdrawStatus, {
  FundWithdrawStatusLabel,
  FundWithdrawStatusSelect,
  isFundApproved,
  isFundInvalid,
  isFundPaid,
  isFundUnderReview
} from "./FundWithdrawStatus"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { useFundWithdrawFormList, API } from "./client"
import { startOfNextDay } from "../../date/startOfNextDay"
import { SortOrder } from "../../table/order"
import { Update } from "./menu"
import { ViewFundWithdrawDisclosure } from "./ViewFundWithdraw"
import { VerifyFundWithdrawDisclosure } from "./VerifyFundWithdraw"
import { PaymentMethodSelect } from "../../payment/method/PaymentMethod"
import { UserTypeLabel, UserTypeSelect } from "./UserType"
import clone from "clone-deep"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import { subDays, parseISO, isAfter, isSameDay, isValid, max } from "date-fns"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import { FundWithdrawPaidDialogDisclosure } from "./FundWithdrawPaid"
import { RejectFundWithdrawDisclosure } from "./RejectFundWithdraw"
import { BrandPaymentMultiSelect } from "../../system/brandpayments/BrandPaymentMultiSelect"
import {
  PlatformPaymentProviderSelect,
  PlatformPaymentTransferType
} from "../../payment/PlatformPaymentProviderSelect"
import { ActionTrans, OperatorTrans, RemarkTrans } from "../../trans/Action"
import {
  PaidTimeTrans,
  WithdrawAmountTrans,
  usePaymentProviderTrans
} from "../../trans/Payment"
import {
  GmsIdTrans,
  ThirdPartyIdTrans,
  useGmsIdTrans,
  useSystemIdTrans,
  useThirdPartyIdTrans
} from "../../trans/Platform"
import {
  UserNameTrans,
  UserTypeTrans,
  useUserNameTrans
} from "../../trans/User"
import { ApplicationTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const SecondInMilliseconds = 1000
const MinuteInMilliseconds = 60000

const BodyContent = ({ brandId }) => {
  let location = useLocation()

  let todayRange = today()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: "",
    channelName: "",
    payment: "",
    status: location?.state?.status ?? FundWithdrawStatus.UnprocessedStatus,
    thirdOrderNo: "",
    orderNo: "",
    beginCreateOn: todayRange.start,
    endCreateOn: todayRange.end,
    beginUpdateOn: undefined,
    endUpdateOn: undefined,
    brandPaymentIds: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let {
    pageIndex,
    pageSize,
    username,
    channelName,
    status,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  } = state

  let culture = useLangCode()

  const toSearchParams = () => ({
    ...toApiParams(state),
    bc: state.beginCreateOn,
    ec: startOfNextDay(state.endCreateOn),
    bu: state.beginUpdateOn,
    eu: startOfNextDay(state.endUpdateOn),
    /*
      Note. backend api use 'bpid' instead of 'brandPaymentIds'
     */
    brandPaymentIds: undefined,
    bpid: state.brandPaymentIds,
    sortby: "CreatedOn",
    orderby: SortOrder.Descending,
    culture
  })

  let {
    isLoading: isLoadingBrandPayment,
    data: brandPaymentList,
    error: brandPaymentListError
  } = useBrandPaymentList({
    brandId,
    transferType: BrandPaymentTransferType.Withdrawal,
    showAll: true
  })

  let manualBrandPaymentIdList = brandPaymentList?.items
    ?.filter?.(({ paymentName, ...rest }) => paymentName == "Manual")
    .map(({ id }) => id)

  let {
    data = {},
    isValidating,
    isLoading,
    mutate: mutateFormList,
    error,
    deleteCache
  } = useFundWithdrawFormList(brandId, toSearchParams(), {
    refreshInterval: 10 * SecondInMilliseconds
  })

  useEffect(() => {
    if (location?.state?.fromNotify) {
      deleteCache()

      todayRange = today()
      setState({
        pageIndex: 0,
        username: "",
        channelName: "",
        payment: "",
        status: location?.state?.status ?? "",
        thirdOrderNo: "",
        orderNo: "",
        id: "",
        beginCreateOn: todayRange.start,
        endCreateOn: todayRange.end,
        beginUpdateOn: undefined,
        endUpdateOn: undefined,
        brandPaymentIds: undefined
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
      // notifyAudio.play()
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

  let columns = useColumns({
    mutate,
    items,
    brandId,
    setDelayUpdate,
    manualBrandPaymentIdList
  })
  return (
    <PageContent
      title={<Trans zh="提款列表" en="Withdraw List" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            username={username}
            channelName={channelName}
            payment={state.payment}
            status={status}
            thirdOrderNo={state.thirdOrderNo}
            orderNo={state.orderNo}
            id={state.id}
            beginCreateOn={beginCreateOn}
            endCreateOn={endCreateOn}
            beginUpdateOn={beginUpdateOn}
            endUpdateOn={endUpdateOn}
            brandPaymentIds={state.brandPaymentIds}
            minDate={minDate}
            maxRangeDays={QueryMaxRangeDays}
            search={(data = {}) => {
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
                  `${API}/exportWithdraw/${brandId}`
                )}
                download="Withdraw.xlsx"
              />
            </Box>
          )}
        </Level>
      }
    >
      <FieldStack>
        <Summary total={data?.sum} />
        <Table
          id="withdraw"
          columns={columns}
          data={items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading || autoLoading}
          getRowId={(row) => row.id}
        />
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const Summary = ({ total }) => {
  if (!Number.isFinite(total)) {
    return null
  }

  return (
    <Blockquote borderColor="primary">
      <Heading use="h5">
        <Trans zh="提款金额总计：" en="Total Withdraw Amount：" />
        <FormattedNumberDecimal id="total-amount" value={total} />
      </Heading>
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
  channelName,
  payment,
  status,
  thirdOrderNo,
  orderNo,
  id,
  beginCreateOn,
  endCreateOn,
  beginUpdateOn,
  endUpdateOn,
  brandPaymentIds,
  minDate,
  maxRangeDays,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      channelName,
      payment,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn,
      brandPaymentIds
    }
  })

  useEffect(() => {
    formMethods.reset({
      username,
      channelName,
      payment,
      status,
      thirdOrderNo,
      orderNo,
      id,
      beginCreateOn,
      endCreateOn,
      beginUpdateOn,
      endUpdateOn,
      brandPaymentIds
    })
  }, [
    username,
    channelName,
    payment,
    status,
    thirdOrderNo,
    orderNo,
    id,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn,
    brandPaymentIds
  ])

  let usernameInputPlaceholder = useUserNameTrans()

  let platformPaymentPlaceholder = useTrans({
    zh: "提款通道",
    en: "Withdrawal Channel"
  })

  let paymentProviderPlaceholder = usePaymentProviderTrans()
  let externalIdPlaceholder = useThirdPartyIdTrans()
  let orderIdPlaceholder = useGmsIdTrans()
  let idPlaceholder = useSystemIdTrans()
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal" alignY="bottom">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={usernameInputPlaceholder}
            />
            <UserTypeSelect name="userType" />
            <PlatformPaymentProviderSelect
              name="payment"
              brandId={brandId}
              transferType={PlatformPaymentTransferType.Withdrawal}
              placeholder={paymentProviderPlaceholder}
            />
            <FundWithdrawStatusSelect id="status-select" name="status" />
            <BrandPaymentMultiSelect
              name="brandPaymentIds"
              brandId={brandId}
              transferType={PlatformPaymentTransferType.Withdrawal}
              placeholder={platformPaymentPlaceholder}
            />
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

const useColumns = ({
  brandId,
  items = [],
  mutate,
  setDelayUpdate,
  manualBrandPaymentIdList = []
}) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "userName",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "userType",
        Header: <UserTypeTrans />,
        Cell: ({ value }) => <UserTypeLabel value={value} />
      }),
      textColumn({
        accessor: "orderNo",
        Header: <GmsIdTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "thirdPartyOrderNo",
        Header: <ThirdPartyIdTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <WithdrawAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "actualAmount",
        accessor: (row) => row,
        Header: (
          <Trans
            zh="实际提款金额"
            en="Actual Amount"
            vi="Số tiền rút thực tế"
          />
        ),
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let { status, amount, actualAmount } = record
          if (!isFundPaid(status)) {
            return null
          }

          return <FormattedNumberDecimal value={actualAmount ?? amount} />
        }
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <ApplicationTimeTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "paidOn",
        Header: <PaidTimeTrans />,
        disableSortBy: true,
        placeholder: "-"
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <FundWithdrawStatusLabel value={value} data-status={value} />
        )
      })
    ]

    columns.push(
      textColumn({
        accessor: "reviewedUserName",
        Header: <OperatorTrans />,
        disableSortBy: true
      })
    )

    columns.push(
      textColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      })
    )

    if (hasUpdateMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <ActionTrans />,
          Cell: ({ value, status }) => {
            let { brandPaymentId } = value
            let underReview = isFundUnderReview(value?.status)

            let reviewPaid = isFundApproved(value?.status) /* &&
              manualBrandPaymentIdList.includes(brandPaymentId)
              */

            let invalid = isFundInvalid(value?.status)

            let isPlayer = value?.userType === "Player"
            return (
              <Set alignX="center">
                {underReview && (
                  <VerifyFundWithdrawDisclosure
                    id="verify-withdraw-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    playerCode={isPlayer && value?.userId}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                {reviewPaid && (
                  <FundWithdrawPaidDialogDisclosure
                    id="review-paid-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
                <ViewFundWithdrawDisclosure
                  id="view-withdraw-dialog-disclosure"
                  brandId={brandId}
                  formId={value.id}
                  onVisibleChange={(visible) => {
                    let delayUpdate = visible
                    setDelayUpdate(delayUpdate)
                  }}
                />
                {invalid && (
                  <RejectFundWithdrawDisclosure
                    id="reject-withdraw-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
                    onSubmitted={mutate}
                    onVisibleChange={(visible) => {
                      let delayUpdate = visible
                      setDelayUpdate(delayUpdate)
                    }}
                  />
                )}
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items), JSON.stringify(manualBrandPaymentIdList)])
}
