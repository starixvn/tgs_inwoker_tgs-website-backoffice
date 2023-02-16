import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { useFormContext } from "react-hook-form"

export const Field = {
  BrandId: "brandId"
}

export const useBrandIdFromPromotionForm = () => {
  let { getValues } = useFormContext()
  return getValues(Field.BrandId)
}
