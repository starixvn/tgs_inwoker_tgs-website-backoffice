import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../i18n"
import Select from "../select/Select"

const WaitingVerify = "WaitingVerify"
const WaitingVerifyTrans = {
  zh: "活跃",
  en: "Waiting Verify"
}

const Approve = "Approve"
const ApproveTrans = {
  zh: "Approve",
  en: "Approve"
}

const Reject = "Reject"
const RejectTrans = {
  zh: "Reject",
  en: "Reject"
}
