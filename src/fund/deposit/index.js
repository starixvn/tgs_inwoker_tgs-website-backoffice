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
  useModalState,
  Flex,
  Level,
  FieldStack,
  FieldWrapper,
  useToasts,
  Dialog,
  Card,
  Alert,
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
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
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
  FundDepositStatusLabel,
  FundDepositStatusSelect
} from "./FundDepositStatus"
import maxTime from "date-fns/max"
import isValidTime from "date-fns/isValid"
import { SortOrder } from "../../table/order"
import { startOfNextDay } from "../../date/startOfNextDay"
import { sortBy, head } from "lodash-es"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import { subDays, parseISO, isAfter, isSameDay } from "date-fns"

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
    channelName,
    method,
    status,
    beginCreateOn,
    endCreateOn,
    beginUpdateOn,
    endUpdateOn
  } = state
  let {
    data = {},
    isValidating,
    isLoading,
    mutate: mutateFormList,
    error,
    deleteCache
  } = useFundDepositFormList(brandId, toSearchParams(), {
    refreshInterval: 10 * SecondInMilliseconds //10s
  })

  useEffect(() => {
    if (location?.state?.fromNotify) {
      deleteCache()

      todayRange = today()
      setState({
        pageIndex: 0,
        username: "",
        channelName: "",
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

  let newOrder = useTrans({
    zh: "新订单",
    en: "new order"
  })
  let multipleOrder = useTrans({
    zh: "New orders",
    en: "Multiple new orders"
  })
  let toasts = useToasts()

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
    <PageContent
      title={<Trans zh="充值列表" en="Deposit List" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            username={username}
            channelName={channelName}
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
      }
    >
      <Summary total={data?.sum} />
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
      />
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
        <Trans zh="充值金额总计：" en="Total Deposit Amount：" />
        <FormattedNumberDecimal id="total-amount" value={total} />
      </Heading>
    </Blockquote>
  )
}

/*
const ActionFooter = ({ brandId, items = [], mutate, setDelayUpdate }) => {
  return null //POC

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  let record = nextVerifiable(items)
  if (!record) {
    return null
  }

  return (
    <Dialog.Footer position="sticky" bottom="0" alignX="right">
      <VerifyFundDepositDisclosure
        brandId={brandId}
        formId={record.id}
        onSubmitted={mutate}
        onVisibleChange={(visible) => {
          let delayUpdate = visible
          setDelayUpdate(delayUpdate)
        }}
      />
    </Dialog.Footer>
  )
}

const nextVerifiable = (items = []) => {
  let verifiableItems = items.filter(
    (item) => item.status === FundReviewStatus.Review
  )
  let sortedItems = sortBy(verifiableItems, ["updatedOn", "createdOn"])
  let result = head(sortedItems)
  return result ? clone(result) : undefined
}
*/

const newApplicationsFromToday = (first = [], second = []) => {
  if (!second || second.length === 0) {
    return []
  }

  let today = new Date()
  let lastMaxApplicationTime = maxTime(
    second.reduce((times, { createdOn }) => {
      let value = parseISO(createdOn)
      if (isValidTime(value)) {
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
      channelName,
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
      channelName,
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
    channelName,
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

  let usernameInputPlaceholder = useTrans({
    zh: "用户名",
    en: "Username"
  })

  let channelNameInputPlaceholder = useTrans({
    zh: "通道名称",
    en: "Channel Name"
  })

  let paymentMethodPlaceholder = useTrans({
    zh: "充值类型",
    en: "Deposit Method"
  })

  let externalIdPlaceholder = useTrans({
    zh: "三方订单编号",
    en: "3rd Party Id"
  })
  let orderIdPlaceholder = useTrans({
    zh: "GMS订单号",
    en: "GMS Id"
  })
  let idPlaceholder = useTrans({
    zh: "系统订单编号",
    en: "System Id"
  })
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <FieldStack orientation="vertical">
          <Set orientation="horizontal">
            <InputField
              name="username"
              showEmptyFieldValueAddonAfter
              placeholder={usernameInputPlaceholder}
            />
            <InputField
              name="channelName"
              showEmptyFieldValueAddonAfter
              placeholder={channelNameInputPlaceholder}
            />
            <PaymentMethodSelect
              name="method"
              placeholder={paymentMethodPlaceholder}
            />
            <FundDepositStatusSelect name="status" />
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
              label={<Trans zh="申请时间" en="Application Time" />}
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
              label={<Trans zh="更新时间" en="Updated Time" />}
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

const useColumns = ({ brandId, items = [], mutate, setDelayUpdate }) => {
  let hasUpdateMenu = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "userName",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "orderNo",
        Header: <Trans zh="GMS订单号" en="GMS Id" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "thirdPartyOrderNo",
        Header: <Trans zh="三方单号" en="3rd Party Id" />,
        disableSortBy: true
      }),
      textColumn({
        id: "paymentMethod",
        accessor: (row) => row,
        Header: <Trans zh="充值类型" en="Payment Method" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box>
              <PaymentMethodLabel value={value?.paymentMethodId} />
            </Box>
          )
        }
      }),
      textColumn({
        accessor: "channelName",
        Header: <Trans zh="通道名称" en="Payment Name" />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="充值金额" en="Amount" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "createdOn",
        Header: <Trans zh="申请时间" en="Application Time" />,
        disableSortBy: true
      }),

      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="更新时间" en="Update Time" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <FundDepositStatusLabel value={value} data-status={value} />
        )
      })
    ]

    columns.push(
      textColumn({
        accessor: "reviewedUserName",
        Header: <Trans zh="操作者" en="Operator" />,
        disableSortBy: true
      })
    )

    columns.push(
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true,
        Cell: ({ value }) => <Box>{value}</Box>
      }),
      textColumn({
        accessor: "promotionName",
        Header: <Trans zh="活动名称" en="Promotion Name" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonus",
        Header: <Trans zh="优惠金额" en="Promotion Bonus" />,
        disableSortBy: true
      })
    )

    if (hasUpdateMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <Trans zh="操作" en="Actions" />,
          Cell: ({ value }) => {
            let underReview =
              value?.status === FundDepositStatus.Review ||
              value?.status === FundDepositStatus.WaitingPayment
            return (
              <Set alignX="center">
                {underReview && (
                  <VerifyFundDepositDisclosure
                    id="verify-deposit-dialog-disclosure"
                    brandId={brandId}
                    formId={value.id}
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
