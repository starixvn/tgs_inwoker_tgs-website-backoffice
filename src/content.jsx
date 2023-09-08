import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Routes as _Routes, Route } from "react-router-dom"
import { useMenuCodes } from "./user/context"
import { RequireAuth } from "./user/auth"
import PageNotFound from "./page/NotFound"
import { allMenuContentPairs } from "./menu"
import { PageContent } from "bumbag"
import { Code as DashboardCode } from "./dashboard/menu"
import { DashboardContent } from "./dashboard"

export const Routes = ({ codes, path, pairs = [], ...props }) => {
  let authCodes = useMenuCodes(path)
  codes = codes ?? authCodes

  return (
    <_Routes>
      {codes.map((code) => {
        return (
          <Route
            key={code}
            path={code}
            element={<ValueByCode code={code} pairs={pairs} />}
          />
        )
      })}
      <Route element={<PageNotFound />} />
    </_Routes>
  )
}

export const AllContents = ({ codes }) => {
  let authCodes = useMenuCodes()
  codes = codes ?? authCodes
  let list = allMenuContentPairs()

  // let hasDashboard = codes.includes(DashboardCode)
  return (
    <_Routes>
      {/* <Route path="/" element={<DashboardContent />} /> */}
      {codes
        // .filter((code) => code != DashboardCode)
        .map((code) => {
          let path = `${code}/*`

          return (
            <Route
              key={code}
              path={path}
              element={
                <RequireAuth>
                  <ContentByCode code={code} pairs={list} />
                </RequireAuth>
              }
            />
          )
        })}

      <Route path="*" element={<PageContent></PageContent>} />
    </_Routes>
  )
}

const ValueByCode = ({ code = "", pairs = [] }) => {
  let [, Value] = pairs.find(([id]) => id === code) ?? []
  if (Value) {
    return <Value />
  }

  return null
}

const ContentByCode = ({ code = "", pairs = [] }) => {
  let [, pair] = pairs.find(([id]) => id === code) ?? []
  if (pair) {
    let [, Content] = pair
    return <Content />
  }

  return null
}
