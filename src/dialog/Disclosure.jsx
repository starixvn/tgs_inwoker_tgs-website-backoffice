import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react"
import { Button, Modal, css, Icon } from "bumbag"
import { Trans } from "../i18n"
import { faCog, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import {
  AddTrans,
  DeleteTrans,
  DetailTrans,
  EditTrans,
  VerifyTrans,
  ViewTrans
} from "../trans/Action"

export const Disclosure = forwardRef(
  ({ use = Button, children, ...props }, ref) => (
    <Modal.Disclosure
      ref={ref}
      use={use}
      flex="unset"
      css={css`
        white-space: nowrap;
      `}
      {...props}
    >
      {children}
    </Modal.Disclosure>
  )
)

export const ViewDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <ViewTrans />
  </Disclosure>
))

export const EditDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <EditTrans />
  </Disclosure>
))

export const AddDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <AddTrans />
  </Disclosure>
))

export const DeleteDisclosure = forwardRef(
  ({ palette = "danger", variant = "outlined", ...props }, ref) => (
    <Disclosure ref={ref} palette={palette} variant={variant} {...props}>
      <DeleteTrans />
    </Disclosure>
  )
)

export const DetailDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <DetailTrans />
  </Disclosure>
))

export const VerifyDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <VerifyTrans />
  </Disclosure>
))

export const ConfigIconDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <Icon icon={faCog} type="font-awesome" />
  </Disclosure>
))

export const AddIconDisclosure = forwardRef((props, ref) => (
  <Disclosure ref={ref} {...props}>
    <Icon icon={faPlus} type="font-awesome" />
  </Disclosure>
))

export const DeleteIconDisclosure = forwardRef(
  ({ palette = "danger", variant = "outlined", ...props }, ref) => (
    <Disclosure ref={ref} palette={palette} variant={variant} {...props}>
      <Icon icon={faMinus} type="font-awesome" />
    </Disclosure>
  )
)

export default Disclosure
