import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text, Set, Icon } from "bumbag"
import { faCertificate } from "@fortawesome/free-solid-svg-icons"
import { Trans } from "../../i18n"

const WaitingVerify = "WaitingVerify"
const WaitingVerifyTrans = {
  zh: "等待审核",
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

export const isPlayerIdentityWaitingVerify = (value) => {
  return value === WaitingVerify
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
