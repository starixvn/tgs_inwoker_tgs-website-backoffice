import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, FieldStack, Set, Heading, Box, Level } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Modal } from "../../dialog/Modal"
import { usePlatformSmsList } from "./client"
import { useForm, FormProvider } from "react-hook-form"
import SearchButton from "../../button/SearchButton"
import textColumn from "../../table/column/textColumn"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import Disclosure from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { ActionTrans } from "../../trans/Action"

export const PlatformSmsListDialogDisclosure = ({}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog}>Platform Sms</Disclosure>
      {dialog.visible && <PlatformSmsListDialog dialog={dialog} />}
    </>
  )
}

const PlatformSmsListDialog = ({ dialog }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({})
  let {
    isLoading,
    data: items,
    error,
    mutate
  } = usePlatformSmsList(state.brandId)

  console.log("state", state)
  let columns = useColumns({
    items
  })
  return (
    <Modal title="　" {...dialog} placement="top">
      <FieldStack>
        <Set>
          <MerchantIdSelect
            resellerProps={{ required: false }}
            licenseeProps={{ required: false }}
            brandProps={{
              required: true,
              onChange: (brandId) => {
                setState({
                  brandId
                })
              }
            }}
          />
          <Heading>SMS</Heading>
        </Set>
        <Level alignY="bottom" alignX="left" verticalBelow="mobile"></Level>
        {state.brandId && (
          <Table
            columns={columns}
            data={items}
            controlledState={state}
            autoPaging={true}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
        )}
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={dialog.hide} />}
    </Modal>
  )
}

const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {}
  })

  const onSubmit = (data) => {
    //TODO: only brandId?
    console.log("data", data)
    search?.(data)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <MerchantIdSelect
            resellerProps={{ required: false }}
            licenseeProps={{ required: false }}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "name",
        Header: "Name",
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return <Set alignX="center"></Set>
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
