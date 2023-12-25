import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button, Set } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useIsAdminUser,
  useUserResellerId,
  useUserLicenseeId
} from "../../user/context"
import sequenceColumn from "../../table/column/sequence"
import { AddButton, EditButton } from "./edit"
import { DeleteButton } from "./delete"
import { Code, Update, Delete } from "./menu"
import { useDepartmentList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { Features, isDev, isFeatureEnabled } from "../../env"
import { ActionTrans } from "../../trans/Action"
import { FormProvider, useForm } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import {
  DepartmentNameTrans,
  DepartmentsTrans,
  LicenseeTrans,
  PlatformTrans,
  useDepartmentNameTrans
} from "../../trans/Platform"

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
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    name: ""
  })
  let { pageIndex, pageSize } = state

  let { isLoading, data, error, mutate, deleteCache } = useDepartmentList({
    ...toApiParams(state)
  })
  let columns = useColumns({ mutate, items: data?.items })

  return (
    <PageContent
      title={<DepartmentsTrans />}
      actionBar={
        <>
          <SearchBar
            name={state.name}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <AddButton onSubmitted={mutate} />
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
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ name, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: { name }
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <Set>
          <InputField
            name="name"
            showEmptyFieldValueAddonAfter
            placeholder={useDepartmentNameTrans()}
          />
          <SearchButton isLoading={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ mutate, items = [] }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasDeleteAuth = useIsDisplayMenuByRoute([Delete])
  let hasAnyMenu = hasUpdateAuth || hasDeleteAuth

  let adminUser = useIsAdminUser()
  let resellerUser = !!useUserResellerId()
  let licenseeUser = !!useUserLicenseeId()

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      {
        Header: <DepartmentNameTrans />,
        id: "name",
        accessor: "name",
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      }
    ]

    if (adminUser) {
      columns.push(
        textColumn({
          accessor: "resellerName",
          Header: <Trans zh="总公司" en="Reseller" />,
          disableSortBy: true
        })
      )
    }

    if (adminUser || resellerUser) {
      columns.push(
        textColumn({
          accessor: "licenseeName",
          Header: <LicenseeTrans />,
          disableSortBy: true
        })
      )
    }

    if (adminUser || resellerUser || licenseeUser) {
      columns.push(
        textColumn({
          accessor: "brandName",
          Header: <PlatformTrans />,
          disableSortBy: true
        })
      )
    }

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        disableSortBy: true,
        accessor: (row) => row,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id, name } = value
          return (
            <Set alignX="center">
              <EditButton id={id} record={value} onSubmitted={mutate} />
              <DeleteButton id={id} name={name} onSubmitted={mutate} />
            </Set>
          )
        }
      })
    }
    return columns
  }, [JSON.stringify(items)])
}
