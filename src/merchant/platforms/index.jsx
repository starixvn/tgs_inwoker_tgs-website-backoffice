import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button, Text, Switch, Stack, Level } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserLicenseeId
} from "../../user/context"
import { Code, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import {
  useBrandList,
  useChangeBrandStatus,
  useSyncBrandGameList
} from "./client"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { AddButton, EditButton, ViewButton } from "./edit"
import { SearchButton } from "../../button/SearchButton"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import equals from "fast-deep-equal"
import { MerchantStatusMenu, MerchantStatusSelect } from "../MerchantStatus"
import { EditBrandBetLimitGameProviderBetLimit } from "./BrandBetLimitGameProviderBetLimitDialog"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { BrandLogoDialogDisclosure } from "./BrandLogoDialog"
import { ActionTrans } from "../../trans/Action"
import { CreatedTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"
import { isDev } from "../../env"
import { ContactsDialogDisclosure } from "./ContactsDialog"
import {
  LicenseePageContent,
  useLicenseeId,
  useLicenseePageContentWidth
} from "../../page/LicenseePageContent"
import AutoSizer from "react-virtualized-auto-sizer"
// import { PlatformDomainDialogDisclosure } from "./PlatformDomain"

export { Code }

export const Brand = "Brand"

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  //TODO:1.40 rm isDev()
  if (isDev()) {
    return <LicenseePageBody />
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Platforms = {
  zh: "平台列表",
  en: "Platforms"
}
const PlatformsTrans = () => <Trans {...Platforms} />
const usePlatformsTrans = () => useTrans(Platforms)

//TODO:1.40 rm Body use LicenseePageBody instead
const Body = () => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    keyword: "",
    status: null
  })
  let { pageSize, keyword } = state

  let { isLoading, data, error, mutate, deleteCache } = useBrandList(
    {
      ...toApiParams(state),
      sortby: "code"
    },
    { hideArchieved: false }
  )

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <PageContent
      title={<PlatformsTrans />}
      actionBar={
        <>
          <SearchBar
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <Set orientation="horizontal" alignX="right">
            <AddButton
              id="add-platform-dialog-disclosure"
              onSubmitted={mutate}
            />
          </Set>
        </>
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row, index) => row.id ?? index}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const LicenseePageBody = () => {
  return (
    <LicenseePageContent title={<PlatformsTrans />}>
      <LicenseeBodyBox />
    </LicenseePageContent>
  )
}

const LicenseeBodyBox = () => {
  let licenseeId = useLicenseeId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    licenseeId,
    keyword: "",
    status: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, licenseeId })
  }, [licenseeId])

  let { pageSize } = state
  let { isLoading, data, error, mutate, deleteCache } = useBrandList(
    {
      ...toApiParams(state),
      sortby: "code"
    },
    { hideArchieved: false }
  )

  let columns = useColumns({ items: data?.items, mutate })

  let pageWidth = useLicenseePageContentWidth()
  return (
    <Set orientation="vertical" isFilled height="100%" spacing="major-2">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Set orientation="horizontal" alignX="right">
          <AddButton
            id="add-platform-dialog-disclosure"
            licenseeId={licenseeId}
            onSubmitted={mutate}
          />
        </Set>
      </Level>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={data?.items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
                getRowId={(row, index) => row.id ?? index}
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const SearchBar = ({ search, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {
      keyword: "",
      status: null
    }
  })

  let searchPlaceHolder = useTrans({
    zh: "关键字输入框",
    en: "Search"
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="keyword"
            showEmptyFieldValueAddonAfter
            placeholder={searchPlaceHolder}
          />
          <MerchantStatusSelect name="status" />

          <SearchButton isLoading={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [], mutate }) => {
  let hasAnyMenu = useHasSubMenuByRoute()
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "licenseeName",
        Header: <Trans zh="所属公司" en="Licensee Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <Trans zh="平台代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="平台名称" en="Name" />,
        disableSortBy: true
      }),
      {
        accessor: "description",
        Header: <Trans zh="平台简介" en="Description" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "operationalEmail",
        Header: <Trans zh="平台邮箱" en="Email" />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      textColumn({
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Box alignX="center">
              <MerchantStatusMenu
                record={value}
                useChangeStatus={useChangeBrandStatus}
                onSubmitted={mutate}
                readOnly={!hasUpdateAuth}
                disabled={!hasUpdateAuth}
              />
            </Box>
          )
        }
      }),
      dateTimeColumn({
        Header: <CreatedTimeTrans />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <UpdatedTimeTrans />,
        accessor: "updatedOn",
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          disableSortBy: true,
          Header: <ActionTrans />,
          accessor: (row) => row,
          Cell: ({ value }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <ViewButton
                  id="view-platform-dialog-disclosure"
                  record={value}
                />
                <EditButton
                  id="edit-platform-dialog-disclosure"
                  record={value}
                  onSubmitted={mutate}
                />
                <EditBrandBetLimitGameProviderBetLimit
                  id="edit-platform-betlimit-dialog-disclosure"
                  record={value}
                  onSubmitted={mutate}
                />
                {/* <PlatformDomainDialogDisclosure
                  id="platform-domain-dialog-disclosure"
                  brandId={value.id}
                /> */}
                <BrandLogoDialogDisclosure
                  id="platform-logo-dialog-disclosure"
                  brandId={value.id}
                />
                <ContactsDialogDisclosure brandId={value.id} />
              </Set>
            )
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
