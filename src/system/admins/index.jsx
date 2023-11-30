import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Heading, Stack, Button, Set, Text } from "bumbag"
import PageContent from "../../page/Content"
import { AddButton, EditButton, EditPasswordButton } from "./edit"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { AdminStatusLabel, AdminStatusSelect } from "./AdminStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserId
} from "../../user/context"
import { Code, View, Update } from "./menu"
import { useAdminList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { FormProvider, useForm } from "react-hook-form"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { isDev } from "../../env"
import { ActionTrans } from "../../trans/Action"

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
  let userId = useUserId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    username: "",
    departmentName: "",
    role: "",
    status: ""
  })

  let { pageIndex, pageSize, username = "" } = state

  let { isLoading, data, error, mutate, deleteCache } = useAdminList({
    ...toApiParams(state)
  })

  const filterOutCurrentUser = (items = []) =>
    items.filter((item) => item.id != userId)

  let items = filterOutCurrentUser(data?.items)
  let columns = useColumns({ mutate, items })

  return (
    <PageContent
      title={<Trans zh="管理员列表" en="Admins" />}
      actionBar={
        <>
          <SearchBar
            username={username}
            departmentName={state.departmentName}
            role={state.role}
            status={state.status}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <AddButton id="add-user-dialog-disclosure" onSubmitted={mutate} />
        </>
      }
    >
      <Table
        columns={columns}
        data={items}
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

//TODO:1.39 rm isDev(), add department and role inputs
const SearchBar = ({
  username = "",
  departmentName = "",
  role = "",
  status = "",
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: { username, departmentName, role, status }
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(search)}>
        <Set>
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={useSearchInputPlaceHolder()}
          />
          {isDev() && (
            <>
              <InputField
                name="departmentName"
                showEmptyFieldValueAddonAfter
                placeholder={useDepartmentPlaceholder()}
              />
              <InputField
                name="role"
                showEmptyFieldValueAddonAfter
                placeholder={useRolePlaceholder()}
              />
              <AdminStatusSelect name="status" />
            </>
          )}
          <SearchButton isLoading={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useRolePlaceholder = () =>
  useTrans({
    zh: "权限组",
    en: "Role"
  })

const useDepartmentPlaceholder = () =>
  useTrans({
    zh: "部门",
    en: "Department"
  })

const useSearchInputPlaceHolder = () =>
  useTrans({
    zh: "用戶名",
    en: "Username"
  })

const useColumns = ({ mutate, items = [] }) => {
  let hasUpdate = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasUpdate

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        Header: <Trans zh="用户名" en="Username" />,
        accessor: "username",
        disableSortBy: true
      }),
      textColumn({
        Header: <Trans zh="姓名" en="Name" />,
        accessor: "name",
        disableSortBy: true
      }),
      {
        Header: <Trans zh="部门" en="Department" />,
        accessor: "departmentName",
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        }
      },
      {
        Header: <Trans zh="权限组" en="Role" />,
        accessor: "role",
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        }
      },
      textColumn({
        accessor: "lastLoginIp",
        Header: <Trans zh="最近登入IP" en="Last Login IP" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <Trans zh="最近登入时间" en="Last Login Time" />,
        accessor: "lastLoginTime",
        disableSortBy: true
      }),
      dateTimeColumn({
        Header: <Trans zh="创建时间" en="Created On" />,
        accessor: "createdOn",
        disableSortBy: true
      }),
      textColumn({
        Header: <Trans zh="状态" en="Status" />,
        accessor: "status",
        disableSortBy: true,
        Cell: ({ value }) => (
          <Text.Block
            css={css`
              white-space: nowrap;
            `}
          >
            <AdminStatusLabel value={value} />
          </Text.Block>
        )
      })
    ]

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
            <Set orientation="vertical" alignX="center">
              <EditButton
                id="edit-user-dialog-disclosure"
                user={value}
                onSubmitted={mutate}
              />
              <EditPasswordButton
                id="edit-user-password-dialog-disclosure"
                user={value}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    }
    return columns
  }, [JSON.stringify(items)])
}
