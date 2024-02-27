import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Stack,
  Button,
  Set,
  Text,
  Box,
  Dialog,
  Icon,
  Level,
  Tabs
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import {
  BrandPaymentStatusSelect,
  BrandPaymentStatusToggleButton
} from "./BrandPaymentStatus"
import TransferType, {
  isWithdrawalPlatformPayment
} from "./BrandPaymentTransferType"
import {
  useChangeBrandPaymentOrders,
  useBrandPaymentList,
  useBrandPaymentBalanceList
} from "./client"
import { View as ViewMenu, Update as UpdateMenu } from "./menu"
import { Detail as ConditionDetail } from "./condition"
import { AddBrandPaymentButton, EditButton } from "./edit"
import { ViewButton as LogsButton } from "./logs"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { AlertDialog } from "../../dialog/Alert"
import { DesignatedPlayersLink } from "./DesignatedPlayersLink"
import { InputField } from "../../input/Input"
import { formatNumber } from "../../number/format"
import BrandBar from "../../report/BrandBar"
import textColumn from "../../table/column/textColumn"
import {
  PaymentProviderLabel,
  isManualPaymentProvider
} from "../../payment/PaymentProvider"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import { PaymentChannelLabel } from "../../payment/channel/PaymentChannel"
import { NumberInput } from "../../input/NumberInput"
import { BrandAutoWithdrawDialogDisclosure } from "./BrandAutoWithdraw"
import { ActionTrans, ConfirmOrderTrans } from "../../trans/Action"
import {
  ChannelNameTrans,
  DepositTrans,
  MerchantBalanceTrans,
  PaymentChannelTrans,
  PaymentLimitTrans,
  PaymentManagementTrans,
  PaymentMethodTrans,
  PaymentProviderTrans,
  WithdrawTrans
} from "../../trans/Payment"
import { StatusTrans } from "../../trans/Status"
import { OrderTrans } from "../../trans/Field"
import { DesignatedUsersTrans } from "../../trans/User"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

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

const BodyContent = ({ brandId }) => {
  const DefaultTransferType = TransferType.Deposit
  const [transferType, setTransferType] = React.useState(DefaultTransferType)
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    paymentStatus: null,
    keyword: ""
  })

  let { isLoading, data, error, mutate, deleteCache } = useBrandPaymentList({
    ...toApiParams(state),
    transferType,
    sortby: "number"
  })

  useEffect(() => {
    setState({
      pageIndex: 0,
      brandId
    })
  }, [brandId])

  const activeTab = (newTransferType) => () => {
    setTransferType(newTransferType)
    setState({
      pageIndex: 0
    })
    deleteCache()
    mutate(null)
  }

  return (
    <PageContent
      title={<PaymentManagementTrans />}
      actionBar={
        <Level>
          <SearchBar
            search={(newState) => {
              setState({ pageIndex: 0, ...newState })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Set>
            {isWithdrawalPlatformPayment(transferType) && (
              <BrandAutoWithdrawDialogDisclosure brandId={brandId} />
            )}
            <AddBrandPaymentButton
              id="add-payment-dialog-disclosure"
              transferType={transferType}
              brandId={brandId}
              onSubmitted={mutate}
            />
          </Set>
        </Level>
      }
    >
      <Tabs selectedId={transferType}>
        <Tabs.List>
          <Tabs.Tab
            tabId={TransferType.Deposit}
            onClick={activeTab(TransferType.Deposit)}
          >
            <DepositTrans />
          </Tabs.Tab>
          <Tabs.Tab
            tabId={TransferType.Withdrawal}
            onClick={activeTab(TransferType.Withdrawal)}
          >
            <WithdrawTrans />
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel tabId={TransferType.Deposit} paddingTop="1rem">
          <DataTable
            state={state}
            data={data}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            transferType={transferType}
            mutate={mutate}
            isLoading={isLoading}
            brandId={brandId}
          />
        </Tabs.Panel>
        <Tabs.Panel tabId={TransferType.Withdrawal} paddingTop="1rem">
          <DataTable
            state={state}
            data={data}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            transferType={transferType}
            mutate={mutate}
            isLoading={isLoading}
            brandId={brandId}
          />
        </Tabs.Panel>
      </Tabs>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

export const CodeContentPair = [Code, Content]

const DataTable = ({
  state,
  data,
  setPageIndex,
  setSortOrder,
  transferType,
  mutate,
  isLoading,
  brandId
}) => {
  let editable = useIsDisplayMenuByRoute([UpdateMenu])

  let { pageSize } = state

  let formMethods = useForm()

  let [displayOrders, setDisplayOrders] = useState({})
  const setDisplayOrder = (id, displayOrder) => {
    setDisplayOrders((state) => {
      Reflect.set(state, id, displayOrder)
      return state
    })
  }

  let [formData, setSubmit] = useState()
  let {
    result,
    isLoading: isChangingDisplayOrder,
    error,
    deleteCache
  } = useChangeBrandPaymentOrders(formData)

  const onSubmit = () => {
    let orders = Object.entries(displayOrders).map(([key, value]) => ({
      id: key,
      displayOrder: value
    }))

    if (orders.length > 0) {
      setSubmit({ orders })
    }
  }

  const reset = () => {
    setDisplayOrders({})
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      mutate()
    }
  }, [result, error])

  let columns = useColumns({
    transferType,
    mutate,
    displayOrders,
    setDisplayOrder,
    items: data?.items ?? [],
    brandId
  })
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack spacing="minor-1">
          <Table
            columns={columns}
            data={data?.items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            getRowId={(row) => row.id}
          />
          {editable && (
            <Dialog.Footer position="sticky" bottom="0">
              <Button
                isLoading={isChangingDisplayOrder}
                disabled={isLoading || isChangingDisplayOrder}
                type="submit"
              >
                <ConfirmOrderTrans />
              </Button>
            </Dialog.Footer>
          )}
        </Stack>
      </form>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </FormProvider>
  )
}

const SearchBar = ({ search, isLoading, ...props }) => {
  let formMethods = useForm()
  let keywordPlaceholder = useSearchInputPlaceHolder()
  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <BrandPaymentStatusSelect name="paymentStatus" />
          <InputField
            name="keyword"
            defaultValue=""
            showEmptyFieldValueAddonAfter
            placeholder={keywordPlaceholder}
            autocomplete="off"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

//TODO: lazy load fetch
const BrandPaymentBalance = ({ brandId, brandPaymentId }) => {
  let {
    isLoading,
    data: items,
    mutate,
    deleteCache
  } = useBrandPaymentBalanceList(brandId, { id: [brandPaymentId] })
  let record = items?.find((item) => item.brandPaymentId === brandPaymentId)
  return (
    <Set
      alignX="right"
      alignY="center"
      css={css`
        width: max-content;
      `}
    >
      <Box alignX="right">
        <FormattedNumberDecimal value={record?.balance} placeholder="-" />
      </Box>
      <Button
        palette="gray"
        variant="ghost"
        size="small"
        isLoading={isLoading}
        disabled={isLoading}
        onClick={() => {
          if (!isLoading) {
            deleteCache()
            mutate(null)
          }
        }}
      >
        <Icon icon={faRotateLeft} type="font-awesome" />
      </Button>
    </Set>
  )
}

const useColumns = ({
  transferType,
  displayOrders,
  setDisplayOrder,
  mutate,
  brandId,
  items = []
}) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([UpdateMenu])
  let hasViewAuth = useIsDisplayMenuByRoute([ViewMenu])
  let hasEditAuth = useIsDisplayMenuByRoute([UpdateMenu])

  return useMemo(() => {
    let columns = [
      textColumn({
        id: "displayOrder",
        accessor: (record) => record,
        Header: <OrderTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!hasUpdateAuth) {
            return value.number ?? null
          }

          let { id } = value

          let displayOrder = displayOrders[id] ?? value.number
          return (
            <NumberInput
              name={id}
              size="small"
              required
              min="1"
              minLength="1"
              width="5em"
              defaultValue={displayOrder}
              onChange={(event) => {
                let displayOrder = parseInt(event.target.value)
                if (Number.isFinite(displayOrder)) {
                  setDisplayOrder(id, displayOrder)
                }
              }}
            />
          )
        }
      }),
      textColumn({
        accessor: "paymentId",
        Header: <PaymentProviderTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentProviderLabel value={value} />
      }),
      textColumn({
        accessor: "paymentMethodId",
        Header: <PaymentMethodTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentMethodLabel value={value} />
      }),
      textColumn({
        accessor: "paymentChannelId",
        Header: <PaymentChannelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PaymentChannelLabel value={value} />
      }),
      textColumn({
        accessor: "channelName",
        Header: <ChannelNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "target",
        accessor: (record) => record,
        Header: <Trans zh="开放对象" en="Target" />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <ConditionDetail brandId={brandId} record={value} />
        )
      }),
      textColumn({
        id: "designatedUsers",
        accessor: (record) => record,
        Header: <DesignatedUsersTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <DesignatedPlayersLink record={value} />
      }),
      textColumn({
        id: "limit",
        accessor: (record) => record,
        Header: <PaymentLimitTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let from = formatNumber(value.transferLimitFrom)
          let to = formatNumber(value.transferLimitTo)
          return (
            <Text.Block whiteSpace="nowrap">{`${from} - ${to}`}</Text.Block>
          )
        }
      }),
      textColumn({
        id: "paymentStatus",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <BrandPaymentStatusToggleButton
              record={value}
              disabled={!hasUpdateAuth}
              onSubmitted={mutate}
            />
          )
        }
      }),
      numberDecimalColumn({
        id: "merchantBalance",
        accessor: (row) => row,
        Header: <MerchantBalanceTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) =>
          isManualPaymentProvider(record.paymentName) ? (
            "-"
          ) : (
            <BrandPaymentBalance brandId={brandId} brandPaymentId={record.id} />
          )
      })
    ]

    if (hasViewAuth || hasEditAuth) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <ActionTrans />,
          Cell: ({ value }) => {
            return (
              <Set alignX="center">
                <EditButton
                  brandId={brandId}
                  platformPaymentId={value?.id}
                  onSubmitted={mutate}
                  dialogId="edit-platform-payment-dialog"
                />
                {/* 
                <FeeEditButton
                  brandId={brandId}
                  record={value}
                  onSubmitted={mutate}
                /> 
                */}
                <LogsButton brandId={brandId} record={value} />
              </Set>
            )
          }
        })
      )
    }
    return columns
  }, [transferType, JSON.stringify(items)])
}

const useSearchInputPlaceHolder = () =>
  useTrans({
    zh: "关键字搜索",
    en: "Search..."
  })
