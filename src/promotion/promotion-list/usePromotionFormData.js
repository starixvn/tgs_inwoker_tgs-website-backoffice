import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { useFormContext, useWatch } from "react-hook-form"
import { isPromotionStatusEnabled } from "./PromotionStatus"
import { isValidDate } from "../../date/isValidDate"
import { parseISO, isAfter, isBefore } from "date-fns"

export const Field = {
  BrandId: "brandId",
  Id: "id",
  PromotionType: "promotionType",
  Status: "status",
  From: "from",
  To: "to",
  IsPromotionStarted: "isPromotionStarted"
}

export const useBrandIdFromPromotionForm = () => {
  let { getValues } = useFormContext()
  return getValues(Field.BrandId)
}

export const useHasPromotionId = () => {
  let { control } = useFormContext()

  let id = useWatch({
    control,
    name: Field.Id
  })
  return !!id
}

export const useIsAddPromotion = () => {
  let hasId = useHasPromotionId()
  return !hasId
}

export const useIsPromotionAdded = useHasPromotionId

export const usePromotionType = () => {
  let { control } = useFormContext()

  let promotionType = useWatch({
    control,
    name: Field.PromotionType
  })
  return promotionType
}

export const usePromotionStartDate = () => {
  let { control } = useFormContext()
  let start = useWatch({
    control,
    name: Field.From
  })
  return start
}

export const useIsPromotionStarted = () => {
  let { control, getValues } = useFormContext()
  return getValues(Field.IsPromotionStarted)
}

//TODO: use IsPromotionStarted & isPromotionEnded instead
export const useIsActivePromotion = () => {
  let { control } = useFormContext()
  let status = useWatch({
    control,
    name: Field.Status
  })

  let start = usePromotionStartDate()

  let end = useWatch({
    control,
    name: Field.To
  })

  if (!isPromotionStatusEnabled(status)) {
    return false
  }

  if (!isValidDate(start) || !isValidDate(end)) {
    return false
  }

  let now = new Date()
  let isAfterStart = isAfter(now, start)
  let isBeforeEnd = isAfter(end, now)

  return isAfterStart && isBeforeEnd
}
