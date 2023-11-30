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
import {
  AddGameProviderGameDisclosure,
  EditGameProviderGameDisclosure,
  ViewGameProviderGameDisclosure
} from "./GameProviderGame"
import { BatchAddGameProviderGameListDisclosure } from "./BatchAddGameProviderGameList"
import SearchButton from "../../button/SearchButton"
import {
  useGameProviderGameList,
  useUploadGameLocalizationList
} from "../../game/games/client"
import dateTimeColumn from "../../table/column/dateTime"
import { View, Update } from "./menu"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { useDropzone } from "react-dropzone"
import { ActionTrans } from "../../trans/Action"

export const GameProviderGameListDisclosure = ({
  gameProviderId,
  gameProviderCode,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="游戏列表" en="Game List" />
      </Disclosure>
      {dialog.visible && (
        <GameListDialog
          gameProviderId={gameProviderId}
          gameProviderCode={gameProviderCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const GameListDialog = ({
  gameProviderId,
  gameProviderCode,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "游戏列表",
    en: "Game List"
  })

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    gameProviderId,
    code: "",
    id: ""
  })
  let { pageIndex, pageSize, code, id } = state
  let { isLoading, data, error, mutate, deleteCache } = useGameProviderGameList(
    { ...toApiParams(state), sortby: "id" }
  )

  let items = data?.items ?? []
  let columns = useColumns({ gameProviderId, items, mutate })

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id="game-list-dialog"
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
          gameProviderCode={gameProviderCode}
          id={id}
          code={code}
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
          id="game-list"
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

const ActionBar = ({
  gameProviderId,
  gameProviderCode,
  code,
  id,
  search,
  mutate,
  isLoading
}) => {
  let formMethods = useForm({
    defaultValues: { code, id }
  })

  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            {/* <InputField
                            name="id"
                            showEmptyFieldValueAddonAfter
                            placeholder="游戏ID"
                        /> */}
            <InputField
              name="code"
              showEmptyFieldValueAddonAfter
              placeholder="Code"
            />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
      <Set orientation="horizontal">
        <AddGameProviderGameDisclosure
          gameProviderId={gameProviderId}
          onSubmitted={mutate}
        />

        <BatchAddGameProviderGameListDisclosure
          gameProviderId={gameProviderId}
          gameProviderCode={gameProviderCode}
          onSubmitted={mutate}
        />

        <LocalizationMenuButton gameProviderCode={gameProviderCode} />
      </Set>
    </Level>
  )
}

const useColumns = ({ gameProviderId, items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="游戏ID" en="Game ID" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <Trans zh="游戏代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="游戏名称" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
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
          Header: <ActionTrans />,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            return (
              <Set orientation="horizontal" alignX="center">
                <ViewGameProviderGameDisclosure
                  gameProviderId={gameProviderId}
                  record={record}
                />
                <EditGameProviderGameDisclosure
                  gameProviderId={gameProviderId}
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

const LocalizationMenuButton = ({ gameProviderCode }) => {
  let uploadGameLocalizationListDialog = useModalState()

  return (
    <>
      <DropdownMenu
        id="game-localization-menu"
        menu={
          <>
            <DropdownMenu.Item
              id="export-game-localization"
              use="a"
              href={`/api/game/localization/export?gameProviderCode=${gameProviderCode}`}
              download={`${gameProviderCode}.xlsx`}
            >
              <Trans zh="汇出" en="Export" />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              id="upload-game-localization-dialog-disclosure"
              onClick={uploadGameLocalizationListDialog.show}
            >
              <Trans zh="上传" en="Upload" />
            </DropdownMenu.Item>
          </>
        }
      >
        <Button iconAfter="chevron-down">
          <Trans zh="多语系" en="Localization" />
        </Button>
      </DropdownMenu>
      {uploadGameLocalizationListDialog.visible && (
        <UploadGameLocalizationListDialog
          gameProviderCode={gameProviderCode}
          dialog={uploadGameLocalizationListDialog}
        />
      )}
    </>
  )
}

const UploadGameLocalizationListDialog = ({ dialog }) => {
  let title = useTrans({
    zh: "上传游戏多语系",
    en: "Upload Game Localization"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache, mutate } =
    useUploadGameLocalizationList(formData)

  useEffect(() => {
    if (result && !error) {
      dialog.hide()
    }
  }, [result, error])

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    maxFiles: 1,
    accept: ".xlsx",
    onDrop: (files) => {
      if (files.length > 0) {
        let [file] = files
        let formData = new FormData()
        formData.append("file", file, file.name)
        setSubmit(formData)
      }
    }
  })

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let notSelectFile = !formData
  return (
    <Backdrop {...dialog}>
      <Dialog.Modal
        id="upload-game-localization-dialog"
        {...dialog}
        title={title}
        showCloseButton
        hideOnClickOutside={false}
        hideBackdrop
      >
        {notSelectFile && (
          <Card
            {...getRootProps({
              id: "file-upload-dropzone",
              refKey: "elementRef "
            })}
          >
            <input {...getInputProps()} />
            <p>
              <Trans zh="选择档案" en="Select File" />
            </p>
          </Card>
        )}
        {isLoading && (
          <Card alignX="center">
            <Spinner />
          </Card>
        )}
      </Dialog.Modal>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </Backdrop>
  )
}
