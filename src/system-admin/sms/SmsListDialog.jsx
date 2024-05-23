import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, FieldStack, Set, Dialog, Box, Level } from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update, View } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Modal } from "../../dialog/Modal"
import { useDeleteSms, useSmsList } from "./client"
import { useForm, FormProvider } from "react-hook-form"
import SearchButton from "../../button/SearchButton"
import textColumn from "../../table/column/textColumn"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import Disclosure from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { ActionTrans } from "../../trans/Action"
import { AddSmsDialogDisclosure, UpdateSmsDialogDisclosure } from "./SmsDialog"
import { DeleteSmsDialogDisclosure } from "./DeleteSmsDialog"
import { Trans, useTrans } from "../../i18n"

export const SmsListDialogDisclosure = ({}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog}>
        <SmsProviderTrans />
      </Disclosure>
      {dialog.visible && <ListDialog dialog={dialog} />}
    </>
  )
}

const SmsProvider = {
  zh: "簡訊商",
  en: "SMS Provider"
}
const SmsProviderTrans = () => <Trans zh="簡訊商" en="SMS Provider" />
const useSmsProviderTrans = () => useTrans(SmsProvider)

const ListDialog = ({ dialog }) => {
  let title = useSmsProviderTrans()
  let { state, setState, setPageIndex, setSortOrder } = useTable({})
  let { isLoading, data: items, error, mutate } = useSmsList()

  let columns = useColumns({
    items,
    mutate
  })
  return (
    <Modal title={title} {...dialog} placement="top">
      <FieldStack>
        <Box alignY="bottom" alignX="right">
          <AddSmsDialogDisclosure onSubmitted={mutate} />
        </Box>

        <Table
          columns={columns}
          data={items}
          controlledState={state}
          autoPaging={true}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={dialog.hide} />}
    </Modal>
  )
}

const useColumns = ({ items, mutate }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "name",
        Header: <Trans zh="簡訊商名稱" en="Name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "code",
        Header: <Trans zh="簡訊商代碼" en="Code" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <UpdateSmsDialogDisclosure
                smsSettingId={record?.smsSettingId}
                record={record}
                onSubmitted={mutate}
              />
              <DeleteSmsDialogDisclosure
                name={record?.name}
                smsSettingId={record?.smsSettingId}
                useDelete={useDeleteSms}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
