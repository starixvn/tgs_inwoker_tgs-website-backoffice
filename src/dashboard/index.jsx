import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { CodeContentPair as PlatformPair } from "./platform"
import { Routes } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"

export { Code } from "./menu"

const pairs = () => [PlatformPair]

//TODO: test url "/"
export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const codeMenuContentPair = [Code, [Menu, Content]]
