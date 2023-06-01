import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Select, Input } from "bumbag"
import { Trans, useTrans } from "../i18n"
import ReactSelect, { components } from "react-select"
import {
  useForm,
  useFormContext,
  Controller,
  useWatch,
  useFormState
} from "react-hook-form"

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

const Control = ({ children, ...props }) => {
  let name = props?.selectProps?.name

  let formMethods = useFormContext()
  let formState = useFormState({ control: formMethods?.control })
  let error = formState?.errors?.[name]

  return (
    <components.Control
      {...props}
      css={css`
        min-height: 2.75em;
        border: 1px solid
          var(
            ${error ? "--bb-palette-danger" : "--bb-palette-white900"},
            #000000
          );

        :focus-within {
          border-color: var(--bb-palette-primary, #000000);
          box-shadow: var(--bb-palette-primaryTint, #000000) 0px 0px 0px 3px;
        }
      `}
    >
      {children}
    </components.Control>
  )
}

const IndicatorsContainer = ({ children, ...props }) => {
  let notLoading = !props?.selectProps?.isLoading
  return (
    <components.IndicatorsContainer {...props}>
      {notLoading && (
        <div
          css={css`
            width: 40px;
          `}
        ></div>
      )}
      {children}
    </components.IndicatorsContainer>
  )
}

const Menu = ({ children, innerProps, ...props }) => {
  return (
    <components.Menu
      innerProps={{
        ...innerProps,
        "data-dialog": ""
      }}
      {...props}
      css={css`
        z-index: 2;
      `}
    >
      {children}
    </components.Menu>
  )
}

//TODO: how to forwardRef innerRef?
//TODO: rm
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

export const Components = {
  Control,
  IndicatorsContainer,
  Menu,
  Option,
  DropdownIndicator,
  MultiValueContainer
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
        fieldState: { isTouched, isDirty, error },
        formState
      }) => {
        //TODO: support group options
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
            components={Components}
            isMulti={isMulti}
            styles={{
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
