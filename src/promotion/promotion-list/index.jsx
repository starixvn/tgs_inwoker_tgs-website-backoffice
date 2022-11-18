import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, Flex, Stack, Dialog } from "bumbag"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, View, Update } from "./menu"
import textColumn from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import { useForm, FormProvider } from "react-hook-form"
import { Input, InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { PageContent } from "../../page/Content"
import AlertDialog from "../../dialog/Alert"
import { Trans, useTrans } from "../../i18n"
import {
  AddPromotionDisclosure,
  EditPromotionDisclosure,
  ViewPromotionDisclosure
} from "./edit"
import equals from "fast-deep-equal"
import {
  usePromotionList,
  useDeletePromotion,
  useChangePromotionOrders
} from "./client"
import BrandBar from "../../report/BrandBar"
import { formatDateTime, formatDayMonthYear } from "../../date/format"
import { PromotionTypeLabel, usePromotionGroupLabelOf } from "../PromotionType"
import { VipLevelListDialogDisclosure } from "../../vip-levels/VipLevelList"
import { formatNumber } from "../../number/format"
import PromotionStatus, {
  PromotionStatusSelect,
  PromotionStatusSwitch
} from "./PromotionStatus"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { SortOrder } from "../../table/order"
import { isDev } from "../../env"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { NumberInput } from "../../input/NumberInput"
import { isWithinRange } from "../../date/range"

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

const BodyContent = ({ brandId }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: "",
    name: "",
    brandId,
    from: undefined,
    to: undefined
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, deleteCache } = usePromotionList(
    brandId ? { ...toApiParams(state), sortby: "number" } : undefined
  )

  return (
    <PageContent
      title={<Trans zh="活动管理" en="Promotion" />}
      actionBar={
        <Flex justifyContent="space-between">
          <SearchBar
            status={state?.status}
            name={state?.name}
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
          <AddPromotionDisclosure
            id="add-promotion-dialog-disclosure"
            brandId={brandId}
            onSubmitted={mutate}
          />
        </Flex>
      }
    >
      <DataTable
        brandId={brandId}
        state={state}
        data={data}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        mutate={mutate}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const DataTable = ({
  brandId,
  state,
  data,
  setPageIndex,
  setSortOrder,
  isLoading,
  mutate
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

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
    mutate: mutateChangePromotionOrders,
    deleteCache
  } = useChangePromotionOrders(formData)

  const onSubmit = (formData) => {
    let orders = []
    Object.entries(displayOrders).forEach(([id, value]) => {
      orders.push({
        id,
        displayOrder: value
      })
    })

    if (orders.length > 0) {
      setSubmit({
        orders
      })
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

  const items = data?.items ?? []

  let columns = useColumns({
    brandId,
    items,
    mutate,
    formMethods,
    displayOrders,
    setDisplayOrder
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack spacing="major-1">
          <Table
            id="promotion"
            columns={columns}
            data={data?.items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(state?.pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            getRowId={(row) => row.id}
          />
          {error && <AlertDialog {...error} onClickClose={deleteCache} />}
          {editable && (
            <Dialog.Footer position="sticky" bottom="0">
              <Button isLoading={isChangingDisplayOrder} type="submit">
                <Trans zh="确认排序" en="Confirm Order" />
              </Button>
            </Dialog.Footer>
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}

const SearchBar = ({
  status = "",
  name = "",
  start,
  end,
  search,
  isLoading
}) => {
  let namePlaceholder = useTrans({
    zh: "名称",
    en: "Name"
  })
  let formMethods = useForm({
    defaultValues: { status, name, start, end }
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <Set>
          <DateInputRange />
          <PromotionStatusSelect name="status" />
          <InputField
            name="name"
            showEmptyFieldValueAddonAfter
            placeholder={namePlaceholder}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  brandId,
  items = [],
  mutate,
  displayOrders = {},
  setDisplayOrder
}) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasAnyMenu = hasUpdateAuth || hasViewAuth

  return useMemo(() => {
    let columns = [
      textColumn({
        id: "displayOrder",
        accessor: (row) => row,
        Header: <Trans zh="序" en="Order" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          if (!hasUpdateAuth) {
            return value.displayOrder ?? null
          }

          let { id } = value
          let displayOrder = displayOrders[id] ?? value.number
          return (
            <NumberInput
              name={id}
              size="small"
              width="5em"
              defaultValue={displayOrder}
              required
              min="1"
              minLength="1"
              registerOptions={{
                valueAsNumber: true
              }}
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
        accessor: "name",
        Header: <Trans zh="活动名称" en="Promotion Name" />,
        disableSortBy: true
      }),
      textColumn({
        id: "promotionTypeGroup",
        accessor: (row) => row,
        Header: <Trans zh="活动类型" en="Promotion Type" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let group = usePromotionGroupLabelOf(value?.promotionType) ?? ""
          return group
        }
      }),
      textColumn({
        accessor: "promotionType",
        Header: <Trans zh="活动子类型" en="Promotion SubType" />,
        disableSortBy: true,
        Cell: ({ value }) => <PromotionTypeLabel value={value} />
      }),
      textColumn({
        id: "promotionTime",
        accessor: (row) => row,
        Header: <Trans zh="活动时间" en="Promotion Period" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let from = formatDayMonthYear(value?.from)
          let to = formatDayMonthYear(value?.to)
          return `${from} - ${to}`
        }
      }),
      textColumn({
        accessor: "vipLevels",
        Header: <Trans zh="活动用户群" en="User Group" />,
        disableSortBy: true,
        Cell: ({ value: vipLevels }) => {
          let dialogTitle = useTrans({
            zh: "活动用户群",
            en: "User Group"
          })

          if (!vipLevels || vipLevels?.length === 0) {
            return "-"
          }

          return (
            <VipLevelListDialogDisclosure
              dialogTitle={dialogTitle}
              vipLevels={vipLevels}
            />
          )
        }
      }),
      textColumn({
        id: "amounts",
        accessor: (row) => row,
        Header: <Trans zh="活动费用" en="Promotion Fund" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let unlimited = value?.unlimited
          let amountUsed = formatNumber(value?.amountUsed)
          let totalAmountLimit = formatNumber(value?.totalAmountLimit)
          return unlimited ? "-" : `${amountUsed}/${totalAmountLimit}`
        }
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "status",
          Header: <Trans zh="状态" en="Status" />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            return (
              <PromotionStatusSwitch
                name="status"
                record={record}
                value={record?.status}
                onSubmitted={mutate}
              />
            )
          }
        })
      )

      columns.push(
        textColumn({
          id: "actions",
          Header: <Trans zh="操作" en="Action" />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            //TODO: disabled EditPromotionDisclosure: disabled={withinPromotionRange}
            let now = new Date()
            let withinPromotionRange = isWithinRange(now, {
              start: record?.from,
              end: record?.to
            })

            return (
              <Set alignX="center">
                <ViewPromotionDisclosure
                  id="view-promotion-dialog-disclosure"
                  brandId={brandId}
                  record={record}
                />
                <EditPromotionDisclosure
                  id="edit-promotion-dialog-disclosure"
                  brandId={brandId}
                  record={record}
                  onSubmitted={mutate}
                />
                {hasUpdateAuth && (
                  <ConfirmDeleteDialogDisclosure
                    disabled={record.status != PromotionStatus.Disabled}
                    id="delete-promotion-dialog-disclosure"
                    dialogId="delete-promotion-dialog"
                    useFetch={useDeletePromotion}
                    onSubmit={() => {
                      return record.id
                    }}
                    onSubmitted={mutate}
                    addonAfter={
                      <Input type="hidden" name="id" value={record.id} />
                    }
                  />
                )}
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
