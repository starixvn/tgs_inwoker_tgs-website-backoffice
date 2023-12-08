import React, { useState, useEffect, useMemo, useRef } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set, Text, Flex, Stack, Dialog, Group } from "bumbag"
import { useIsDisplayMenuByRoute, useUserBrandId } from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Code, View, Update } from "./menu"
import textColumn from "../../table/column/textColumn"
import dateTimeColumn from "../../table/column/dateTime"
import {
  useForm,
  FormProvider,
  useWatch,
  useFormContext
} from "react-hook-form"
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
import { usePromotionTypeList } from "../client"
import BrandBar from "../../report/BrandBar"
import { formatDateTime, formatDayMonthYear } from "../../date/format"
import {
  PromotionTypeGroupSelect,
  PromotionTypeSelect,
  PromotionTypeLabel,
  usePromotionGroupLabelOf
} from "../PromotionType"
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
import { isAfter } from "../../date/isAfter"
import { PromotionChangeLogListDialogDisclosure } from "./ChangeLogListDialog"
import { CopyPromotionDisclosure } from "./CopyPromotion"
import { formatDateOnly } from "../../date/format"
import {
  PromotionFundTrans,
  PromotionManagementTrans,
  PromotionNameTrans,
  PromotionSubtypeTrans,
  PromotionTimeTrans,
  PromotionTypeTrans,
  PromotionUserGroupTrans,
  usePromotionUserGroupTrans
} from "../../trans/Promotion"
import { StatusTrans } from "../../trans/Status"
import { ActionTrans, ConfirmOrderTrans } from "../../trans/Action"

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
    brandId
      ? {
          ...toApiParams(state),
          sortby: "number",
          from: formatDateOnly(state.from),
          to: formatDateOnly(state.to)
        }
      : undefined
  )

  return (
    <PageContent
      title={<PromotionManagementTrans />}
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
          <Box>
            <AddPromotionDisclosure
              id="add-promotion-dialog-disclosure"
              brandId={brandId}
              onSubmitted={mutate}
            />
          </Box>
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
                <ConfirmOrderTrans />
              </Button>
            </Dialog.Footer>
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}

const PromotionTypeField = "promotionType"
const PromotionTypeSelectGroupField = (props) => {
  let { setValue, control } = useFormContext()
  let {
    isLaoding: isLoadingPromotionGroups,
    data: promotionGroups,
    error
  } = usePromotionTypeList()

  const findPromotionTypeValues = (promotionGroup = "") => {
    if (!promotionGroup) {
      return []
    }

    let group = promotionGroups?.find(({ name }) => {
      return name === promotionGroup
    })

    return group?.types?.map(({ name }) => name) ?? []
  }

  /*
  const findPromotionGroupValue = (promotionType) => {
    if (!promotionType) {
      return ""
    }

    let group = promotionGroups?.find(({ name, types = [] }) => {
      let promotionTypes = types.map(({ name }) => name)
      let isInclude = promotionTypes.includes(promotionType)
      return isInclude
    })
    return group?.name ?? ""
  }
  */

  let [promotionTypeSelectValue, setPromotionTypeSelectValue] = useState()

  const setPromotionType = (list = []) => {
    setValue(PromotionTypeField, list)
  }

  let [group, setGroup] = useState()

  let promotionType = useWatch({
    name: PromotionTypeField,
    control
  })

  useEffect(() => {
    if (promotionType.length === 0 || promotionType.length > 1) {
      setPromotionTypeSelectValue("")
    }
  }, [JSON.stringify(promotionType)])

  return (
    <Group>
      <PromotionTypeGroupSelect
        onChange={(event) => {
          let promotionGroup = event.target.value
          setGroup(promotionGroup)

          let promotionTypes = findPromotionTypeValues(promotionGroup)
          setPromotionType(promotionTypes)

          /*
          TODO: rm, seems no need to auto select
          if (promotionTypes.length === 1) {
            setPromotionTypeSelectValue(promotionTypes[0])
          }
          */
        }}
      />
      <PromotionTypeSelect
        value={promotionTypeSelectValue}
        group={group}
        onChange={(event) => {
          let promotionType = event.target.value
          if (!promotionType) {
            let promotionTypes = findPromotionTypeValues(group)
            setPromotionType(promotionTypes)

            /*
            TODO: rm, seems no need to auto select
            if (promotionTypes.length === 1) {
              setPromotionTypeSelectValue(promotionTypes[0])
            }
            */
          } else {
            /*
            TODO: rm, seems no need to auto select group
            if (!group) {
              let groupValue = findPromotionGroupValue(value)
            }
            */
            setPromotionType([promotionType])
            setPromotionTypeSelectValue(promotionType)
          }
        }}
      />
    </Group>
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
    defaultValues: { status, name, start, end, promotionType: [] }
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <Set>
          <DateInputRange
          /*
          TODO: required msg?
          requiredBothIfHasOne={true}
          */
          />
          <PromotionStatusSelect name="status" />
          <InputField
            name="name"
            showEmptyFieldValueAddonAfter
            placeholder={namePlaceholder}
          />

          <PromotionTypeSelectGroupField />

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
        Header: <PromotionNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "promotionTypeGroup",
        accessor: (row) => row,
        Header: <PromotionTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let group = usePromotionGroupLabelOf(value?.promotionType) ?? ""
          return group
        }
      }),
      textColumn({
        accessor: "promotionType",
        Header: <PromotionSubtypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PromotionTypeLabel value={value} />
      }),
      textColumn({
        id: "promotionTime",
        accessor: (row) => row,
        Header: <PromotionTimeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let from = formatDayMonthYear(value?.from)
          let to = formatDayMonthYear(value?.to)
          return `${from} - ${to}`
        }
      }),
      textColumn({
        accessor: "vipLevels",
        Header: <PromotionUserGroupTrans />,
        disableSortBy: true,
        Cell: ({ value: vipLevels }) => {
          let dialogTitle = usePromotionUserGroupTrans()

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
        Header: <PromotionFundTrans />,
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
          Header: <StatusTrans />,
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
          Header: <ActionTrans />,
          accessor: (row) => row,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            let now = new Date()
            let isPromotionStarted = isAfter(now, record?.from)
            return (
              <Set alignX="center">
                <ViewPromotionDisclosure
                  id="view-promotion-dialog-disclosure"
                  brandId={brandId}
                  promotionId={record.id}
                />
                <EditPromotionDisclosure
                  id="edit-promotion-dialog-disclosure"
                  brandId={brandId}
                  promotionId={record.id}
                  promotionType={record.promotionType}
                  disabled={isPromotionStarted}
                  onSubmitted={mutate}
                />
                <CopyPromotionDisclosure
                  id="copy-promotion-dialog-disclosure"
                  brandId={brandId}
                  promotionId={record?.id}
                  promotionType={record.promotionType}
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
                <PromotionChangeLogListDialogDisclosure
                  promotionId={record.id}
                />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [JSON.stringify(items)])
}
