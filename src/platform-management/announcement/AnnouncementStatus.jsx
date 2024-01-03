import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { Locales, Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import { useChangeAnnouncementStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"
import {
  EffectiveTrans,
  ExpiredTrans,
  InvalidTrans,
  RejectedTrans,
  ReviewTrans
} from "../../trans/Status"

export const InVerify = "InVerify"

export const Effective = "Effective"

export const Invalid = "Invalid"

export const Expired = "Expired"

export const Rejected = "Rejected"

export const AnnouncementStatusLabel = ({ value = "" }) => {
  switch (value) {
    case InVerify:
      return <ReviewTrans />

    case Effective:
      return <EffectiveTrans />

    case Invalid:
      return <InvalidTrans />

    case Expired:
      return <ExpiredTrans />

    case Rejected:
      return <RejectedTrans />

    default:
      return value
  }
}

// Effective <-> Invalid toggle
export const AnnouncementStatusToggleButton = ({
  record,
  onSubmitted,
  disabled,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let { id, status } = record
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useChangeAnnouncementStatus(id, formData)

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result, error])

  let palette =
    status === Invalid ? "danger" : status === Effective ? "success" : "default"
  if (!editable) {
    return (
      <Button
        data-status={record.status}
        isLoading={isLoading}
        palette={palette}
        isStatic
      >
        <AnnouncementStatusLabel value={record.status} />
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
        data-status={record.status}
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
        <AnnouncementStatusLabel value={record.status} />
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
