import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import { Box, Popover } from "bumbag"
import { AsyncPaginate } from "react-select-async-paginate"
import { API, usePlayerList } from "./client"
import { urlWith } from "../../client"
import {
  useForm,
  useFormContext,
  Controller,
  useWatch,
  useFormState
} from "react-hook-form"
import { Components } from "../../select/MultiSelectBox"
import { useTrans } from "../../i18n"
import { isArray } from "lodash-es"
import { SortOrder } from "../../table/order"
import { usePlayerUsernameTrans } from "../../trans/Player"

//TODO: support group option?
//TODO: support controlled value?
export const PlayerSelect = ({
  name = "",
  isMulti,
  brandId,
  autoFocus,
  placeholder,
  rows = 10,
  required,
  ...props
}) => {
  let formMethods = useFormContext()

  let defaultPlaceholder = usePlayerUsernameTrans()

  placeholder = placeholder ?? defaultPlaceholder

  return (
    <Controller
      name={name}
      control={formMethods?.control}
      rules={{ required }}
      render={({
        field,
        fieldState: { isTouched, isDirty, error },
        formState
      }) => {
        return (
          <AsyncPaginate
            name={name}
            isMulti={isMulti}
            autoFocus={autoFocus}
            placeholder={placeholder}
            // menuIsOpen={true}
            defaultOptions
            loadOptions={async (search, loadedOptions, { page }) => {
              let searchParams = {
                brandId,
                page,
                rows,
                username: search,
                sortby: "username",
                orderby: SortOrder.Ascending
              }
              const response = await fetch(urlWith(searchParams, API))
              const result = await response.json()

              let loadedSize = (page - 1) * rows + result.items.length
              let hasMore = loadedSize < result.totalCount
              let options = result.items.map((player) => ({
                label: player.username,
                value: player.playerCode
              }))

              return {
                options,
                hasMore,
                additional: {
                  page: page + 1
                }
              }
            }}
            onChange={(raw) => {
              let value = isArray(raw)
                ? raw.map(({ value }) => value)
                : raw.value

              if (name && formMethods.setValue) {
                formMethods.setValue(name, value)
              }

              props?.onChange?.(value, raw)
            }}
            additional={{
              page: 1
            }}
            components={Components}
            {...props}
          />
        )
      }}
    />
  )
}
