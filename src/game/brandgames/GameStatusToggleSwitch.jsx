import React, { useState, useEffect, useMemo } from "react"
import {
  css,
  Stack,
  Heading,
  Box,
  Button,
  Select,
  SelectMenu,
  DropdownMenu,
  Switch,
  Spinner
} from "bumbag"
import { useTrans, Trans } from "../../i18n"
import { GameStatus } from "../games/GameStatus"
import { useChangeBrandGameStatus } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"

export const GameStatusToggleSwitch = ({
  id,
  value,
  onSubmitted,
  ...props
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let isActive = value == GameStatus.Active

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } =
    useChangeBrandGameStatus(formData)

  useEffect(() => {
    if (result) {
      onSubmitted?.()
      deleteCache()
    }
  }, [result])

  if (isLoading) {
    return <Spinner />
  }

  if (!editable) {
    return <Switch checked={isActive} disabled />
  }

  return (
    <Switch
      checked={isActive}
      onChange={(event) => {
        setSubmit({
          id,
          status: event.target.checked ? GameStatus.Active : GameStatus.Inactive
        })
      }}
    />
  )
}
