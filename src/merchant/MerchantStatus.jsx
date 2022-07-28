import React, { useState, useEffect, useMemo } from "react"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Select as _Select,
  SelectMenu,
  DropdownMenu
} from "bumbag"
import { useForm, useFormContext, Controller } from "react-hook-form"
import Alert, { AlertDialog } from "../dialog/Alert"
import { useTrans, Trans } from "../i18n"

const Active = "Active"
const ActiveTrans = {
  zh: "开启",
  en: "Enabled"
}

const Inactive = "Inactive"
const InactiveTrans = {
  zh: "关闭",
  en: Inactive
}

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
      return <Trans {...ActiveTrans} />

    case Inactive:
      return <Trans {...InactiveTrans} />

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

const defaultEnableMenuItem = (value) => true

export const MerchantStatusMenu = ({
  record = {},
  useChangeStatus,
  onSubmitted,
  readOnly,
  disabled,
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

  if (readOnly || disabled) {
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
            {status != Active && (
              <DropdownMenu.Item onClick={() => setSubmit(Active)}>
                <MerchantStatusLabel value={Active} />
              </DropdownMenu.Item>
            )}
            {status != Inactive && (
              <DropdownMenu.Item onClick={() => setSubmit(Inactive)}>
                <MerchantStatusLabel value={Inactive} />
              </DropdownMenu.Item>
            )}
            {status != Maintenance && (
              <DropdownMenu.Item onClick={() => setSubmit(Maintenance)}>
                <MerchantStatusLabel value={Maintenance} />
              </DropdownMenu.Item>
            )}
            {status != Archived && (
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
          disabled={isLoading}
          whiteSpace="nowrap"
        >
          <MerchantStatusLabel value={status} />
        </Button>
      </DropdownMenu>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
