import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text, Set, Icon } from "bumbag"
import { faCertificate } from "@fortawesome/free-solid-svg-icons"

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

export const PlayerIdentityStateLabel = ({ value }) => {
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
