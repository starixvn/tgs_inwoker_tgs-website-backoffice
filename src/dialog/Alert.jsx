import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Card,
  Set,
  Button,
  Text,
  Label,
  FieldStack,
  Dialog,
  Modal,
  Overlay,
  Code,
  Group
} from "bumbag"
import { Trans } from "../i18n"
import copy from "clipboard-copy"

const BumbagZIndex = 19900410

export const AlertDialog = ({
  title,
  placement = "top",
  errors = [],
  xCorrelationId,
  visible = true,
  zIndex = BumbagZIndex,
  finalFocusRef,
  onClickClose,
  ...props
}) => {
  let zIndexString = `${zIndex + 100}`
  return (
    <Modal.State visible={visible} {...props}>
      <Modal.Backdrop zIndex={zIndexString}>
        <Dialog.Modal
          type="danger"
          variant="alert"
          title={title}
          placement={placement}
          footer={
            <Flex
              alignX="right"
              css={css`
                width: 100%;
              `}
            >
              <Modal.Disclosure use={Button} onClick={onClickClose}>
                <Trans zh="关闭" en="Close" />
              </Modal.Disclosure>
            </Flex>
          }
          hideOnClickOutside={false}
        >
          <FieldStack>
            {errors &&
              errors.map((error, index) => (
                <Text.Block key={index}>{error}</Text.Block>
              ))}
            {xCorrelationId && (
              <Group>
                <Code>{xCorrelationId}</Code>
                <Button
                  onClick={() => {
                    copy(xCorrelationId)
                  }}
                  css={css`
                    border-left-width: 1px;
                  `}
                >
                  <Trans zh={`复制`} en={`Copy`} />
                </Button>
              </Group>
            )}
          </FieldStack>
        </Dialog.Modal>
      </Modal.Backdrop>
    </Modal.State>
  )
}

export const AlertDialogModal = ({
  zIndex = BumbagZIndex,
  title,
  errors = [],
  placement = "top",
  onClickClose,
  ...props
}) => {
  let zIndexString = `${zIndex + 100}`
  return (
    <Modal.Backdrop zIndex={zIndexString} {...props}>
      <Dialog.Modal
        type="danger"
        variant="alert"
        title={title}
        placement={placement}
        footer={
          <Flex
            alignX="right"
            css={css`
              width: 100%;
            `}
          >
            <Modal.Disclosure use={Button} onClick={onClickClose}>
              <Trans zh="关闭" en="Close" />
            </Modal.Disclosure>
          </Flex>
        }
        hideOnClickOutside={false}
        {...props}
      >
        <Box>
          {errors &&
            errors.map((error, index) => (
              <Text.Block key={index}>{error}</Text.Block>
            ))}
        </Box>
      </Dialog.Modal>
    </Modal.Backdrop>
  )
}

export default AlertDialog
