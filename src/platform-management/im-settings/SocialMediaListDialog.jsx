import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Set,
  Card,
  Stack,
  Box,
  Dialog,
  useModalState,
  Alert,
  DropdownMenu,
  Group,
  FieldStack,
  Level
} from "bumbag"
import { ViewSms, UpdateSms, View, Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  AddDisclosure,
  DeleteDisclosure,
  Disclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import {
  useAddPlatformSocialMedia,
  useBrand,
  useChangePlatformSocialMediaOrder,
  useDeletePlatformSocialMedia,
  usePlatformSocialMediaList
} from "../../merchant/platforms/client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import Modal from "../../dialog/Modal"
import { FieldValues } from "../../layout/Grid"
import Switch from "../../switch/Switch"
import { PlatformSmsSelect } from "../../sms/PlatformSmsSelect"
import textColumn from "../../table/column/textColumn"
import sequenceColumn from "../../table/column/sequence"
import { NumberInput } from "../../input/NumberInput"
import {
  ActionTrans,
  DeleteTrans,
  useAddTrans,
  useDeleteTrans
} from "../../trans/Action"
import Backdrop from "../../dialog/Backdrop"
import { InputField } from "../../input/Input"
import {
  NameTrans,
  SocialMediaTrans,
  SocialMediaTypeTrans,
  useSocialMediaTrans,
  useSocialMediaTypeTrans
} from "../../trans/Field"
import { SelectField } from "../../select/Select"
import { Table, useTable } from "../../table"
import { Trans } from "../../i18n"
import { isDev } from "../../env"

//TODO: test case
export const SocialMediaListDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let viewAuth = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable
  if (!viewAuth) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <SocialMediaTrans />
      </Disclosure>
      {dialog.visible && (
        <ListDialog brandId={brandId} readOnly={readOnly} dialog={dialog} />
      )}
    </>
  )
}

const ListDialog = ({ brandId, dialog, ...props }) => {
  let title = useSocialMediaTrans()
  let { state, setPageIndex, setSortOrder } = useTable()
  let {
    isLoading,
    data: items = [],
    error,
    mutate
  } = usePlatformSocialMediaList(brandId)

  let columns = useColumns({
    brandId,
    items,
    mutate
  })
  if (isLoading) {
    return <LoadingBackdrop {...dialog} onClickClose={dialog.hide} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Modal title={title} {...dialog} {...props}>
      <FieldStack>
        <Box alignX="right">
          <AddDialogDisclosure brandId={brandId} onSubmitted={mutate} />
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
    </Modal>
  )
}

const useColumns = ({ mutate, brandId, items = [] }) => {
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  return useMemo(() => {
    let columns = [
      sequenceColumn({
        Cell: ({ value: record = {} }) => {
          let { id } = record
          let [formData, setSubmit] = useState()
          let {
            isLoading,
            result,
            error,
            mutate: mutateChangeOrder
          } = useChangePlatformSocialMediaOrder(id, formData)

          useEffect(() => {
            if (result) {
              reset()
              mutate()
            }
          }, [result])

          const reset = () => {
            setSubmit(null)
            mutateChangeOrder(undefined, false)
          }

          if (!hasUpdateAuth) {
            return record.order ?? null
          }

          return (
            <Box alignX="center">
              <NumberInput
                size="small"
                required
                min="1"
                minLength="1"
                width="5em"
                defaultValue={record.order}
                disabled={isLoading}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.target.blur()
                  }
                }}
                onBlur={(event) => {
                  let order = parseInt(event.target.value)
                  if (
                    Number.isFinite(order) &&
                    order > 0 &&
                    order != record.order
                  ) {
                    setSubmit(order)
                  }
                }}
              />
            </Box>
          )
        }
      }),
      textColumn({
        accessor: "name",
        Header: <NameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
        Header: <SocialMediaTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "url",
        Header: "URL",
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
              <DeleteDialogDisclosure
                name={record?.name}
                brandId={brandId}
                socialMediaId={record?.id}
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

const SocialMediaList = [
  "Facebook",
  "X",
  "Instagram",
  "Threads",
  "Tiktok",
  "Telegram",
  "WhatsApp"
]
const SocialMediaSelectField = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useSocialMediaTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = SocialMediaList.map((socialMedia) => ({
    label: socialMedia,
    value: socialMedia
  }))

  return <SelectField placeholder={placeholder} options={options} {...props} />
}

const AddDialogDisclosure = ({ brandId, onSubmitted }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const AddDialog = ({ brandId, dialog, onSubmitted }) => {
  let title = useAddTrans()
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useAddPlatformSocialMedia(
    brandId,
    formData
  )

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    setSubmit(null)
    mutate(undefined, false)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{}}
        onSubmit={onSubmit}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        dialog={dialog}
        hideBackdrop
        title={title}
      >
        <FormBody />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({}) => {
  return (
    <FieldStack>
      <FieldStack alignY="bottom" orientation="horizontal">
        <InputField name="name" required label={<NameTrans />} />
        <SocialMediaSelectField
          name="type"
          required
          label={<SocialMediaTrans />}
        />
      </FieldStack>
      <InputField name="url" type="url" required label="URL" />
    </FieldStack>
  )
}

const DeleteDialogDisclosure = ({
  name,
  brandId,
  socialMediaId,
  onSubmitted
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <DeleteDisclosure {...dialog} />
      {dialog.visible && (
        <DeleteDialog
          name={name}
          brandId={brandId}
          socialMediaId={socialMediaId}
          dialog={dialog}
          onSubmitted={onSubmitted}
        />
      )}
    </>
  )
}

const DeleteDialog = ({
  name,
  brandId,
  socialMediaId,
  dialog,
  onSubmitted
}) => {
  let title = useDeleteTrans()
  let [deleteId, setDeleteId] = useState()
  let { isLoading, result, error, mutate } = useDeletePlatformSocialMedia(
    brandId,
    deleteId
  )

  const onSubmit = () => {
    setDeleteId(socialMediaId)
  }

  const reset = () => {
    mutate(undefined, false)
    setDeleteId(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        submitText={<DeleteTrans />}
        title={title}
        dialog={dialog}
        hideBackdrop
        actionButtonsProps={{
          submitProps: {
            palette: "danger",
            variant: "outlined"
          }
        }}
      >
        <Alert
          title={
            <Trans
              zh={`确认删除 “${name}”`}
              en={`Confirm delete the “${name}”？`}
            />
          }
          type="warning"
          variant=""
        />
      </FormDialog>
    </Backdrop>
  )
}
