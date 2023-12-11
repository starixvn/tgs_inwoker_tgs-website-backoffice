import React, { useState, useEffect, useMemo } from "react"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Select,
  SelectMenu,
  DropdownMenu
} from "bumbag"
import { useForm, useFormContext, Controller } from "react-hook-form"
import { useChangeBrandGameProviderScheduleStatus } from "./client"
import Alert from "../../dialog/Alert"
import { useTrans, Trans } from "../../i18n"
import { Update as UpdateMenu } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { DisabledTrans, EnabledTrans } from "../../trans/Status"

const Active = "Active"

const Inactive = "Inactive"

const Maintenance = "Maintenance"
const MaintenanceTrans = {
  zh: "维护",
  en: Maintenance
}

export const Label = ({ value = "", ...props }) => {
  switch (value) {
    case Active:
      return <EnabledTrans {...props} />

    case Inactive:
      return <DisabledTrans {...props} />

    case Maintenance:
      return <Trans {...MaintenanceTrans} {...props} />

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
    default:
      return "default"
  }
}

export const StatusMenu = ({ record = {}, onSubmitted, ...props }) => {
  let editable = useIsDisplayMenuByRoute([UpdateMenu])

  let { id, status } = record
  let [newState, setSubmit] = useState()
  let { result, isLoading, error, deleteCache, mutate } =
    useChangeBrandGameProviderScheduleStatus(id, newState)

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

  if (!editable) {
    return (
      <Button
        data-status={status}
        palette={toPalette(status)}
        isLoading={isLoading}
        isStatic
        disabled
      >
        <Label value={status} />
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu
        menu={
          <>
            {status != Active && (
              <DropdownMenu.Item
                data-status={Active}
                onClick={() => setSubmit(Active)}
              >
                <Label value={Active} />
              </DropdownMenu.Item>
            )}
            {status != Inactive && (
              <DropdownMenu.Item
                data-status={Inactive}
                onClick={() => setSubmit(Inactive)}
              >
                <Label value={Inactive} />
              </DropdownMenu.Item>
            )}
            {status != Maintenance && (
              <DropdownMenu.Item
                data-status={Maintenance}
                onClick={() => setSubmit(Maintenance)}
              >
                <Label value={Maintenance} />
              </DropdownMenu.Item>
            )}
          </>
        }
      >
        <Button
          data-status={status}
          palette={toPalette(status)}
          isLoading={isLoading}
          disabled={isLoading}
        >
          <Label value={status} />
        </Button>
      </DropdownMenu>
      {error && <Alert {...error} onClickClose={reset} />}
    </>
  )
}
