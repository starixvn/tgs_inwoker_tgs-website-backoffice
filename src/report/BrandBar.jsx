import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, useModalState } from "bumbag"
import {
  useUserBrandId,
  useUserRoleType,
  useUserResellerId,
  useUserLicenseeId
} from "../user/context"
import { MerchantIdSelect } from "../merchant/MerchantSelect"
import { nextRoleType } from "../system/roles/type"
import equals from "fast-deep-equal"

export const BrandBar = ({
  id = "page-merchant-bar",
  name = "brandBar",
  onLicenseeChange,
  onBrandChange,
  onResellerChange,
  ...props
}) => {
  let location = useLocation()
  let navigate = useNavigate()

  let userRoleType = useUserRoleType()

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  // TODO: able to rm initialState?
  // let initialState = location?.state ?? {}
  let [state, setState] = useState({
    /*
    ...initialState,
    */
    resellerId: userResellerId ?? location?.state?.resellerId,
    licenseeId: userLicenseeId ?? location?.state?.licenseeId,
    brandId: userBrandId ?? location?.state?.brandId
  })

  useEffect(() => {
    if (!equals(state, location?.state)) {
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location?.state,
          ...state
        }
      })
    }
  }, [JSON.stringify(state), JSON.stringify(location?.state ?? {})])

  useEffect(() => {
    onBrandChange?.(state?.brandId)
  }, [state?.brandId])

  useEffect(() => {
    onLicenseeChange?.(state?.licenseeId)
  }, [state?.licenseeId])

  useEffect(() => {
    onResellerChange?.(state?.resellerId)
  }, [state?.resellerId])

  let formMethods = useForm()

  if (userBrandId) {
    return null
  }

  return (
    <FormProvider {...formMethods}>
      <MerchantIdSelect
        id={id}
        start={nextRoleType(userRoleType)}
        resellerProps={{
          value: state?.resellerId,
          onChange: (resellerId) => {
            setState((prevState) => ({
              ...prevState,
              resellerId
            }))
          }
        }}
        licenseeProps={{
          value: state?.licenseeId,
          onChange: (licenseeId) => {
            setState((prevState) => ({
              ...prevState,
              licenseeId
            }))
          }
        }}
        brandProps={{
          value: state?.brandId,
          onChange: (brandId) => {
            setState((prevState) => ({
              ...prevState,
              brandId
            }))
          }
        }}
        paddingTop="1em"
        paddingLeft="1em"
        {...props}
      />
    </FormProvider>
  )
}

export default BrandBar
