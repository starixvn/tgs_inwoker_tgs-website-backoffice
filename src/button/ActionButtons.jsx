import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { ActionButtons as _ActionButtons } from "bumbag"
import { Trans, useTrans } from "../i18n"
import { CancelTrans, SubmitTrans } from "../trans/Action"

const Confirm = {
  zh: "确定",
  en: "Submit"
}

//TODO: move to CloseButton?
const Close = {
  zh: "关闭",
  en: "Close"
}

const Delete = {
  zh: "删除",
  en: "Delete"
}

const Add = {
  zh: "新增",
  en: "Add"
}

//TODO: use SubmitTrans instead
export const SubmitText = () => <SubmitTrans />

//TODO: use CancelTrans instead
export const CancelText = () => <CancelTrans />

export const ConfirmText = () => Trans(Confirm)

export const useConfirmText = () => useTrans(Confirm)

export const DeleteText = () => <Trans {...Delete} />

export const AddText = () => <Trans {...Add} />

//TODO: move to CloseButton?
export const CloseText = () => useTrans(Close)

export const SubmitCancel = ({ cancelText, submitText, ...props }) => {
  return (
    <_ActionButtons
      cancelText={cancelText ?? <CancelTrans />}
      submitText={submitText ?? <SubmitTrans />}
      {...props}
    />
  )
}

export const ConfirmCancel = ({ cancelText, submitText, ...props }) => {
  return (
    <_ActionButtons
      cancelText={cancelText ?? <CancelTrans />}
      submitText={submitText ?? <ConfirmText />}
      {...props}
    />
  )
}

export default SubmitCancel
