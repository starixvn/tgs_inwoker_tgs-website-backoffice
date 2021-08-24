import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Button, useModalState } from "bumbag"
import { Locales, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useChangePlatformBannerStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"

export const InVerify = "WaitApprving"
const InVerifyTrans = {
  zh: "审核中",
  en: "Under review"
}

export const Effective = "Approved"
const EffectiveTrans = {
  zh: "有效",
  en: "Effective"
}

const InvalidTrans = {
  zh: "无效",
  en: "Invalid"
}

export const Expired = "expired"
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

    case Expired:
      return <Trans {...ExpiredTrans} />

    case Rejected:
      return <Trans {...RejectedTrans} />

    default:
      return value
  }
}

export const PlatformBannerStatusToggleButton = ({
  brandId,
  record,
  onSubmitted,
  disabled,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let { id, isEnabled } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useChangePlatformBannerStatus(brandId, id, formData)

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result, error])

  let palette = isEnabled ? "success" : "danger"

  if (!editable) {
    return (
      <Button isLoading={isLoading} palette={palette} disabled isStatic>
        <BannerLabel value={isEnabled} />
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
          let newStatus = isEnabled ? "disable" : "enable"
          setSubmit(newStatus)
        }}
        css={css`
          white-space: nowrap;
        `}
      >
        <BannerLabel value={isEnabled} />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const BannerLabel = ({ value, ...props }) =>
  value ? <Trans {...EffectiveTrans} /> : <Trans {...InvalidTrans} />
