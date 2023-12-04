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
import {
  useChangePlatformBannerOrders,
  usePlatformBannerList,
  useDeleteBanner
} from "./client"
import { Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  PlatformBannerStatusLabel,
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
  EditPlatformBannerDisclosure,
  ViewPlatformBannerDisclosure
} from "./PlatformBanner"
import { VerifyPlatformBannerDisclosure } from "./VerifyPlatformBanner"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { ActionTrans, OperatorTrans } from "../../trans/Action"
import { RejectedTrans, ReviewTrans, StatusTrans } from "../../trans/Status"
import { SubjectTrans } from "../../trans/Field"

export { Code }

const InVerify = "reviewing"

const Effective = "valid"
const EffectiveTrans = {
  zh: "有效",
  en: "Effective"
}

const Expired = "expired"
const ExpiredTrans = {
  zh: "过期",
  en: "Expired"
}

const Rejected = "rejected"

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
    status: hasVerifyAuth ? InVerify : hasViewAuth ? Effective : null
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let { status, ...apiParamState } = state
  let isEffectiveTab = status === Effective
  let { isLoading, data, error, mutate, deleteCache } = usePlatformBannerList(
    brandId,
    status,
    isEffectiveTab
      ? {
          ...toApiParams(apiParamState),
          sortby: "DisplayOrder"
        }
      : toApiParams({
          ...apiParamState,
          sortby: "UpdatedOn",
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
      title={<Trans zh="Banner 管理 " en="Banner Management" />}
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
              <ReviewTrans />
            </Tab>
          )}

          <Tab tabId={Effective} onClick={activeTab(Effective)} {...tab}>
            <Trans {...EffectiveTrans} />
          </Tab>
          <Tab tabId={Expired} onClick={activeTab(Expired)} {...tab}>
            <Trans {...ExpiredTrans} />
          </Tab>
          <Tab tabId={Rejected} onClick={activeTab(Rejected)} {...tab}>
            <RejectedTrans />
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
              state={state}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
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
  let formMethods = useForm()
  let { pageSize } = state
  let columns = useColumns({
    mutate,
    status,
    items: data?.items,
    brandId
  })

  return (
    <FormProvider {...formMethods}>
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
          getRowId={(row) => row.id}
        />
      </Stack>
    </FormProvider>
  )
}

const useColumns = ({ mutate, brandId, status: tabStatusName, items = [] }) => {
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
            Cell: ({ value: record }) => {
              let { id } = record
              let [formData, setSubmit] = useState()
              let {
                isLoading,
                result,
                error,
                mutate: mutateChangeOrder,
                deleteCache
              } = useChangePlatformBannerOrders(brandId, id, formData)

              useEffect(() => {
                if (result) {
                  reset()
                  mutate()
                }
              }, [result])

              const reset = () => {
                deleteCache()
                mutateChangeOrder(undefined, false)
                setSubmit(undefined)
              }

              if (!hasUpdateAuth) {
                return record.displayOrder ?? null
              }

              return (
                <Box alignX="center">
                  <NumberInput
                    name={id}
                    size="small"
                    required
                    min="1"
                    minLength="1"
                    width="5em"
                    defaultValue={record.displayOrder}
                    disabled={isLoading}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.target.blur()
                      }
                    }}
                    onBlur={(event) => {
                      //TODO: validation
                      let displayOrder = parseInt(event.target.value)
                      if (
                        Number.isFinite(displayOrder) &&
                        displayOrder > 0 &&
                        displayOrder != record.displayOrder
                      ) {
                        setSubmit(displayOrder)
                      }
                    }}
                  />
                  {error && <AlertDialog {...error} onClickClose={reset} />}
                </Box>
              )
            }
          },
      textColumn({
        accessor: "title",
        Header: <SubjectTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "modifier",
        Header: <OperatorTrans />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="最近更新时间" en="Last Update" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "beginTime",
        Header: <Trans zh="开始时间" en="Start" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "endTime",
        Header: <Trans zh="结束时间" en="End" />,
        disableSortBy: true,
        placeholder: <Trans zh="永久" en="Permanent" />
      }),
      {
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
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
                brandId={brandId}
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
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              {(tabStatusName === Effective ||
                tabStatusName === Expired ||
                tabStatusName === Rejected) && (
                <ViewPlatformBannerDisclosure
                  id="view-banner-dialog-disclosure"
                  brandId={brandId}
                  record={value}
                />
              )}
              {tabStatusName === InVerify && (
                <VerifyPlatformBannerDisclosure
                  id="verify-banner-dialog-disclosure"
                  brandId={brandId}
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
              {hasUpdateAuth &&
                (tabStatusName === Effective ||
                  tabStatusName === Expired ||
                  tabStatusName === Rejected) && (
                  <ConfirmDeleteDialogDisclosure
                    id="delete-banner-dialog-disclosure"
                    dialogId="delete-banner-dialog"
                    useFetch={useDeleteBanner}
                    onSubmit={() => {
                      return value.id
                    }}
                    onSubmitted={mutate}
                    addonAfter={
                      <Input type="hidden" name="id" value={value.id} />
                    }
                  />
                )}
            </Set>
          )
        }
      })
    }

    return columns
  }, [tabStatusName, JSON.stringify(items)])
}
