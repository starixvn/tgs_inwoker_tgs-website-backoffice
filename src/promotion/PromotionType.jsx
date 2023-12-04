import React from "react"
import { Spinner, Group, Popover, Button } from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../i18n"
import Select, { SelectField } from "../select/Select"
import { usePromotionTypeList } from "./client"
import { useFormContext } from "react-hook-form"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import {
  usePromotionSubtypeTrans,
  usePromotionTypeTrans
} from "../trans/Promotion"

const Deposit = "Deposit"

const Turnover = "Turnover"

const ReliefMoney = "ReliefMoney"

const Signin = "Signin"

const NewUser = "NewUser"

const LuckyDraw = "Lottery"

const Dummy = "Dummy"

const Offline = "Offline"

export const PromotionTypeGroup = {
  Deposit,
  Turnover,
  ReliefMoney,
  Signin,
  NewUser,
  LuckyDraw,
  Dummy,
  Offline
}

export const useFindPromotionType = (promotionType) => {
  let { isLaoding, data: groups, error } = usePromotionTypeList()

  return groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    return group?.types?.find((type) => type.name === promotionType)
  }, undefined)
}

export const useFindPromotionTypeGroup = (promotionType) => {
  let { isLaoding, data: groups, error } = usePromotionTypeList()

  return groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    let type = group?.types?.find((type) => type.name === promotionType)
    return type ? group : undefined
  }, undefined)
}

//TODO: use useFindPromotionTypeGroup
export const usePromotionGroupLabelOf = (promotionType) => {
  let locale = useLocale()
  let { isLoading, data: groups, error } = usePromotionTypeList()
  if (isLoading) {
    return ""
  }

  let group = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    let type = group?.types?.find((type) => type.name === promotionType)
    return type ? group : undefined
  }, undefined)

  return group?.trans?.[locale] ?? group?.name ?? ""
}

//TODO: use useFindPromotionTypeGroup
export const usePromotionGroupValueOf = (promotionType) => {
  let { isLoading, data: groups, error } = usePromotionTypeList()
  if (isLoading) {
    return ""
  }

  let group = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    let type = group?.types?.find((type) => type.name === promotionType)
    return type ? group : undefined
  }, undefined)

  return group?.name ?? ""
}

//TODO: useFindPromotionType
export const useSettlementIntervalType = (promotionType) => {
  let { isLoading, data: groups, error } = usePromotionTypeList()
  if (isLoading) {
    return ""
  }

  let result = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    let type = group?.types?.find((type) => type.name === promotionType)
    return type
  }, undefined)

  return result?.settlementIntervalType ?? ""
}

//TODO: remove
export const findPromotionGroup = (promotionGroups = [], promotionType) => {
  return promotionGroups.reduce((result, group) => {
    if (result) {
      return result
    }

    let type = group?.types?.find((type) => type.name === promotionType)
    return type ? group : undefined
  }, undefined)
}

//TODO: remove
export const findPromotionGroupValue = (
  promotionGroups = [],
  promotionType
) => {
  let group = findPromotionGroup(promotionGroups, promotionType)
  return group?.name ?? ""
}

export const PromotionTypeGroupSelect = ({ placeholder, ...props }) => {
  let locale = useLocale()
  let defaultPlaceholder = usePromotionTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let { isLoading, data: groups, error } = usePromotionTypeList()
  if (isLoading) {
    return <Spinner />
  }

  let options = groups?.map(({ name, trans }) => {
    return {
      label: trans?.[locale] ?? name,
      value: name
    }
  })
  return <Select placeholder={placeholder} options={options} {...props} />
}

//TODO: useFindPromotionType
export const PromotionTypeLabel = ({ value }) => {
  let locale = useLocale()
  let { isLoading, data: groups, error } = usePromotionTypeList()
  if (isLoading) {
    return ""
  }

  let type = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    return group?.types?.find((type) => type.name === value)
  }, undefined)

  return type?.trans?.[locale] ?? value
}

export const PromotionTypeSelect = ({ placeholder, group, ...props }) => {
  let defaultPlaceholder = usePromotionSubtypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: groups, error } = usePromotionTypeList()
  let options = groups
    ?.filter(({ name }) => {
      if (group) {
        return group === name
      }
      return true
    })
    .reduce((list, { types = [], ...group }) => {
      let options = types.map(({ name, trans }) => {
        return {
          label: trans?.[locale] ?? name,
          value: name
        }
      })

      return [...list, ...options]
    }, [])

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export const PromotionTypeSelectGroup = ({
  name = "",
  promotionTypeProps = {},
  ...props
}) => {
  let formContext = useFormContext()
  let promotionTypeGroupName = promotionTypeProps?.name ?? "promotionTypeGroup"

  let promotionTypeGroup =
    promotionTypeGroupName && formContext?.watch(promotionTypeGroupName)

  return (
    <Group>
      <PromotionTypeGroupSelect
        name={promotionTypeGroupName}
        onChange={(event) => {
          formContext?.setValue?.(name, "")
        }}
        {...promotionTypeProps}
      />
      <PromotionTypeSelect name={name} group={promotionTypeGroup} {...props} />
    </Group>
  )
}

//TODO: use faFilter icon + checkbox menu/popup?
//TODO: default filter fn by promotion group
// export const PromotionTypeSelectExt = ({ name, filter, ...props }) => {}
