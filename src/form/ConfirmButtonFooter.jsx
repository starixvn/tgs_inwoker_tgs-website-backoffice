import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import { Dialog, Button, Box, Set } from "bumbag"
import { CloseText } from "../button/ActionButtons"

//TODO: able to rm?
/*
export const ConfirmButtonFooter = ({
  isLoading,
  disabled,
  width = "100%",
  alignX = "right",
  confirmText: ConfirmText = SubmitText,
  ...props
}) => {
  return (
    <Box width={width} alignX={alignX} {...props}>
      <Button
        palette="primary"
        type="submit"
        isLoading={isLoading}
        disabled={disabled}
      >
        {typeof ConfirmText === "function" ? <ConfirmText /> : ConfirmText}
      </Button>
    </Box>
  )
}
*/

export const CloseButtonFooter = ({
  width = "100%",
  alignX = "right",
  dialog,
  onClickClose,
  ...props
}) => {
  return (
    <Box width={width} alignX={alignX} {...props}>
      <Button
        id="close-dialog"
        palette="primary"
        type="button"
        onClick={() => {
          dialog?.hide()
          onClickClose?.()
        }}
      >
        <CloseText />
      </Button>
    </Box>
  )
}
