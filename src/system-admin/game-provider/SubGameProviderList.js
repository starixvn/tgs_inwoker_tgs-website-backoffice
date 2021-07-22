import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Button,
  Text,
  Group,
  Set,
  Flex,
  FieldStack,
  useModalState,
  Dialog,
  Card,
  Level,
  DropdownMenu,
  Spinner
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, {
  AddDisclosure,
  EditDisclosure
} from "../../dialog/Disclosure"
import {
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
  FormProvider
} from "react-hook-form"
import FormDialog from "../../form/FormDialog"
import { Trans, useLocale, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import textColumn from "../../table/column/textColumn"
import { InputField, Input } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import dateTimeColumn from "../../table/column/dateTime"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useDropzone } from "react-dropzone"
import { useSubGameProviderList } from "../../game/providers/client"
import {
  AddSubGameProviderDisclosure,
  EditSubGameProviderDisclosure
} from "./SubGameProvider"

export const SubGameProviderListDisclosure = ({ gameProviderId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="子游戏商" en="Sub Game Provider List" />
      </Disclosure>
      {dialog.visible && (
        <ListDialog gameProviderId={gameProviderId} dialog={dialog} />
      )}
    </>
  )
}

const ListDialog = ({ gameProviderId, gameProviderCode, dialog, ...props }) => {
  let title = useTrans({
    zh: "子游戏商列表",
    en: "Sub Game Provider List"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable()
  let { isLoading, data, error, mutate, deleteCache } = useSubGameProviderList(
    gameProviderId,
    {
      ...toApiParams(state),
      sortby: "code"
    }
  )
  let items = data?.items ?? []
  let columns = useColumns({ gameProviderId, items, mutate })

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id="sub-game-provider-list-dialog"
      title={title}
      {...dialog}
      footer={<CloseButtonFooter alignX="right" dialog={dialog} />}
      showCloseButton
      hideOnClickOutside={false}
      placement="top"
      width="80vw"
      maxWidth="80vw"
    >
      <FieldStack>
        <ActionBar
          gameProviderId={gameProviderId}
          isLoading={isLoading}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          mutate={mutate}
        />
        <Table
          id="sub-game-provider-list"
          columns={columns}
          data={items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </FieldStack>
    </Dialog.Modal>
  )
}

const ActionBar = ({ gameProviderId, search, mutate, isLoading, ...props }) => {
  let formMethods = useForm({
    defaultValues: {}
  })

  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            {/* <InputField
              name="code"
              showEmptyFieldValueAddonAfter
              placeholder="Code"
            /> */}
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
      <Set orientation="horizontal">
        <AddSubGameProviderDisclosure
          gameProviderId={gameProviderId}
          onSubmitted={mutate}
        />
      </Set>
    </Level>
  )
}

const useColumns = ({ gameProviderId, items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "code",
        Header: <Trans zh="子游戏商代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="子游戏商名称" en="Name" />,
        disableSortBy: true
      }),
      dateTimeColumn({
        accessor: "updatedOn",
        Header: <Trans zh="最新更新" en="Updated On" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "updatedByUsername",
        Header: <Trans zh="更改者" en="Updated By" />,
        disableSortBy: true
      })
    ]

    if (hasUpdateAuth) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <Trans zh="操作" en="Actions" />,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <EditSubGameProviderDisclosure
                  record={record}
                  onSubmitted={mutate}
                />
              </Set>
            )
          }
        })
      )
    }

    return columns
  }, [gameProviderId, JSON.stringify(items)])
}
