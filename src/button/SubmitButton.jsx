import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"

export const SubmitButton = ({ type = "submit", children, ...props }) => (
  <Button type={type} {...props}>
    {children ?? <Trans zh="提交" en="Submit" />}
  </Button>
)

export default SubmitButton
