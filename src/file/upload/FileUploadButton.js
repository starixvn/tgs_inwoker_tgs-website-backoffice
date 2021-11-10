import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Button } from "bumbag"
import { useDropzone } from "react-dropzone"
import { Trans } from "../../i18n"
import { LocalizationDialogDisclosure } from "../../dialog/LocalizationDialog"
import AlertDialog from "../../dialog/Alert"
import { Controller, useFormContext, useWatch } from "react-hook-form"

const DefaultMaxFiles = 1

const OneMBInBytes = 1048576
const DefaultMaxSize = OneMBInBytes * 10 //10MB

export const FileUploadButton = ({
  id,
  name,
  children,
  accept,
  maxSize = DefaultMaxSize,
  useUpload,
  disabled,
  onUploaded,
  required,
  ...props
}) => {
  let [formData, setSubmit] = useState()

  let {
    acceptedFiles = [],
    getRootProps,
    getInputProps
  } = useDropzone({
    accept,
    maxFiles: DefaultMaxFiles,
    disabled,
    maxSize,
    onDrop: (files = []) => {
      let [file] = files
      if (file) {
        let formData = new FormData()
        formData.append("file", file, file.name)
        setSubmit(formData)
      }
    }
  })

  let { isLoading, result, error, mutate, deleteCache } = useUpload?.(formData)

  disabled = disabled || isLoading

  let formMethods = useFormContext()

  useEffect(() => {
    let value = result?.location

    if (result?.valid && value) {
      onUploaded?.(value)

      if (name && formMethods?.setValue) {
        formMethods?.setValue(name, value)
      }
    }
  }, [result])

  if (name && formMethods?.control) {
    return (
      <Controller
        name={name}
        control={formMethods?.control}
        rules={{
          required
        }}
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState,
          formState
        }) => {
          useEffect(() => {
            if (fieldState.invalid && isLoading) {
              formMethods.clearErrors(name)
            }
          }, [fieldState.invalid, isLoading])

          let palette = fieldState.invalid ? "danger" : "default"
          let variant = fieldState.invalid ? "outlined" : "default"
          return (
            <>
              <Button
                id={id}
                {...getRootProps({
                  disabled,
                  refKey: "elementRef"
                })}
                palette={palette}
                variant={variant}
                isLoading={isLoading}
              >
                {children}
                <input {...getInputProps()} />
                {error && <AlertDialog {...error} onClickClose={deleteCache} />}
              </Button>
            </>
          )
        }}
      />
    )
  }

  return (
    <>
      <Button
        id={id}
        {...getRootProps({
          disabled,
          refKey: "elementRef"
        })}
        isLoading={isLoading}
      >
        {children}
        <input {...getInputProps()} />
        {error && <AlertDialog {...error} onClickClose={deleteCache} />}
      </Button>
    </>
  )
}

export default FileUploadButton
