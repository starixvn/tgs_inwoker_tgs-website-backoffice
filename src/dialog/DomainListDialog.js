import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Spinner,
  Link
} from "bumbag"
import { Disclosure } from "./Disclosure"
import { FormDialog } from "../form/FormDialog"
import { CloseButtonFooter } from "../form/ConfirmButtonFooter"
import { useTrans, Trans } from "../i18n"
import clone from "clone-deep"
import { useFormContext, useWatch, useFieldArray } from "react-hook-form"
import { InputField } from "../input/Input"
import {
  faMinus,
  faCog,
  faPlus,
  faTimes
} from "@fortawesome/free-solid-svg-icons"

export const DomainListDialogDisclosure = ({
  brandId,
  domains,
  readOnly,
  useFetch,
  dialog: DomainsDialog = DomainListDialog,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="域名" en="Domain" />
      </Disclosure>
      {dialog.visible && (
        <DomainsDialog
          readOnly={readOnly}
          domains={domains}
          useFetch={useFetch}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

export const DomainListDialog = ({
  domains = [],
  useFetch,
  dialog,
  onSubmitted,
  readOnly = false,
  ...props
}) => {
  let title = useTrans({
    zh: "域名",
    en: "Domain"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useFetch(formData)

  const onSubmit = ({ domains = [] }) => {
    let data = props?.onSubmit?.(domains) ?? { domains }
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      defaultValues={{ domains: clone(domains) }}
      onSubmit={onSubmit}
      result={result}
      isLoading={isLoading}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      onClickClose={reset}
      dialog={dialog}
      title={title}
      showActionButtons={readOnly ? false : true}
      footer={
        readOnly ? <CloseButtonFooter alignX="right" dialog={dialog} /> : null
      }
    >
      <FormBody readOnly={readOnly} />
    </FormDialog>
  )
}

const DomainFieldArrayName = "domains"
const FormBody = ({ readOnly = false }) => {
  let editable = !readOnly

  let { control, watch, getValues, setValue } = useFormContext()
  let list = useWatch({
    name: DomainFieldArrayName,
    control
  })

  return (
    <FieldStack>
      {list.map((url, index) => (
        <DomainInputField
          key={index}
          defaultValue={url}
          index={index}
          readOnly={readOnly}
          addonAfter={
            editable && (
              <Button
                onClick={() => {
                  let clonedList = clone(list)
                  clonedList.splice(index, 1)
                  setValue(DomainFieldArrayName, clonedList)
                }}
              >
                <Icon icon={faTimes} type="font-awesome" />
              </Button>
            )
          }
        />
      ))}
      {readOnly && !list.length && <Trans zh="无资料" en="No Data" />}
      {editable && (
        <Button
          id="add-domain"
          onClick={(event) => {
            let defaultValue = ""
            setValue(DomainFieldArrayName, [...list, defaultValue])
          }}
        >
          <Icon icon={faPlus} type="font-awesome" />
        </Button>
      )}
    </FieldStack>
  )
}

const DomainInputField = ({ index, ...props }) => {
  return <InputField name={`${DomainFieldArrayName}.${index}`} {...props} />
}
