import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Stack } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { useStationLetterList, useDeleteStationLetter } from "./client"
import { Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans } from "../../i18n"
import {
  from as statusFrom,
  Label as StatusLabel,
  InVerify,
  InVerifyName,
  Published,
  PublishedName,
  Rejected,
  RejectedName
} from "./status"
import { AddButton, VerifyButton, ViewButton } from "./edit"
import { Verify as VerifyMenu, View as ViewMenu, Create } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { Input } from "../../input/Input"
import { ActionTrans, OperatorTrans } from "../../trans/Action"
import { StatusTrans } from "../../trans/Status"
import { StationLetterTrans } from "../../trans/Platform"
import { SubjectTrans } from "../../trans/Field"
import { CreatedTimeTrans } from "../../trans/Date"

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
        paddingTop="0.5rem"
        paddingLeft="0.5rem"
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
    statusName: hasVerifyAuth
      ? InVerifyName
      : hasViewAuth
      ? PublishedName
      : null
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { pageSize, statusName } = state
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useStationLetterList({
    ...toApiParams(state),
    status: statusFrom(statusName),
    sortby: "createdOn",
    orderby: SortOrder.Descending
  })

  let columns = useColumns({ mutate, statusName, items: data?.items })

  let tab = useTabState({
    selectedId: statusName
  })

  const activeTab = (newStatusName) => () => {
    if (newStatusName === statusName) {
      mutate()
    }
    setState({
      pageIndex: 0,
      statusName: newStatusName,
      sortBy: []
    })
  }

  return (
    <PageContent
      title={<StationLetterTrans />}
      actionBar={
        <Box alignX="right">
          <AddButton
            id="add-station-letter-dialog-disclosure"
            brandId={brandId}
            onSubmitted={mutate}
          />
        </Box>
      }
    >
      <Tabs>
        <TabList {...tab}>
          {hasVerifyAuth && (
            <Tab
              tabId={InVerifyName}
              onClick={activeTab(InVerifyName)}
              {...tab}
            >
              <StatusLabel value={InVerify} />
            </Tab>
          )}
          <Tab
            tabId={PublishedName}
            onClick={activeTab(PublishedName)}
            {...tab}
          >
            <StatusLabel value={Published} />
          </Tab>
          <Tab tabId={RejectedName} onClick={activeTab(RejectedName)} {...tab}>
            <StatusLabel value={Rejected} />
          </Tab>
        </TabList>
        {hasVerifyAuth && (
          <TabPanel tabId={InVerifyName} {...tab}>
            {statusName === InVerifyName && (
              <Table
                id="station-letter"
                columns={columns}
                data={data?.items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
              />
            )}
          </TabPanel>
        )}

        <TabPanel tabId={PublishedName} {...tab}>
          {statusName === PublishedName && (
            <Table
              id="station-letter"
              columns={columns}
              data={data?.items}
              initialState={state}
              controlledState={state}
              pageCount={pageCount(pageSize, data?.totalCount)}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
            />
          )}
        </TabPanel>

        <TabPanel tabId={RejectedName} {...tab}>
          {statusName === RejectedName && (
            <Table
              id="station-letter"
              columns={columns}
              data={data?.items}
              initialState={state}
              controlledState={state}
              pageCount={pageCount(pageSize, data?.totalCount)}
              setPageIndex={setPageIndex}
              setSortOrder={setSortOrder}
              isLoading={isLoading}
            />
          )}
        </TabPanel>
      </Tabs>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const useColumns = ({ mutate, statusName, items = [] }) => {
  let hasVerifyAuth = useIsDisplayMenuByRoute([VerifyMenu])
  let hasViewAuth = useIsDisplayMenuByRoute([ViewMenu])
  let hasAddAuth = useIsDisplayMenuByRoute([Create])

  let editable = hasVerifyAuth || hasAddAuth

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
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
        accessor: "createdOn",
        Header: <CreatedTimeTrans />,
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
          return (
            <Text.Block
              css={css`
                white-space: nowrap;
              `}
            >
              <StatusLabel value={status} />
            </Text.Block>
          )
        }
      }
    ]

    let hasAnyMenu = statusName === InVerifyName ? hasVerifyAuth : hasViewAuth

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        accessor: (row) => {
          return row
        },
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <Set>
                {statusName === InVerifyName && (
                  <VerifyButton
                    id="verify-station-letter-dialog-disclosure"
                    record={value}
                    onSubmitted={mutate}
                  />
                )}
                {(statusName === PublishedName ||
                  statusName === RejectedName) && (
                  <>
                    <ViewButton
                      id="view-station-letter-dialog-disclosure"
                      record={value}
                    />
                    {editable && (
                      <ConfirmDeleteDialogDisclosure
                        id="delete-station-letter-dialog-disclosure"
                        dialogId="delete-station-letter-dialog"
                        useFetch={useDeleteStationLetter}
                        onSubmit={() => {
                          return value.id
                        }}
                        onSubmitted={mutate}
                        addonAfter={
                          <Input type="hidden" name="id" value={value.id} />
                        }
                      />
                    )}
                  </>
                )}
              </Set>
            </Box>
          )
        }
      })
    }
    return columns
  }, [statusName, JSON.stringify(items)])
}
