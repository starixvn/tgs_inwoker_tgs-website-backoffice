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
import { useUpdateBrandGameTag } from "./client"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Update } from "./menu"

export const GameTagSwitch = ({ id, tag, checked, onSubmitted, ...props }) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let [formData, setSubmit] = useState()
  let { result, isLoading, error, deleteCache } =
    useUpdateBrandGameTag(formData)

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
    return <Switch checked={checked} disabled={true} />
  }

  return (
    <Switch
      checked={checked}
      onChange={(event) => {
        setSubmit({
          id,
          tag,
          enabled: event.target.checked
        })
      }}
    />
  )
}
