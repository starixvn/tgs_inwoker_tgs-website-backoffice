import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Table, Button, Icon } from "bumbag"
import { Disclosure, ConfigIconDisclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { EmailTrans } from "../../trans/User"
import { RemarkTrans } from "../../trans/Action"
import {
  useForm,
  useFormContext,
  useWatch,
  useFieldArray,
  Controller
} from "react-hook-form"
import { useBrandContacts, useUpdateBrandContacts } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import { isDev } from "../../env"
import Input from "../../input/Input"
import EmailInput from "../../input/EmailInput"
import AlertDialog from "../../dialog/Alert"
import { isEmpty } from "lodash-es"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import { repeat } from "ramda"

const Contacts = {
  zh: "聯絡資訊",
  en: "Contacts"
}
const ContactsTrans = () => <Trans {...Contacts} />
const useContactsTrans = () => useTrans(Contacts)

//TODO: id for test
export const ContactsDialogDisclosure = ({
  brandId,
  id,
  dialogId = "contacts-dialog",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure id={id} {...dialog}>
        <ContactsTrans />
      </Disclosure>
      {dialog.visible && (
        <ContactsDialog
          brandId={brandId}
          dialog={dialog}
          dialogId={dialogId}
          readOnly={!editable}
        />
      )}
    </>
  )
}

const ContactsField = "contacts"
const ContactsMin = 2
const ContactsMax = 10

const ContactsDialog = ({ brandId, readOnly, dialog, dialogId, ...props }) => {
  let title = useContactsTrans()

  let {
    isLoading: isLoadingContacts,
    data: contacts = [],
    error: contactsError,
    mutate: mutateContacts,
    deleteCache: deleteContactsCache
  } = useBrandContacts(brandId)

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateBrandContacts(brandId, formData)

  if (isLoadingContacts) {
    return <LoadingBackdrop {...dialog} />
  }

  if (contactsError) {
    return <AlertDialog {...contactsError} onClickClose={dialog.hide} />
  }

  const onSubmit = ({ contacts = [] }) => {
    setSubmit(contacts)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  contacts =
    contacts.length < ContactsMin
      ? [...contacts, ...repeat({}, ContactsMin - contacts.length)]
      : contacts

  let defaultValues = { contacts }
  return (
    <FormDialog
      id={dialogId}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onSubmitted={() => {
        deleteContactsCache()
        mutateContacts(undefined, false)

        reset()
      }}
      onCloseErrorAlert={reset}
      title={title}
      dialog={dialog}
      showActionButtons={readOnly ? false : true}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ name = ContactsField, readOnly }) => {
  let { control } = useFormContext()

  let fieldArray = useFieldArray({ control, name, keyName: "_id" })
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>
            <Trans zh="聯絡人" en="Name" />
          </Table.HeadCell>
          <Table.HeadCell>
            <EmailTrans />
          </Table.HeadCell>
          <Table.HeadCell>
            <RemarkTrans />
          </Table.HeadCell>
          <Table.HeadCell
            css={css`
              min-width: 4.25rem;
            `}
          ></Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {fieldArray.fields.map((field, index) => {
          return (
            <ContactRow
              readOnly={readOnly}
              key={field._id}
              name={name}
              index={index}
              field={field}
              fieldArray={fieldArray}
            />
          )
        })}
        {!readOnly && fieldArray.fields.length < ContactsMax && (
          <AddRow fieldArray={fieldArray} />
        )}
      </Table.Body>
    </Table>
  )
}

const ContactRow = ({
  readOnly,
  name = ContactsField,
  index,
  field,
  fieldArray
}) => {
  let contactSize = fieldArray.fields.length
  return (
    <Table.Row>
      <Table.Cell>
        <Input
          name={`${name}.${index}.name`}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </Table.Cell>
      <Table.Cell>
        <EmailInput
          name={`${name}.${index}.email`}
          required
          readOnly={readOnly}
          disabled={readOnly}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          name={`${name}.${index}.remark`}
          readOnly={readOnly}
          disabled={readOnly}
        />
      </Table.Cell>
      <Table.Cell>
        {contactSize > ContactsMin && !readOnly && (
          <RemoveButton index={index} fieldArray={fieldArray} />
        )}
      </Table.Cell>
    </Table.Row>
  )
}

const RemoveButton = ({ index, fieldArray }) =>
  useMemo(
    () => (
      <Button
        size="small"
        palette="danger"
        variant="ghost"
        onClick={() => {
          fieldArray.remove(index)
        }}
      >
        <Icon icon={faMinus} type="font-awesome" />
      </Button>
    ),
    [index, fieldArray]
  )

const AddRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Table.Row>
        <Table.Cell>
          <Button
            size="small"
            variant="ghost"
            onClick={() => {
              fieldArray.append({})
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.Cell>
      </Table.Row>
    ),
    [fieldArray]
  )
