import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { CodeContentPair as PlatformPair } from "./platform"
import { Routes } from "../content"
import { Code, DefaultCodePath, Menu } from "./menu"
import { Route } from "react-router-dom"
import { PlatformDashboardPage } from "./platform"

export { Code } from "./menu"

const pairs = () => [PlatformPair]

export const Content = ({ codes, path = DefaultCodePath, ...props }) => (
  <Routes path={path} pairs={pairs()} />
)

export const DashboardContent = ({}) => {
  //TODO: get user role?
  //TODO: role -> page
  return <PlatformDashboardPage />
}

export const DashboardMenu = ({}) => {}

export const codeMenuContentPair = [Code, [Menu, Content]]
