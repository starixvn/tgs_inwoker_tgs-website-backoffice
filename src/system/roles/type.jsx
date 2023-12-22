import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import { useUserRoleType } from "../../user/context"
import Select from "../../select/Select"
import {
  LicenseeTrans,
  PlatformTrans,
  useLicenseeTrans,
  usePlatformTrans
} from "../../trans/Platform"

const Admin = "Admin"
const AdminTrans = {
  zh: "管理员",
  en: "Admin"
}

const Reseller = "Reseller"
const ResellerTrans = {
  zh: "总公司",
  en: "Reseller"
}

const Licensee = "Licensee"

const Brand = "Brand"

export const RoleTypes = {
  Admin,
  Reseller,
  Licensee,
  Brand
}

export const RoleTypeLabel = ({ value }) => {
  switch (value) {
    case Admin:
      return <Trans {...AdminTrans} />
    case Reseller:
      return <Trans {...ResellerTrans} />
    case Licensee:
      return <LicenseeTrans />
    case Brand:
      return <PlatformTrans />
  }
}

export const adminOrNextRoleType = (roleType) => {
  if (roleType == Admin) {
    return Admin
  }

  let list = [Reseller, Licensee, Brand]
  let index = list.findIndex((value) => value === roleType)
  return list[index + 1]
}

export const isNextRoleType = (userRoleType, roleType) => {
  let list = [Admin, Reseller, Licensee, Brand]
  let userRoleIndex = list.findIndex((item) => item === userRoleType)
  let index = list.findIndex((item) => item === roleType)
  return userRoleIndex >= 0 && userRoleIndex + 1 === index
}

export const isSameOrAfterRoleType = (roleType, userRoleType) => {
  let list = [Admin, Reseller, Licensee, Brand]
  let roleTypeIndex = list.findIndex((item) => item === roleType)
  let userRoleIndex = list.findIndex((item) => item === userRoleType)
  return (
    userRoleIndex >= 0 && roleTypeIndex >= 0 && roleTypeIndex <= userRoleIndex
  )
}

export const findParentRoleType = (roleType) => {
  let list = [Admin, Reseller, Licensee, Brand]
  let index = list.findIndex((item) => item === roleType)
  return list[index - 1]
}

export const nextRoleType = (roleType) => {
  let list = [Admin, Reseller, Licensee, Brand]
  let index = list.findIndex((item) => item === roleType)
  return list[index + 1]
}

export const useRoleTypeOptions = () => {
  let userRoleType = useUserRoleType()
  let list = [Admin, Reseller, Licensee, Brand]
  const TypeOption = {
    Admin: {
      label: useTrans(AdminTrans),
      value: Admin
    },
    Reseller: {
      label: useTrans(ResellerTrans),
      value: Reseller
    },
    Licensee: {
      label: useLicenseeTrans(),
      value: Licensee
    },
    Brand: {
      label: usePlatformTrans(),
      value: Brand
    }
  }
  let userRoleIndex = list.findIndex((value) => value === userRoleType)
  if (userRoleIndex < 0) {
    return []
  }

  let opitons = list
    .slice(userRoleIndex)
    .map((type) => Reflect.get(TypeOption, type))
  return opitons
}

export const RoleTypeSelect = ({ placeholder, options, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "选择权限组类型",
    en: "Select Role Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let defaultOptions = useRoleTypeOptions()
  options = options ?? defaultOptions

  return <Select placeholder={placeholder} options={options} {...props} />
}
