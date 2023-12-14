import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { ExportTrans } from "../trans/Action"

export const DownloadButton = ({
  use = "a",
  download = "",
  isLoading,
  disabled,
  whiteSpace = "nowrap",
  variant = "outlined",
  palette = "primary",
  children,
  ...props
}) => (
  <Button
    use={use}
    download={download}
    isLoading={isLoading}
    disabled={disabled || isLoading}
    whiteSpace={whiteSpace}
    // variant={variant}
    // palette={palette}
    {...props}
  >
    <ExportTrans />
  </Button>
)

export default DownloadButton
