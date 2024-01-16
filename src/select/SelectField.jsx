import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
// import * as Ariakit from "@ariakit/react"
/*
import {
  Select,
  SelectArrow,
  SelectItem,
  SelectProvider,
  SelectLabel,
  SelectPopover
} from "@ariakit/react"

//TODO: work with form?
//TODO: placeholder?
//TODO: &[aria-invalid="true"] {}
const SelectButton = ({ options = [], ...props }) => {
  let select = Ariakit.useSelectContext()
  let value = select.useState("value")

  let label = options.find((opt) => opt.value === value)?.label ?? value ?? ""
  return (
    <Select
      css={css`
        width: max-content;
        color: var(--bb-palette-text, #000000);
        height: 2.75em;
        transition: box-shadow 0.1s ease-in-out 0s, border-color 0.1s,
          background-color 0.1s;
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
        padding: 0.4em 2em 0.4em 0.8em;
        &:focus,
        &[aria-expanded="true"],
        &:active,
        &[data-active] {
          border-color: var(--bb-palette-primary, #000000);
          box-shadow: var(--bb-palette-primaryTint, #000000) 0px 0px 0px 3px !important;
        }
        &[aria-disabled="true"] {
          background: var(--bb-palette-white700, #000000);
          opacity: 0.7;
          box-shadow: unset;
        }

        display: flex;
        user-select: none;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
        background-color: hsl(204 20% 100%);
        font-size: 1rem;
        line-height: 1.5rem;
        text-decoration-line: none;
        outline-width: 2px;
        outline-offset: 2px;
        outline-color: hsl(204 100% 40%);
        --border: rgba(0, 0, 0, 0.1);
        --highlight: rgba(255, 255, 255, 0.2);
        --shadow: rgba(0, 0, 0, 0.1);
        justify-content: space-between;
      `}
      {...props}
    >
      {label}
      <SelectArrow />
    </Select>
  )
}

//TODO: disabled
//TODO: data-active-item
const SelectOption = ({ value = "", label = "", ...props }) => {
  return (
    <SelectItem
      value={value}
      css={css`
        display: flex;
        cursor: default;
        scroll-margin: 0.5rem;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.25rem;
        padding: 0.5rem;
        outline: none;

        &[data-active-item] {
          background-color: var(--bb-palette-white700, #000000);
        }
      `}
      {...props}
    >
      {label}
    </SelectItem>
  )
}

//TODO: work with form?
//TODO: onChange?
//TODO: field label
//TODO: placeholder
export function SelectField({
  value,
  defaultValue,
  placeholder = "placeholder",
  options = [],
  popoverProps = {},
  ...props
}) {
  return (
    <div
      css={css`
        width: fit-content;
        transition: background-color 0.2s ease;
        background-color: var(--bb-palette-white, #ffffff);
        border-radius: 6px;
      `}
    >
      <SelectProvider value={value} defaultValue={defaultValue}>
        <SelectLabel
          css={css`
            padding-left: 1rem;
            display: none;
          `}
        >
          TODO: label?
        </SelectLabel>
        <SelectButton options={options} {...props} />
        <SelectPopover
          gutter={4}
          sameWidth
          unmountOnHide
          css={css`
            z-index: 50;
            display: flex;
            max-height: min(var(--popover-available-height, 300px), 300px);
            flex-direction: column;
            overflow: auto;
            overscroll-behavior: contain;
            border-radius: 0.5rem;
            border-width: 1px;
            border-style: solid;
            border-color: hsl(204 20% 88%);
            background-color: hsl(204 20% 100%);
            padding: 0.5rem;
            color: hsl(204 10% 10%);
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
              0 4px 6px -4px rgb(0 0 0 / 0.1);
          `}
          {...popoverProps}
        >
          {options.map(({ value = "", ...itemProps }) => {
            return <SelectOption key={value} value={value} {...itemProps} />
          })}
        </SelectPopover>
      </SelectProvider>
    </div>
  )
}
*/
