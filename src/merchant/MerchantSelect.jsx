import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import {
  Checkbox,
  FieldStack,
  FieldWrapper,
  Select,
  SelectField,
  Table,
  SwitchField,
  Group,
  Set
} from "bumbag"
import { Reseller } from "./resellers"
import { Licensee } from "./licensees"
import { Brand } from "./platforms"
import { useTrans } from "../i18n"
import { useFormContext } from "react-hook-form"
import { ResellerIdSelect } from "./resellers/ResellerIdSelect"
import { LicenseeIdSelect } from "./licensees/LicenseeIdSelect"
import { BrandIdSelect } from "./platforms/BrandIdSelect"

const isActive = (merchant, start, end) => {
  const order = [Reseller, Licensee, Brand]
  let merchantIndex = order.findIndex((item) => item === merchant)
  let startIndex = order.findIndex((item) => item === start)
  let endIndex = order.findIndex((item) => item === end)
  return (
    merchantIndex >= 0 &&
    merchantIndex >= startIndex &&
    merchantIndex <= endIndex
  )
}

const ResellerIdName = "resellerId"
const DefaultResellerProps = {
  name: ResellerIdName
}

const LicenseeIdName = "licenseeId"
const DefaultLicenseeProps = {
  name: LicenseeIdName
}

const BrandIdName = "brandId"
const DefaultBrandProps = {
  name: BrandIdName
}

export const MerchantIdSelect = ({
  start = Reseller,
  end = Brand,
  // stepByStep,

  resellerProps: {
    name: resellerIdName = ResellerIdName,
    onChange: onResellerChange,
    ...resellerProps
  } = DefaultResellerProps,

  licenseeProps: {
    name: licenseeIdName = LicenseeIdName,
    onChange: onLicenseeChange,
    ...licenseeProps
  } = DefaultLicenseeProps,

  brandProps: {
    name: brandIdName = BrandIdName,
    onChange: onBrandChange,
    ...brandProps
  } = DefaultBrandProps,

  required = true,
  parentRequired = false,
  disabled,
  ...props
}) => {
  let formMethods = useFormContext()

  let [resellerId, setResellerId] = useState(
    resellerProps?.value ?? resellerProps?.defaultValue
  )
  let isResellerActive = isActive(Reseller, start, end)
  if (
    isResellerActive &&
    parentRequired &&
    formMethods &&
    !resellerProps.validate
  ) {
    resellerProps.validate = (value) => {
      if (isLicenseeActive && formMethods.getValues(licenseeIdName)) {
        return !!value
      }

      if (isBrandActive && formMethods.getValues(brandIdName)) {
        return !!value
      }

      return true
    }
  }

  let [licenseeId, setLicenseeId] = useState(
    licenseeProps?.value ?? licenseeProps?.defaultValue
  )
  let isLicenseeActive = isActive(Licensee, start, end)
  if (
    isLicenseeActive &&
    parentRequired &&
    formMethods &&
    !licenseeProps.validate
  ) {
    licenseeProps.validate = (value) => {
      if (
        parentRequired &&
        isBrandActive &&
        formMethods.getValues(brandIdName)
      ) {
        return !!value
      }
    }
  }

  let isBrandActive = isActive(Brand, start, end)
  if (isBrandActive && formMethods && !brandProps.validate) {
    brandProps.validate = (value) => {
      if (isBrandActive && required && !disabled && !value) {
        return false //brandId required
      }
    }
  }

  //TODO: rm when react-hook-form fix bug
  useEffect(() => {
    if (!isBrandActive) {
      formMethods?.unregister(brandIdName)
    }
  }, [isBrandActive])

  return (
    <>
      <Group {...props}>
        {isResellerActive && (
          <ResellerIdSelect
            name={resellerIdName}
            required={required}
            disabled={disabled}
            {...resellerProps}
            onChange={(event) => {
              formMethods?.setValue(licenseeIdName, undefined)
              formMethods?.setValue(brandIdName, undefined)

              let resellerId = event.target.value
              setResellerId(resellerId)
              onResellerChange?.(resellerId)
            }}
          />
        )}
        {isLicenseeActive && (
          <LicenseeIdSelect
            name={licenseeIdName}
            required={required}
            disabled={disabled}
            resellerId={resellerId}
            {...licenseeProps}
            onChange={(event) => {
              formMethods?.setValue(brandIdName, undefined)

              let licenseeId = event.target.value
              setLicenseeId(licenseeId)
              onLicenseeChange?.(licenseeId)
            }}
          />
        )}
        {isBrandActive && (
          <BrandIdSelect
            name={brandIdName}
            required={required}
            disabled={disabled}
            licenseeId={licenseeId}
            {...brandProps}
            onChange={(event) => {
              let value = event.target.value
              onBrandChange?.(value)
            }}
          />
        )}
      </Group>
    </>
  )
}
