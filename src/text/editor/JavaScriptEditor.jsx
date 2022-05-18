import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Text, Set, Icon, FieldStack } from "bumbag"
import MonacoEditor, {
  DiffEditor,
  useMonaco,
  loader
} from "@monaco-editor/react"
import { useForm, useFormContext, Controller } from "react-hook-form"
import clone from "clone-deep"
import { ConfigPaths } from "./MonacoEditor"

loader.config({
  paths: ConfigPaths
})

const DefaultOptions = {
  colorDecorators: true,
  contextmenu: false,
  minimap: { enabled: true },
  hideCursorInOverviewRuler: false
}

export const JavaScriptEditor = ({
  options = clone(DefaultOptions),
  readOnly,
  ...props
}) => {
  options = { ...clone(options), readOnly }

  return <Body options={options} readOnly={readOnly} {...props} />
}

const Body = ({
  name,
  defaultValue = "",
  required,
  shouldUnregister,
  onChange,
  ...props
}) => {
  let formMethods = useFormContext()

  let [errorMarkers, setErrorMarkers] = useState([])
  if (name && formMethods) {
    return (
      <Controller
        control={formMethods.control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required,
          validate: () => {
            return errorMarkers.length ? false : true
          }
        }}
        shouldUnregister={true}
        render={({
          field: { onBlur, value, name, ref },
          fieldState: { isTouched, isDirty, error }
        }) => {
          return (
            <Editor
              value={value}
              {...props}
              beforeMount={(monaco) => {
                //init monaco
              }}
              onMount={(editor) => {
                ref.current = editor
              }}
              onValidate={setErrorMarkers}
              onChange={(value, event) => {
                formMethods.setValue(name, value)
                onChange?.(value)
              }}
            />
          )
        }}
      />
    )
  }

  return <Editor defaultValue={defaultValue} onChange={onChange} {...props} />
}

const Editor = ({ ...props }) => {
  return (
    <MonacoEditor
      theme="light"
      defaultLanguage="javascript"
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
      {...props}
    />
  )
}
