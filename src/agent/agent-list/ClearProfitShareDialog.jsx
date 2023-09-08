import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Box, Text, Dialog, useModalState, Alert } from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Backdrop from "../../dialog/Backdrop"
import { WarningConfirmFormDialog } from "../../form/FormDialog"
import AlertDialog from "../../dialog/Alert"

//TODO: auth
export const ClearProfitShareDialogDisclosure = ({ agentId }) => {
  let dialog = useModalState()

  let label = useTrans({
    zh: "清除累计结算分红",
    en: "Clear Accumulated Profit Share"
  })

  return (
    <>
      <Disclosure {...dialog} {...props}>
        {label}
      </Disclosure>
    </>
  )
}

const ResetDialog = ({ agentId, dialog }) => {
  let label = useTrans({
    zh: "确定清除？",
    en: "Clear Wagering Requirement？"
  })
}
