import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { useFormContext, useWatch } from "react-hook-form"

export const Field = {
  BrandId: "brandId",
  Id: "id",
  PromotionType: "promotionType"
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
