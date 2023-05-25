import React, { createContext, useContext, useState } from "react"
import { Route as RouteBase, Navigate, useLocation } from "react-router-dom"
import { useIsAuthed } from "./context"
import { Path as LoginPath } from "./login"

export const RequireAuth = ({ children, ...rest }) => {
  let auth = useIsAuthed()
  let location = useLocation()

  if (!auth) {
    return <Navigate to={LoginPath} state={{ from: location }} replace />
  }

  return children
}
