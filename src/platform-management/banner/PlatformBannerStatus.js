import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Button, useModalState } from "bumbag"
import { Locales, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useChangePlatformBannerStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"

export const InVerify = "InVerify"
const InVerifyTrans = {
  zh: "审核中",
  en: "Under review"
}

export const Effective = "Effective"
const EffectiveTrans = {
  zh: "有效",
  en: "Effective"
}

export const Invalid = "Invalid"
const InvalidTrans = {
  zh: "无效",
  en: "Invalid"
}

export const Expired = "Expired"
const ExpiredTrans = {
  zh: "过期",
  en: "Expired"
}

export const Rejected = "Rejected"
const RejectedTrans = {
  zh: "拒绝",
  en: "Rejected"
}

export const PlatformBannerStatusLabel = ({ value }) => {
  switch (value) {
    case InVerify:
      return <Trans {...InVerifyTrans} />

    case Effective:
      return <Trans {...EffectiveTrans} />

    case Invalid:
      return <Trans {...InvalidTrans} />

    case Expired:
      return <Trans {...ExpiredTrans} />

    case Rejected:
      return <Trans {...RejectedTrans} />

    default:
      return value
  }
}

export const PlatformBannerStatusToggleButton = ({
  record,
  onSubmitted,
  disabled,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let { id, status } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache, deleteErrorCache } =
    useChangePlatformBannerStatus(id, formData)

  useEffect(() => {
    if (result && !error) {
      console.log("reset & onSubmitted?")
      reset()
      onSubmitted?.()
    }
    console.log("result", result, "error", error)
  }, [result, error])

  let palette =
    status === Invalid ? "danger" : status === Effective ? "success" : "default"

  if (!editable) {
    return (
      <Button isLoading={isLoading} palette={palette} isStatic>
        <PlatformBannerStatusLabel value={record.status} />
      </Button>
    )
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)

    setSubmit(undefined)
  }

  return (
    <>
      <Button
        isLoading={isLoading}
        disabled={isLoading || disabled}
        palette={palette}
        onClick={() => {
          reset()
          let newStatus = status === Invalid ? Effective : Invalid

          setSubmit(newStatus)
        }}
        css={css`
          white-space: nowrap;
        `}
      >
        <PlatformBannerStatusLabel value={record.status} />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
