import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Set,
  useModalState,
  Button,
  Disclosure
} from "bumbag"
import { Trans, useTrans } from "../../i18n"
import Modal from "../../dialog/Modal"
import { CancelText, ConfirmText } from "../../button/ActionButtons"

export const DoubleConfirmDialogDisclosure = ({ dialog, props }) => {
  let doubleConfirmCancelDialog = useModalState()

  return (
    <>
      <Disclosure use={Button} {...doubleConfirmCancelDialog}>
        <CancelText />
      </Disclosure>
      {doubleConfirmCancelDialog.visible && (
        <Modal
          showActionButtons
          actionButtonsProps={{
            submitText: <ConfirmText />,
            cancelText: <CancelText />,
            cancelProps: {
              display: "none"
            },
            addonButtons: (
              <>
                <Disclosure use={Button} {...doubleConfirmCancelDialog}>
                  <CancelText />
                </Disclosure>
              </>
            ),
            onClickSubmit: () => {
              props?.onClickSubmit()
              doubleConfirmCancelDialog.hide()
              dialog.hide()
            },
            onClickCancel: () => {
              props?.onClickCancel()
              doubleConfirmCancelDialog.hide()
            }
          }}
          {...doubleConfirmCancelDialog}
        >
          <Trans
            zh="离开此页面后，编辑内容不会被保留和发送。"
            en="The content won’t be saved and sent out successfully when you leave this page."
          />
        </Modal>
      )}
    </>
  )
}
