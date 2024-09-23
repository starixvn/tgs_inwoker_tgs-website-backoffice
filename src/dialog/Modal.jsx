import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useLayoutEffect
} from "react"
import { Dialog, Modal as _Modal, Button } from "bumbag"
import { css, Global } from "@emotion/react"
import Backdrop from "./Backdrop"
import { Trans } from "../i18n"
import { CloseText } from "../button/ActionButtons"

export const Modal = ({
  hideOnClickOutside = false,
  showCloseButton = true,
  children,
  ...props
}) => {
  let { visible, baseId, modal, animating, animated, stopAnimation } = props
  return (
    <Backdrop
      visible={visible}
      baseId={baseId}
      modal={modal}
      animating={animating}
      animated={animated}
      stopAnimation={stopAnimation}
    >
      <Dialog.Modal
        hideOnClickOutside={hideOnClickOutside}
        showCloseButton={showCloseButton}
        hideBackdrop
        css={css`
          min-width: 320px;
          width: max-content;
          max-width: 85vw;

          & .bb-DialogContent {
            max-height: 95vh;
          }
        `}
        {...props}
      >
        {children}
      </Dialog.Modal>
    </Backdrop>
  )
}

export const useModalState = _Modal.useState

export const Footer = Dialog.Footer

//TODO: rm
export const CloseButtonFooter = ({ onClick, ...props }) => {
  return (
    <Footer {...props}>
      <Button type="button" onClick={onClick}>
        <CloseText />
      </Button>
    </Footer>
  )
}

export default Modal
