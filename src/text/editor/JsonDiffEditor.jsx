import React, { useState, useRef, useEffect, useMemo, forwardRef } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Button,
  Text,
  Set,
  Icon,
  useModalState,
  Dialog,
  Card,
  Flex,
  Heading,
  FieldStack
} from "bumbag"
import { DiffEditor, loader } from "@monaco-editor/react"
import { ConfigPaths } from "./MonacoEditor"
import { stringifyJSON } from "../json"

loader.config({
  paths: ConfigPaths
})

const DefaultOptions = {
  readOnly: true,
  contextmenu: false
}

export const JsonDiffEditor = ({
  original,
  modified,
  options = DefaultOptions,
  ...props
}) => {
  let ref = useRef()

  return (
    <DiffEditor
      language="JSON"
      options={options}
      original={stringifyJSON(original)}
      modified={stringifyJSON(modified)}
      onMount={(editor) => {
        ref.current = editor
      }}
      {...props}
    />
  )
}
