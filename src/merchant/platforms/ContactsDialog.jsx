import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { useModalState, Table } from "bumbag"
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

const Contacts = {
  zh: "聯絡資訊",
  en: "Contacts"
}
const ContactsTrans = () => <Trans {...Contacts} />
const useContactsTrans = () => useTrans(Contacts)

//TODO: id for test
export const ContactsDialogDisclosure = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([View])
  let editable = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  //TODO:1.40 rm !isDev()
  if (!isDev()) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <ContactsTrans />
      </Disclosure>
      {dialog.visible && (
        <ContactsDialog
          brandId={brandId}
          dialog={dialog}
          readOnly={!editable}
        />
      )}
    </>
  )
}

const ContactsField = "contacts"
const ContactsMin = 2

const ContactsDialog = ({ brandId, readOnly, dialog, ...props }) => {
  let title = useContactsTrans()

  let {
    isLoading: isLoadingContacts,
    data: contacts,
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

  //TODO: if contacts.length < 2?
  contacts = isEmpty(contacts)
    ? Array.from({ length: ContactsMin }, (x, index) => {
        return {}
      })
    : contacts

  let defaultValues = { contacts }
  return (
    <FormDialog
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      title={title}
      dialog={dialog}
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const FormBody = ({ name = ContactsField, readOnly }) => {
  let { control } = useFormContext()

  //TODO:  required  2 rows validation
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
          <Table.HeadCell></Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {fieldArray.fields.map((field, index) => {
          return (
            <ContactRow
              key={field._id}
              name={name}
              index={index}
              field={field}
              fieldArray={fieldArray}
            />
          )
        })}
      </Table.Body>
    </Table>
  )
}

//TODO: readOnly
const ContactRow = ({ name = ContactsField, index, field, fieldArray }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Input name={`${name}.${index}.name`} required />
      </Table.Cell>
      <Table.Cell>
        <EmailInput name={`${name}.${index}.email`} required />
      </Table.Cell>
      <Table.Cell>
        <Input name={`${name}.${index}.remark`} />
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  )
}

//TODO: readOnly
const RemoveRow = () => {}
const AddRow = () => {}
