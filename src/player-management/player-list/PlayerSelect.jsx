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
import _Select, { components } from "react-select"
import {
  useForm,
  useFormContext,
  Controller,
  useWatch,
  useFormState
} from "react-hook-form"
//TODO: use Components
import { Components } from "../../select/MultiSelect"

const Menu = ({ children, innerProps, ...props }) => {
  return (
    <components.Menu
      innerProps={{
        ...innerProps,
        "data-dialog": ""
      }}
      {...props}
      css={css`
        x-index: 2;
      `}
    >
      {children}
    </components.Menu>
  )
}

export const PlayerSelect = ({
  name = "test",
  brandId,
  rows = 10,
  required = true,
  ...props
}) => {
  let formMethods = useFormContext()

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
            menuIsOpen={true}
            isMulti
            defaultOptions
            loadOptions={async (search, loadedOptions, { page }) => {
              let searchParams = {
                brandId,
                page,
                rows,
                username: search
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
            onChange={(selectedOptions = []) => {
              if (name && formMethods.setValue) {
                formMethods.setValue(name, selectedOptions)
              }
            }}
            additional={{
              page: 1
            }}
            components={{
              Menu
            }}
            styles={{
              control: (styles) => ({
                ...styles,
                minHeight: "2.75em",
                border: `1px solid var(${
                  error ? "--bb-palette-danger" : "--bb-palette-white900"
                }, #000000)`,
                ":focus-within": {
                  "box-shadow":
                    "var(--bb-palette-primaryTint, #000000) 0px 0px 0px 3px",
                  "border-color": "var(--bb-palette-primary, #000000)"
                }
              }),
              menu: (styles) => ({
                ...styles,
                "x-index": 2
              })
            }}
          />
        )
      }}
    />
  )

  // let Control = useCallback(toControl({ name }), [name])
  return (
    <AsyncPaginate
      menuIsOpen={true}
      aria-errormessage="testerror"
      isMulti
      defaultOptions
      loadOptions={async (search, loadedOptions, { page }) => {
        let searchParams = {
          brandId,
          page,
          rows,
          username: search
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
      onChange={(selectedOptions = []) => {
        if (name && formMethods.setValue) {
          formMethods.setValue(name, selectedOptions)
        }
      }}
      additional={{
        page: 1
      }}
      // components={{
      //   Control
      // }}
    />
  )
}

const toControl =
  ({ name, required = true }) =>
  ({ children, ...props }) => {
    let { control } = useFormContext()
    return (
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({
          field,
          fieldState: { isTouched, isDirty, error },
          formState
        }) => {
          return (
            <components.Control
              {...props}
              css={css`
                border-color: var(
                  ${error ? "--bb-palette-danger" : "--bb-palette-white900"},
                  #000000
                );

                :hover {
                  border-color: var(--bb-palette-primary, #000000);
                  box-shadow: var(--bb-palette-primaryTint, #000000) 0px 0px 0px
                    3px;
                }
              `}
            >
              {children}
            </components.Control>
          )
        }}
      />
    )
    // return <components.Control {...props}>{children}</components.Control>
  }

//TODO: form ctrl
/*
export const PlayerSelect = ({ brandId, rows = 10, ...props }) => {
  let combobox = useComboboxStore()

  let [page, setPage] = useState(1)
  let [username, setUsername] = useState("")

  let { isLoading, data, error } = usePlayerList({
    brandId,
    page
  })

  let [players, setPlayers] = useState([])

  useEffect(() => {
    //TODO: from data?.items -> player options
  }, [JSON.stringify(data?.items)])

  return (
    <Box>
      <Combobox store={combobox} />
      <ComboboxPopover store={combobox} gutter={4} sameWidth></ComboboxPopover>
    </Box>
  )
}
*/

const toOptions = (players = []) => {}

//TODO: return promise -> resolve with options?
const usePlayerOptionList = (brandId) => async (searchParams) => {}
