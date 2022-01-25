import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Select, Input } from "bumbag"
import { Trans, useTrans } from "../i18n"
import ReactSelect, { components } from "react-select"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"

const Option = ({ data, innerProps, ...props } = {}) => {
  return (
    <components.Option
      data={data}
      innerProps={{
        "data-option-value": data?.value,
        ...innerProps
      }}
      {...props}
    />
  )
}

const DropdownIndicator = ({ children, innerProps, ...props } = {}) => {
  return (
    <components.DropdownIndicator
      innerProps={{
        id: "dropdown-indicator",
        ...innerProps
      }}
      {...props}
    >
      {children}
    </components.DropdownIndicator>
  )
}

const MultiValueContainer = ({ data, innerProps, ...props }) => {
  return (
    <components.MultiValueContainer
      data={data}
      innerProps={{
        "data-value": data?.value,
        ...innerProps
      }}
      {...props}
    />
  )
}

const MenuList = ({ children, innerProps, ...props }) => {
  return (
    <components.MenuList
      innerProps={{
        id: "menu-list",
        ...innerProps
      }}
      {...props}
    >
      {children}
    </components.MenuList>
  )
}

export const MultiSelect = ({
  name,
  control,
  defaultValue,
  isMulti = true,
  registerOptions = {},
  ...props
}) => {
  let formContext = useFormContext()
  control = control ?? formContext.control

  if (name && control && props.isLoading) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={props?.defaultValue}
        render={() => {
          return <Select isLoading options={[]} />
        }}
      />
    )
  }

  //let autoRegisterFormField = name && control
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: props.required,
        /*
        min: props.min,
        max: props.max,
        minLength: props.minLength,
        maxLength: props.maxLength,
        */
        validate: props.validate,
        ...registerOptions
      }}
      render={({
        field: { value = [], name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState
      }) => {
        let controlledValue =
          value?.map?.((item) =>
            props?.options.find((option) => option.value == item)
          ) || value

        return (
          <ReactSelect
            ref={ref}
            defaultValue={controlledValue}
            value={controlledValue}
            onChange={(data) => {
              let value = data.map(({ value }) => value)
              formContext.setValue(name, value)
            }}
            components={{
              Option,
              DropdownIndicator,
              MultiValueContainer,
              MenuList
            }}
            isMulti={isMulti}
            styles={{
              control: (styles) => ({
                ...styles,
                minHeight: "2.75em",
                ":focus-within": {
                  "box-shadow":
                    "var(--bb-palette-primaryTint, #000000) 0px 0px 0px 3px",
                  "border-color": "var(--bb-palette-primary, #000000)"
                }
              }),
              clearIndicator: (styles) => ({ ...styles, display: "none" }),
              indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: "var(--bb-palette-text, #000000)"
              })
            }}
            {...props}
          />
        )
      }}
    />
  )
}
