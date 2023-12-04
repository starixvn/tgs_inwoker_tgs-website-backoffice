import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const PromotionName = {
  zh: "活动名称",
  en: "Promotion Name",
  vi: "Tên sự kiện"
}
export const PromotionNameTrans = () => <Trans {...PromotionName} />
export const usePromotionNameTrans = () => useTrans(PromotionName)

const PromotionType = {
  zh: "活动类型",
  en: "Promotion Type",
  vi: "Loại hoạt động"
}
export const PromotionTypeTrans = () => <Trans {...PromotionType} />
export const usePromotionTypeTrans = () => useTrans(PromotionType)

const PromotionSubtype = {
  zh: "活动子类型",
  en: "Promotion Subtype",
  vi: "Loại hoạt động nhỏ"
}
export const PromotionSubtypeTrans = () => <Trans {...PromotionSubtype} />
export const usePromotionSubtypeTrans = () => useTrans(PromotionSubtype)

const PromotionBonus = {
  zh: "优惠金额",
  en: "Promotion Bonus",
  vi: "Số tiền khuyến mãi"
}
export const PromotionBonusTrans = () => <Trans {...PromotionBonus} />

export const PromotionManagement = {
  zh: "活动管理",
  en: "Promotion Management",
  vi: "Quản lý sự kiện /Quản lý hoạt động"
}
export const PromotionManagementTrans = () => <Trans {...PromotionManagement} />

export const PromotionPayouts = {
  zh: "活动派发列表",
  en: "Promotion Payouts",
  vi: "Danh sách phân phát sự kiện"
}
export const PromotionPayoutsTrans = () => <Trans {...PromotionPayouts} />

const PromotionPayout = {
  zh: "领取金额",
  en: "Payout",
  vi: "Số tiền nhận"
}
export const PromotionPayoutTrans = () => <Trans {...PromotionPayout} />

const PromotionBatchPayout = {
  zh: "批量派发",
  en: "Batch Payout",
  vi: "Phân phát hàng loạt"
}
export const PromotionBatchPayoutTrans = () => (
  <Trans {...PromotionBatchPayout} />
)
