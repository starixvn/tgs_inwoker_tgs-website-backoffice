import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text, Set, Icon } from "bumbag"
import {
  faCertificate,
  faCheck,
  faUserCheck,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import {
  ApprovedTrans,
  RejectedTrans,
  ReviewTrans,
  useApprovedTrans,
  useRejectedTrans,
  useReviewTrans
} from "../../trans/Status"
import { usePlayerIdVerificationStatusTrans } from "../../trans/Player"

const WaitingVerify = "WaitingVerify"

const Approve = "Approve"

const Reject = "Reject"

export const isApprove = (value) => value === Approve

export const isReject = (value) => value === Reject

export const isApproveOrReject = (value) => isApprove(value) || isReject(value)

export const isPlayerIdentityWaitingVerify = (value) => {
  return value === WaitingVerify
}

export const PlayerIdentitySelect = ({ ...props }) => {
  let placeholder = usePlayerIdVerificationStatusTrans()
  let options = [
    {
      label: useReviewTrans(),
      value: WaitingVerify
    },
    {
      label: useApprovedTrans(),
      value: Approve
    },
    {
      label: useRejectedTrans(),
      value: Reject
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerIdentityStateLabel = ({ value = "" }) => {
  switch (value) {
    case WaitingVerify:
      return <ReviewTrans />
    case Approve:
      return <ApprovedTrans />
    case Reject:
      return <RejectedTrans />
    default:
      return value
  }
}

export const PlayerIdentityStateIcon = ({ value }) => {
  switch (value) {
    case true:
      return <Icon icon={faUserCheck} type="font-awesome" color="green" />
    case false:
      return <Icon icon={faUserSlash} type="font-awesome" color="gray" />
    default:
      return null
  }
}

export default {
  WaitingVerify
}
