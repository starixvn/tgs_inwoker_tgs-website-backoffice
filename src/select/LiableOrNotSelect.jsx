import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { Select } from "./Select"
import { useLiableTrans, useNotLiableTrans } from "../trans/Status"
import { boolean } from "boolean"

const True = "true"
const False = "false"

export const LiableOrNotSelect = ({ name, registerOptions, ...props }) => {
  let options = [
    {
      label: useLiableTrans(),
      value: True
    },
    {
      label: useNotLiableTrans(),
      value: False
    }
  ]

  return (
    <Select
      name={name}
      options={options}
      registerOptions={{
        setValueAs: (value = "") => {
          if (!value) {
            return ""
          }
          value = boolean(value)
          return value
        },
        ...registerOptions
      }}
      {...props}
    />
  )
}
