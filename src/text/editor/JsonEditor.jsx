import React, { useState, useEffect, useMemo } from "react"
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
import MonacoEditor, {
  DiffEditor,
  useMonaco,
  loader
} from "@monaco-editor/react"
import { useForm, useFormContext, Controller } from "react-hook-form"
//TODO: obj -> pretty compact?
//import stringifyPrettyCompact from "json-stringify-pretty-compact"
import { stringifyJSON } from "../json"
import clone from "clone-deep"
import { ConfigPaths } from "./MonacoEditor"
import Backdrop from "../../dialog/Backdrop"
import FormDialog from "../../form/FormDialog"
import { CloseText, ConfirmText } from "../../button/ActionButtons"

loader.config({
  paths: ConfigPaths
})

const DefaultJsonOptions = {
  colorDecorators: true,
  contextmenu: false,
  minimap: { enabled: false },
  hideCursorInOverviewRuler: false
}

export const JsonEditor = ({ options, disabled = false, ...props }) => {
  if (!options) {
    options = clone(DefaultJsonOptions)
  }

  if (disabled) {
    options.readOnly = true
  }

  return <Body options={options} {...props} />
}

const Body = ({
  name,
  value = "",
  required,
  /*
    output = "compact",
    */
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
        defaultValue={stringifyJSON(value)}
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
            <Set orientation="vertical">
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
            </Set>
          )
        }}
      />
    )
  }

  return <Editor value={stringifyJSON(value)} {...props} onChange={onChange} />
}

const Editor = ({ ...props }) => {
  return (
    <MonacoEditor
      theme="light"
      defaultLanguage="json"
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
      {...props}
    />
  )
}

const DefaultJsonEditorProps = {
  height: "60vh"
}
export const JsonEditorFormDialog = ({
  value,
  disabled,
  dialog,
  onChange,
  jsonEditorProps: { height, ...jsonEditorProps } = DefaultJsonEditorProps,
  ...props
}) => {
  return (
    <Backdrop {...dialog}>
      <FormDialog
        defaultValues={{ value }}
        stopPropagation={true}
        onSubmit={(data) => {
          onChange?.(data.value)
          dialog.hide()
        }}
        submitText={disabled ? <CloseText /> : <ConfirmText />}
        dialog={dialog}
        hideBackdrop={true}
        css={css`
          min-width: 60vw;
          max-width: 90vw;
        `}
        {...props}
      >
        <JsonEditor
          name="value"
          disabled={disabled}
          height={height}
          {...jsonEditorProps}
        />
      </FormDialog>
    </Backdrop>
  )
}

//TODO
export const JsonDiffEditor = () => {}
