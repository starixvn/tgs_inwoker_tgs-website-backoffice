import React, { useState, useEffect } from "react"
import { css } from "@emotion/react"
import { Spinner, Switch } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import { Select } from "../../select/Select"
import { useChangePromotionStatus } from "./client"
import { Update } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import AlertDialog from "../../dialog/Alert"
import { useStatusTrans } from "../../trans/Status"
import {
  usePromotionStatusDisabledTrans,
  usePromotionStatusEnabledTrans
} from "../../trans/Promotion"

const Enabled = "Enabled"

const Disabled = "Disabled"

const Archived = "Archived"

export const isPromotionStatusEnabled = (value) => value === Enabled

export const PromotionStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: usePromotionStatusEnabledTrans(),
      value: Enabled
    },
    {
      label: usePromotionStatusDisabledTrans(),
      value: Disabled
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PromotionStatusSwitch = ({
  record,
  value,
  disabled,
  onSubmitted,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    disabled = true
  }

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useChangePromotionStatus(record?.id, formData)

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

  if (value == Archived) {
    disabled = true
    checked = false
  }
  let checked = value === Enabled
  return (
    <>
      <Switch
        data-status={value}
        disabled={isLoading || disabled}
        checked={checked}
        {...props}
        css={css`
          position: relative;
        `}
        onChange={(event) => {
          if (disabled) {
            return
          }

          let checked = event.target.checked
          if (checked) {
            setSubmit(Enabled)
          } else {
            setSubmit(Disabled)
          }
        }}
      />
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

export default {
  Enabled,
  Disabled,
  PromotionStatusSelect,
  PromotionStatusSwitch
}
