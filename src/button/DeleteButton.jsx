import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"

export const DeleteButton = ({
  type = "button",
  palette = "danger",
  variant = "outlined",
  children,
  ...props
}) => (
  <Button type={type} palette={palette} variant={variant} {...props}>
    {children ?? <Trans zh="删除" en="Delete" />}
  </Button>
)

export default DeleteButton
