import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Routes as _Routes, Route, Navigate } from "react-router-dom"
import { useMenuCodes } from "./user/context"
import { RequireAuth } from "./user/auth"
import PageNotFound from "./page/NotFound"
import { allMenuContentPairs } from "./menu"
import { PageContent } from "bumbag"
import { Code as OverviewCode } from "./overview/menu"
import {
  Code as PlatformCode,
  View as ViewPlatformOverview
} from "./overview/platform/menu"
import { OverviewContent } from "./overview"

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

  let hasPlatformOverviewAuth = useMenuCodes([
    OverviewCode,
    PlatformCode
  ])?.includes(ViewPlatformOverview)

  //TODO: auto redirect to overview?
  // let hasDashboard = codes.includes(OverviewCode)
  return (
    <_Routes>
      {/* <Route path="/" element={<OverviewContent />} /> */}
      {codes
        // .filter((code) => code != OverviewCode)
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

      <Route
        path="*"
        element={
          <RequireAuth>
            {hasPlatformOverviewAuth ? (
              <Navigate to={`/${OverviewCode}/${PlatformCode}`} />
            ) : (
              <PageContent></PageContent>
            )}
          </RequireAuth>
        }
      />
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
