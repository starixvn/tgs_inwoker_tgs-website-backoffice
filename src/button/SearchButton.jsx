import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Button } from "bumbag"
import { useTrans, Trans } from "../i18n"
import { SearchTrans } from "../trans/Action"

export const SearchButton = ({ type = "submit", children, ...props }) => (
  <Button type={type} {...props}>
    {children ?? <SearchTrans />}
  </Button>
)

export default SearchButton
