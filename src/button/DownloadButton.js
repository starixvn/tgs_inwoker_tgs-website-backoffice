import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"

export const DownloadButton = ({
  use = "a",
  download = "",
  isLoading,
  disabled,
  whiteSpace = "nowrap",
  children,
  ...props
}) => (
  <Button
    use={use}
    download={download}
    isLoading={isLoading}
    disabled={disabled || isLoading}
    whiteSpace={whiteSpace}
    {...props}
  >
    <Trans zh="汇出" en="Export" />
  </Button>
)

export default DownloadButton
