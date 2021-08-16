import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { useChangePlatformBannerOrders, usePlatformBannerList } from "./client"
import { Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  PlatformBannerStatusLabel,
  InVerify,
  Effective,
  Expired,
  Rejected,
  Invalid,
  PlatformBannerStatusToggleButton
} from "./PlatformBannerStatus"
import { Verify, View, Update } from "./menu"
import AlertDialog from "../../dialog/Alert"
import BrandBar from "../../report/BrandBar"
import { SortOrder } from "../../table/order"
import { NumberInput } from "../../input/NumberInput"
import textColumn from "../../table/column/textColumn"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  AddPlatformBannerDisclosure,
  EditPlatformBannerDisclosure
} from "./PlatformBanner"
import { VerifyPlatformBannerDisclosure } from "./VerifyPlatformBanner"

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
        id="page-merchant-bar"
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let hasVerifyAuth = useIsDisplayMenuByRoute([Verify])
  let hasViewAuth = useIsDisplayMenuByRoute([View])

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: hasVerifyAuth ? InVerify : hasViewAuth ? Effective : null
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { status } = state
  let isEffectiveTab = status === Effective
  let { isLoading, data, error, mutate, deleteCache } = usePlatformBannerList(
    isEffectiveTab
      ? {
          ...toApiParams(state),
          sortby: "displayOrder",
          status: [Effective, Invalid]
        }
      : toApiParams({
          ...state,
          sortby: "updatedOn",
          orderby: SortOrder.Descending
        })
  )

  let tab = useTabState({
    selectedId: status
  })

  const activeTab = (status) => () => {
    setState({
      pageIndex: 0,
      status,
      sortBy: []
    })
    mutate()
  }

  return (
    <PageContent
      title={<Trans zh="Banner 管理" en="Banner Management" />}
      actionBar={
        <Box alignX="right">
          <AddPlatformBannerDisclosure
            id="add-banner-dialog-disclosure"
            brandId={brandId}
            onSubmitted={mutate}
          />
        </Box>
      }
    >
      <Tabs>
        <TabList {...tab}>
          {hasVerifyAuth && (
            <Tab tabId={InVerify} onClick={activeTab(InVerify)} {...tab}>
              <PlatformBannerStatusLabel value={InVerify} />
            </Tab>
          )}

          <Tab tabId={Effective} onClick={activeTab(Effective)} {...tab}>
            <PlatformBannerStatusLabel value={Effective} />
          </Tab>
          <Tab tabId={Expired} onClick={activeTab(Expired)} {...tab}>
            <PlatformBannerStatusLabel value={Expired} />
          </Tab>
          <Tab tabId={Rejected} onClick={activeTab(Rejected)} {...tab}>
            <PlatformBannerStatusLabel value={Rejected} />
          </Tab>
        </TabList>
        {hasVerifyAuth && (
          <TabPanel id="in-verify-tab-panel" tabId={InVerify} {...tab}>
            {status === InVerify && (
              <AsyncTable
                id="banner"
                status={status}
                data={data}
                state={state}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                mutate={mutate}
                brandId={brandId}
              />
            )}
          </TabPanel>
        )}
        <TabPanel id="effective-tab-panel" tabId={Effective} {...tab}>
          {status === Effective && (
            <EffectiveTable
              id="banner"
              status={status}
              data={data}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              state={state}
              isLoading={isLoading}
              mutate={mutate}
              brandId={brandId}
            />
          )}
        </TabPanel>
        <TabPanel id="expired-tab-panel" tabId={Expired} {...tab}>
          {status === Expired && (
            <AsyncTable
              id="banner"
              status={status}
              data={data}
              state={state}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
              mutate={mutate}
              brandId={brandId}
            />
          )}
        </TabPanel>
        <TabPanel id="rejected-tab-panel" tabId={Rejected} {...tab}>
          {status === Rejected && (
            <AsyncTable
              id="banner"
              status={status}
              data={data}
              state={state}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
              mutate={mutate}
              brandId={brandId}
            />
          )}
        </TabPanel>
      </Tabs>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const AsyncTable = ({
  id,
  status,
  state,
  setPageIndex,
  setSortOrder,
  data,
  isLoading,
  mutate,
  brandId
}) => {
  let { pageSize } = state
  let columns = useColumns({
    mutate,
    status,
    items: data?.items,
    brandId
  })

  return (
    <Table
      id={id}
      columns={columns}
      data={data?.items}
      initialState={state}
      controlledState={state}
      pageCount={pageCount(pageSize, data?.totalCount)}
      setPageIndex={setPageIndex}
      setSortOrder={setSortOrder}
      isLoading={isLoading}
    />
  )
}

const EffectiveTable = ({
  id,
  status,
  state,
  setPageIndex,
  setSortOrder,
  data,
  isLoading,
  mutate,
  brandId
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

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
    mutate: mutateChangingDisplayOrder,
    deleteCache
  } = useChangePlatformBannerOrders(formData)

  const onSubmit = () => {
    let orders = Object.entries(displayOrders).map(([key, value]) => ({
      id: key,
      displayOrder: value
    }))
    setSubmit({ orders })
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      mutate()
    }
  }, [result, error])

  useEffect(() => {
    if (status != Effective) {
      reset()
    }
  }, [status])

  let columns = useColumns({
    mutate,
    displayOrders,
    setDisplayOrder,
    status,
    items: data?.items,
    brandId
  })

  const reset = () => {
    setDisplayOrders({})
    setSubmit(undefined)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack spacing="minor-1">
          <Table
            id={id}
            columns={columns}
            data={data?.items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          {editable && (
            <Dialog.Footer position="sticky" bottom="0">
              <Button isLoading={isChangingDisplayOrder} type="submit">
                <Trans zh="确认排序" en="Confirm Order" />
              </Button>
            </Dialog.Footer>
          )}
        </Stack>
      </form>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </FormProvider>
  )
}

const useColumns = ({
  mutate,
  brandId,
  status: tabStatusName,
  displayOrders,
  setDisplayOrder,
  items = []
}) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasVerifyAuth = useIsDisplayMenuByRoute([Verify])
  let hasViewAuth = useIsDisplayMenuByRoute([View])

  return useMemo(() => {
    let columns = [
      tabStatusName != Effective
        ? sequenceColumn()
        : {
            id: "displayOrder",
            accessor: (record) => record,
            Header: <Trans zh="序" en="Order" />,
            disableSortBy: true,
            headCell: {
              textAlign: "center"
            },
            cell: {
              textAlign: "center"
            },
            Cell: ({ value }) => {
              if (!hasUpdateAuth) {
                return value.displayOrder ?? null
              }

              let { id } = value
              let displayOrder = displayOrders[id] ?? value.displayOrder
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
          },
      textColumn({
        accessor: "subject",
        Header: <Trans zh="主题" en="Subject" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "createdByUsername",
        Header: <Trans zh="操作人" en="Operator" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="最近更新时间" en="Last Update" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "from",
        Header: <Trans zh="开始时间" en="Start" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "to",
        Header: <Trans zh="结束时间" en="End" />,
        disableSortBy: true
      }),
      {
        id: "status",
        accessor: (record) => record,
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { status } = value
          if (tabStatusName === Effective) {
            return (
              <PlatformBannerStatusToggleButton
                record={value}
                onSubmitted={() => {
                  //clearCache()
                  mutate(undefined)
                }}
                disabled={!hasUpdateAuth}
              />
            )
          }

          return <PlatformBannerStatusLabel value={status} />
        }
      }
    ]

    let hasAnyMenu = hasViewAuth
    switch (tabStatusName) {
      case InVerify:
        hasAnyMenu = hasVerifyAuth
        break
    }

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <Trans zh="操作" en="Actions" />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          //TODO: view disclosure
          return (
            <Set alignX="center">
              {tabStatusName === InVerify && (
                <VerifyPlatformBannerDisclosure
                  id="verify-banner-dialog-disclosure"
                  record={value}
                  onSubmitted={mutate}
                />
              )}
              {tabStatusName === Effective && (
                <EditPlatformBannerDisclosure
                  id="edit-banner-dialog-disclosure"
                  brandId={brandId}
                  record={value}
                  onSubmitted={mutate}
                />
              )}
              {/* {(tabStatusName === Effective ||
                tabStatusName === Expired ||
                tabStatusName === Rejected) && (
                <ViewButton id="view-banner-dialog-disclosure" record={value} />
              )} */}
            </Set>
          )
        }
      })
    }

    return columns
  }, [tabStatusName, JSON.stringify(items)])
}
