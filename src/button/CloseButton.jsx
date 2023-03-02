import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { Trans } from "../i18n"

const Close = {
  zh: "关闭",
  en: "Close"
}

export const CloseButton = ({ type = "button", children, ...props }) => (
  <Button type={type} {...props}>
    {children ?? <Trans {...Close} />}
  </Button>
)

export default CloseButton
