import React, { useState, useEffect, useMemo } from "react"
import { css, Stack, Heading, Box, Button, DropdownMenu } from "bumbag"
import { useForm, useFormContext, Controller } from "react-hook-form"
import Alert, { AlertDialog } from "../dialog/Alert"
import { useTrans, Trans } from "../i18n"
import { Select, SelectField } from "../select/Select"
import {
  DisabledTrans,
  EnabledTrans,
  useDisabledTrans,
  useEnabledTrans,
  useStatusTrans
} from "../trans/Status"

const Active = "Active"

const Inactive = "Inactive"

const Maintenance = "Maintenance"
const MaintenanceTrans = {
  zh: "维护",
  en: Maintenance
}

const Archived = "Archived"
const ArchivedTrans = {
  zh: "封存",
  en: Archived
}

export const MerchantStatus = {
  Active,
  Inactive,
  Maintenance,
  Archived
}

export const MerchantStatusLabel = ({ value = "" }) => {
  switch (value) {
    case Active:
      return <EnabledTrans />

    case Inactive:
      return <DisabledTrans />

    case Maintenance:
      return <Trans {...MaintenanceTrans} />

    case Archived:
      return <Trans {...ArchivedTrans} />

    default:
      return value
  }
}

const toPalette = (value) => {
  switch (value) {
    case Active:
      return "success"
    case Inactive:
      return "danger"
    case Maintenance:
      return "warning"
    case Archived:
      return "gray"
    default:
      return "default"
  }
}

const defaultEnableMenuItem = (_) => true

export const MerchantStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      value: Active,
      label: useEnabledTrans()
    },
    {
      value: Maintenance,
      label: useTrans(MaintenanceTrans)
    },
    {
      value: Inactive,
      label: useDisabledTrans()
    },
    {
      value: Archived,
      label: useTrans(ArchivedTrans)
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const MerchantStatusMenu = ({
  record = {},
  useChangeStatus,
  onSubmitted,
  readOnly,
  disabled,
  enableMenuItem = defaultEnableMenuItem,
  ...props
}) => {
  let { id, status } = record
  let [newState, setSubmit] = useState()
  let { result, isLoading, error, deleteCache, mutate } = useChangeStatus?.(
    id,
    newState
  )

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result, error])

  if (readOnly || disabled || status === Archived) {
    return (
      <Button
        palette={toPalette(status)}
        isLoading={isLoading}
        disabled
        whiteSpace="nowrap"
        isStatic
      >
        <MerchantStatusLabel value={status} />
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu
        menu={
          <>
            {status != Active && enableMenuItem(Active) && (
              <DropdownMenu.Item onClick={() => setSubmit(Active)}>
                <MerchantStatusLabel value={Active} />
              </DropdownMenu.Item>
            )}
            {status != Inactive && enableMenuItem(Inactive) && (
              <DropdownMenu.Item onClick={() => setSubmit(Inactive)}>
                <MerchantStatusLabel value={Inactive} />
              </DropdownMenu.Item>
            )}
            {status != Maintenance && enableMenuItem(Maintenance) && (
              <DropdownMenu.Item onClick={() => setSubmit(Maintenance)}>
                <MerchantStatusLabel value={Maintenance} />
              </DropdownMenu.Item>
            )}
            {status != Archived && enableMenuItem(Archived) && (
              <DropdownMenu.Item onClick={() => setSubmit(Archived)}>
                <MerchantStatusLabel value={Archived} />
              </DropdownMenu.Item>
            )}
          </>
        }
      >
        <Button
          palette={toPalette(status)}
          isLoading={isLoading}
          disabled={isLoading || !enableMenuItem(status)}
          whiteSpace="nowrap"
        >
          <MerchantStatusLabel value={status} />
        </Button>
      </DropdownMenu>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
