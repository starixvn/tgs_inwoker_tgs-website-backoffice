import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text, Set, Icon } from "bumbag"
import { faCertificate } from "@fortawesome/free-solid-svg-icons"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"

const WaitingVerify = "WaitingVerify"
const WaitingVerifyTrans = {
  zh: "审核中",
  en: "Waiting Verify"
}

const Approve = "Approve"
const ApproveTrans = {
  zh: "已核准",
  en: "Approved"
}

const Reject = "Reject"
const RejectTrans = {
  zh: "已拒绝",
  en: "Rejected"
}

export const isApprove = (value) => value === Approve

export const isReject = (value) => value === Reject

export const isApproveOrReject = (value) => isApprove(value) || isReject(value)

export const isPlayerIdentityWaitingVerify = (value) => {
  return value === WaitingVerify
}

export const PlayerIdentitySelect = ({ ...props }) => {
  let placeholder = useTrans({
    zh: "实名认证状态",
    en: "Review Identity Status"
  })
  let options = [
    {
      label: useTrans(WaitingVerifyTrans),
      value: WaitingVerify
    },
    {
      label: useTrans(ApproveTrans),
      value: Approve
    },
    {
      label: useTrans(RejectTrans),
      value: Reject
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerIdentityStateLabel = ({ value = "" }) => {
  switch (value) {
    case WaitingVerify:
      return <Trans {...WaitingVerifyTrans} />
    case Approve:
      return <Trans {...ApproveTrans} />
    case Reject:
      return <Trans {...RejectTrans} />
    default:
      return value
  }
}

export const PlayerIdentityStateIcon = ({ value }) => {
  switch (value) {
    case Approve:
      return <Icon icon={faCertificate} type="font-awesome" color="green" />
    case Reject:
      return <Icon icon={faCertificate} type="font-awesome" color="gray" />
    default:
      return null
  }
}

export default {
  WaitingVerify
}
