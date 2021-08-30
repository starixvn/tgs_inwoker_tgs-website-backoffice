import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Button,
  Set,
  Box,
  Level,
  useModalState,
  Dialog,
  DropdownMenu,
  Card,
  Spinner
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, Update } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import { SearchButton } from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { FormProvider, useForm } from "react-hook-form"
import { InputField } from "../../input/Input"
import {
  useGameProviderList,
  useUploadGameProviderLocalizationList
} from "../../game/providers/client"
import {
  AddGameProviderButton,
  EditGameProviderButton,
  ViewGameProviderDisclosure
} from "./GameProvider"
import { GameProviderStatusMenu } from "./GameProviderStatus"
import textColumn from "../../table/column/textColumn"
import { GameProviderGameListDisclosure } from "./GameProviderGameList"
import { GameProviderConfigListDisclosure } from "./GameProviderConfigList"
import AlertDialog from "../../dialog/Alert"
import Backdrop from "../../dialog/Backdrop"
import { useDropzone } from "react-dropzone"
import { SubGameProviderListDisclosure } from "./SubGameProviderList"

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
    code: "",
    name: "",
    sortby: "code"
  })
  let { pageIndex, pageSize, name } = state
  let { isLoading, data, error, mutate, deleteCache } = useGameProviderList({
    ...toApiParams(state),
    sortby: "code"
  })

  let columns = useColumns({ items: data?.items, mutate })

  return (
    <PageContent
      title={<Trans zh="游戏商管理" en="Game Provider Management" />}
      actionBar={
        <SearchBar
          name={name}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          mutate={mutate}
        />
      }
    >
      <Table
        id="game-provider"
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

const SearchBar = ({
  code = "",
  name = "",
  search,
  isLoading,
  mutate,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      code,
      name
    }
  })

  let codePlaceHolder = useTrans({
    zh: "游戏商代码",
    en: "game provider code"
  })

  let namePlaceHolder = useTrans({
    zh: "游戏商名称",
    en: "game provider name"
  })
  return (
    <Level>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(search)}>
          <Set>
            <InputField
              name="code"
              showEmptyFieldValueAddonAfter
              placeholder={codePlaceHolder}
            />
            <InputField
              name="name"
              showEmptyFieldValueAddonAfter
              placeholder={namePlaceHolder}
            />
            <SearchButton isLoading={isLoading} disabled={isLoading} />
          </Set>
        </form>
      </FormProvider>
      <Set>
        <AddGameProviderButton onSubmitted={mutate} />
        <LocalizationMenuButton />
      </Set>
    </Level>
  )
}

const LocalizationMenuButton = ({}) => {
  let editable = useIsDisplayMenuByRoute([Update])
  let uploadGameProviderLocalizationListDialog = useModalState()

  return (
    <>
      <DropdownMenu
        id="game-provider-localization-menu"
        menu={
          <>
            <DropdownMenu.Item
              id="export-game-provider-localization"
              use="a"
              href={`/api/gameprovider/localization/export`}
              download={`game-provider-localization.xlsx`}
            >
              <Trans zh="汇出" en="Export" />
            </DropdownMenu.Item>
            {editable && (
              <DropdownMenu.Item
                id="upload-game-provider-localization-dialog-disclosure"
                onClick={uploadGameProviderLocalizationListDialog.show}
              >
                <Trans zh="上传" en="Upload" />
              </DropdownMenu.Item>
            )}
          </>
        }
      >
        <Button iconAfter="chevron-down">
          <Trans zh="多语系" en="Localization" />
        </Button>
      </DropdownMenu>
      {uploadGameProviderLocalizationListDialog.visible && (
        <UploadGameProviderLocalizationListDialog
          dialog={uploadGameProviderLocalizationListDialog}
        />
      )}
    </>
  )
}

const UploadGameProviderLocalizationListDialog = ({ dialog }) => {
  let title = useTrans({
    zh: "上传游戏商多语系",
    en: "Upload Game Provider Localization"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache, mutate } =
    useUploadGameProviderLocalizationList(formData)

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
        id="upload-game-provider-localization-dialog"
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

const useColumns = ({ items = [], mutate }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasUpdateAuth

  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "code",
        Header: <Trans zh="游戏商代码" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "name",
        Header: <Trans zh="游戏商名称" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "description",
        Header: <Trans zh="简介" en="Description" />,
        disableSortBy: true
      }),
      textColumn({
        id: "status",
        accessor: (row) => row,
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => (
          <GameProviderStatusMenu record={value} onSubmitted={mutate} />
        )
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

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          disableSortBy: true,
          Header: <Trans zh="操作" en="Actions" />,
          Cell: ({ value }) => {
            return (
              <Set orientation="vertical" alignX="center">
                <ViewGameProviderDisclosure gameProviderId={value?.id} />
                <EditGameProviderButton
                  gameProviderId={value?.id}
                  onSubmitted={mutate}
                />
                <GameProviderConfigListDisclosure gameProviderId={value?.id} />
                <SubGameProviderListDisclosure gameProviderId={value?.id} />
                <GameProviderGameListDisclosure
                  id={`${value?.code}-game-list-dialog-disclosure`}
                  gameProviderId={value?.id}
                  gameProviderCode={value?.code}
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
