import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { SubmitTrans } from "../trans/Action"

export const SubmitButton = ({ type = "submit", children, ...props }) => (
  <Button type={type} {...props}>
    {children ?? <SubmitTrans />}
  </Button>
)

export default SubmitButton
