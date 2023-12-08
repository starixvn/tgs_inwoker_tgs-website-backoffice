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
  useChangeAnnouncementOrders,
  useAnnouncementList,
  useDeleteAnnouncement
} from "./client"
import { Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  AnnouncementStatusLabel,
  InVerify,
  Effective,
  Invalid,
  Expired,
  Rejected
} from "./AnnouncementStatus"
import { AddButton, VerifyButton, EditButton, ViewButton } from "./edit"
import {
  Verify as VerifyMenu,
  View as ViewMenu,
  Update as UpdateMenu
} from "./menu"
import AlertDialog from "../../dialog/Alert"
import { AnnouncementStatusToggleButton as StatusToggleButton } from "./AnnouncementStatus"
import BrandBar from "../../report/BrandBar"
import { SortOrder } from "../../table/order"
import { NumberInput } from "../../input/NumberInput"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import AnnouncementType, { AnnouncementTypeSelect } from "./AnnouncementType"
import {
  ActionTrans,
  ConfirmOrderTrans,
  OperatorTrans
} from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import { SubjectTrans } from "../../trans/Field"
import { UpdatedTimeTrans } from "../../trans/Date"

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
  let hasVerifyAuth = useIsDisplayMenuByRoute([VerifyMenu])
  let hasViewAuth = useIsDisplayMenuByRoute([ViewMenu])

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: hasVerifyAuth ? InVerify : hasViewAuth ? Effective : null
  })

  let [type, setType] = useState(AnnouncementType.Marquee)

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId, type])

  let { status } = state
  let isEffectiveTab = status === Effective
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useAnnouncementList(
    isEffectiveTab
      ? {
          type,
          ...toApiParams(state),
          sortby: "displayOrder",
          status: [Effective, Invalid]
        }
      : toApiParams({
          type,
          ...state,
          sortby: "updatedOn",
          orderby: SortOrder.Descending,
          status: status
        })
  )

  let tab = useTabState({
    selectedId: status
  })

  const activeTab = (newStatus) => () => {
    if (newStatus === status) {
      mutate()
    }

    setState({
      pageIndex: 0,
      status: newStatus,
      sortBy: []
    })
  }

  return (
    <PageContent
      title={<Trans zh="公告管理" en="Announcements" />}
      actionBar={
        <Flex justifyContent="space-between">
          <Box>
            <AnnouncementTypeSelect
              value={type}
              onChange={(event) => {
                let value = event.target.value
                setType(value)
              }}
            />
          </Box>
          <Box alignX="right">
            <AddButton
              id="add-announcement-dialog-disclosure"
              brandId={brandId}
              onSubmitted={mutate}
            />
          </Box>
        </Flex>
      }
    >
      <Tabs>
        <TabList {...tab}>
          {hasVerifyAuth && (
            <Tab tabId={InVerify} onClick={activeTab(InVerify)} {...tab}>
              <AnnouncementStatusLabel value={InVerify} />
            </Tab>
          )}

          <Tab tabId={Effective} onClick={activeTab(Effective)} {...tab}>
            <AnnouncementStatusLabel value={Effective} />
          </Tab>
          <Tab tabId={Expired} onClick={activeTab(Expired)} {...tab}>
            <AnnouncementStatusLabel value={Expired} />
          </Tab>
          <Tab tabId={Rejected} onClick={activeTab(Rejected)} {...tab}>
            <AnnouncementStatusLabel value={Rejected} />
          </Tab>
        </TabList>
        {hasVerifyAuth && (
          <TabPanel id="in-verify-tab-panel" tabId={InVerify} {...tab}>
            {status === InVerify && (
              <AsyncTable
                id="announcement"
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
              id="announcement"
              status={status}
              data={data}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              state={state}
              isLoading={isLoading}
              mutate={mutate}
              brandId={brandId}
              tab={tab}
            />
          )}
        </TabPanel>
        <TabPanel id="expired-tab-panel" tabId={Expired} {...tab}>
          {status === Expired && (
            <AsyncTable
              id="announcement"
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
              id="announcement"
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
      getRowId={(row) => row.id}
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
  } = useChangeAnnouncementOrders(formData)

  const onSubmit = () => {
    let orders = Object.entries(displayOrders).map(([key, value]) => ({
      id: key,
      displayOrder: value
    }))
    setSubmit({ orders })
  }

  const reset = () => {
    setDisplayOrders({})
    setSubmit(null)
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
            getRowId={(row) => row.id}
          />
          {editable && (
            <Dialog.Footer position="sticky" bottom="0">
              <Button
                isLoading={isChangingDisplayOrder}
                type="submit"
                id="change-announcement-display-order-button"
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

const useColumns = ({
  mutate,
  brandId,
  status: tabStatus,
  displayOrders,
  setDisplayOrder,
  items = []
}) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([UpdateMenu])
  let hasVerifyAuth = useIsDisplayMenuByRoute([VerifyMenu])
  let hasViewAuth = useIsDisplayMenuByRoute([ViewMenu])

  return useMemo(() => {
    let columns = [
      tabStatus != Effective
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
      {
        accessor: "subject",
        Header: <SubjectTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "createdByUsername",
        Header: <OperatorTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <UpdatedTimeTrans />,
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
          if (tabStatus === Effective) {
            return (
              <StatusToggleButton
                record={value}
                onSubmitted={() => {
                  mutate(null)
                }}
                disabled={!hasUpdateAuth}
              />
            )
          }

          return (
            <Text.Block
              css={css`
                white-space: nowrap;
              `}
            >
              <AnnouncementStatusLabel value={status} />
            </Text.Block>
          )
        }
      }
    ]

    let hasAnyMenu = hasViewAuth
    switch (tabStatus) {
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
              {tabStatus === InVerify && (
                <VerifyButton
                  id="verify-announcement-dialog-disclosure"
                  record={value}
                  onSubmitted={mutate}
                />
              )}
              {(tabStatus === Effective ||
                tabStatus === Expired ||
                tabStatus === Rejected) && (
                <ViewButton
                  id="view-announcement-dialog-disclosure"
                  record={value}
                />
              )}
              {tabStatus === Effective && (
                <EditButton
                  id="edit-announcement-dialog-disclosure"
                  brandId={brandId}
                  record={value}
                  onSubmitted={mutate}
                />
              )}
              {(tabStatus === Effective ||
                tabStatus === Expired ||
                tabStatus === Rejected) && (
                <ConfirmDeleteDialogDisclosure
                  id="delete-announcement-dialog-disclosure"
                  dialogId="delete-announcement-dialog"
                  useFetch={useDeleteAnnouncement}
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
  }, [tabStatus, JSON.stringify(items)])
}
