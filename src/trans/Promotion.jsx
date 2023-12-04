import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const PromotionName = {
  zh: "活动名称",
  en: "Promotion Name",
  vi: "Tên sự kiện"
}
export const PromotionNameTrans = () => <Trans {...PromotionName} />
export const usePromotionNameTrans = () => useTrans(PromotionName)

const PromotionBonus = {
  zh: "优惠金额",
  en: "Promotion Bonus",
  vi: "Số tiền khuyến mãi"
}
export const PromotionBonusTrans = () => <Trans {...PromotionBonus} />
