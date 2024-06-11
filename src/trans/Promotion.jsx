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

const Promotions = {
  zh: "活动记录",
  en: "Promotions",
  vi: "Lịch sử hoạt động"
}
export const PromotionsTrans = () => <Trans {...Promotions} />

const PromotionAmount = {
  zh: "优惠金额",
  en: "Promotion Bonus",
  vi: "Số tiền khuyến mãi"
}
export const PromotionAmountTrans = () => <Trans {...PromotionAmount} />

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

const PromotionDistributionMethod = {
  zh: "活动派发",
  en: "Distribution Method",
  vi: "Phân phát hoạt động"
}
export const PromotionDistributionMethodTrans = () => (
  <Trans {...PromotionDistributionMethod} />
)

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

const PromotionTime = {
  zh: "活动时间",
  en: "Promotion Period",
  vi: "Thời gian hoạt động"
}
export const PromotionTimeTrans = () => <Trans {...PromotionTime} />

const PromotionUserGroup = {
  zh: "活动用户群",
  en: "User Group",
  vi: "Nhóm người dùng tham gia sự kiện/hoạt động"
}
export const PromotionUserGroupTrans = () => <Trans {...PromotionUserGroup} />
export const usePromotionUserGroupTrans = () => useTrans(PromotionUserGroup)

const PromotionFund = {
  zh: "活动费用",
  en: "Promotion Fund",
  vi: "Chi phí hoạt động"
}
export const PromotionFundTrans = () => <Trans {...PromotionFund} />

const ViewPromotion = {
  zh: "查看活动",
  en: "View Promotion",
  vi: "Tìm kiếm hoạt động"
}
export const ViewPromotionTrans = () => <Trans {...ViewPromotion} />
export const useViewPromotionTrans = () => useTrans(ViewPromotion)

const PromotionTotalFunds = {
  zh: "活动总费用",
  en: "Promotion Funds",
  vi: "Tổng phí dùng cho hoạt động"
}
export const PromotionTotalFundsTrans = () => <Trans {...PromotionTotalFunds} />

const PromotionContent = {
  zh: "活动内容",
  en: "Promotion Content",
  vi: "Nội dung hoạt động /sự kiện"
}
export const PromotionContentTrans = () => <Trans {...PromotionContent} />

const PromotionSubTitle = {
  zh: "活动子标题",
  en: "Promotion SubTitle",
  vi: "Tiêu đề phụ của sự kiện"
}
export const PromotionSubTitleTrans = () => <Trans {...PromotionSubTitle} />

const PromotionBannerDesktop = {
  zh: "活动 Banner (PC)",
  en: "Promotion Banner (PC)",
  vi: "Banner Sự kiện (PC)"
}
export const PromotionBannerDesktopTrans = () => (
  <Trans {...PromotionBannerDesktop} />
)

const PromotionBannerMobile = {
  zh: "活动 Banner (Mobile)",
  en: "Promotion Banner (Mobile)",
  vi: "Banner Sự kiện (Di động)"
}
export const PromotionBannerMobileTrans = () => (
  <Trans {...PromotionBannerMobile} />
)

const PromotionRules = {
  zh: "活动条款与条规",
  en: "Promotion Rules",
  vi: "Điều khoản hoạt động và quy tắc"
}
export const PromotionRulesTrans = () => <Trans {...PromotionRules} />

const PromotionRuleSettings = {
  zh: "規則設定",
  en: "Rule Settings",
  vi: "Thiết lập quy tắc"
}
export const PromotionRuleSettingsTrans = () => (
  <Trans {...PromotionRuleSettings} />
)

const PromotionBonusPercentage = {
  zh: "彩金百分比",
  en: "Bonus Percentage",
  vi: "Tỷ lệ phần thưởng tiền thưởng/Phần trăm tiên thưởng"
}
export const PromotionBonusPercentageTrans = () => (
  <Trans {...PromotionBonusPercentage} />
)

const PromotionBonusLimit = {
  zh: "彩金上限",
  en: "Bonus Limit",
  vi: "Giới hạn tiền thưởng/Hạn mức tiền thưởng"
}
export const PromotionBonusLimitTrans = () => <Trans {...PromotionBonusLimit} />

const PromotionTurnoverRequirement = {
  zh: "流水倍数",
  en: "Turnover Requirement",
  vi: "Hệ số doanh số /Bội số doanh thu"
}
export const PromotionTurnoverRequirementTrans = () => (
  <Trans {...PromotionTurnoverRequirement} />
)

const PromotionBonusAmountLimitHint = {
  zh: "彩金上限/彩金百分比",
  en: "Bonus Limit/Bonus Percentage",
  vi: "Giới hạn tiền thưởng/Tỷ lệ phần thưởng tiền thưởng"
}
export const usePromotionBonusAmountLimitHintTrans = () =>
  useTrans(PromotionBonusAmountLimitHint)

export const WinningList = {
  zh: "中奖列表",
  en: "Winning List",
  vi: "Bảng biểu trúng thưởng"
}
export const WinningListTrans = () => <Trans {...WinningList} />

const WinningOrderId = {
  zh: "中奖 ID",
  en: "Order ID",
  vi: "ID trúng thưởng"
}
export const WinningOrderIdTrans = () => <Trans {...WinningOrderId} />

const WinningContent = {
  zh: "中奖内容",
  en: "Winnings",
  vi: "Nội dung trúng thưởng"
}
export const WinningContentTrans = () => <Trans {...WinningContent} />
export const useWinningContentTrans = () => useTrans(WinningContent)

const PromotionBucketTypeNotSpecify = {
  zh: "不指定",
  en: "Default"
}
export const PromotionBucketTypeNotSpecifyTrans = () => (
  <Trans {...PromotionBucketTypeNotSpecify} />
)
export const usePromotionBucketTypeNotSpecifyTrans = () =>
  useTrans(PromotionBucketTypeNotSpecify)

const PromotionBonusAmount = {
  zh: "彩金金额",
  en: "Bonus Amount"
}
export const PromotionBonusAmountTrans = () => (
  <Trans {...PromotionBonusAmount} />
)

const PromotionPlayerMaxApplyTimesPerDay = {
  zh: "玩家每日可申请次数",
  en: "Max. number of times to apply per day",
  vi: "Số lần áp dụng tối đa mỗi ngày"
}
export const PromotionPlayerMaxApplyTimesPerDayTrans = () => (
  <Trans {...PromotionPlayerMaxApplyTimesPerDay} />
)

const PromotionPlayerMaxApplyTimesPerWeek = {
  zh: "玩家每周可申请次数",
  en: "Max. number of times to apply per week",
  vi: "Số lần nộp hồ sơ tối đa mỗi tuần"
}
export const PromotionPlayerMaxApplyTimesPerWeekTrans = () => (
  <Trans {...PromotionPlayerMaxApplyTimesPerWeek} />
)

const PromotionPlayerMaxApplyTimesPerMonth = {
  zh: "玩家每月可申请次数",
  en: "Max. number of times to apply per month",
  vi: "Số lần nộp đơn tối đa mỗi tháng"
}
export const PromotionPlayerMaxApplyTimesPerMonthTrans = () => (
  <Trans {...PromotionPlayerMaxApplyTimesPerMonth} />
)

const PromotionPlayerMaxApplyTimes = {
  zh: "玩家本活动可申请次数",
  en: "Max. number of times to apply this promo",
  vi: "Số lần tối đa được áp dụng khuyến mãi này"
}
export const PromotionPlayerMaxApplyTimesTrans = () => (
  <Trans {...PromotionPlayerMaxApplyTimes} />
)

const PromotionEligibility = {
  zh: "参加条件",
  en: "Eligibility",
  vi: "đủ điều kiện"
}
export const PromotionEligibilityTrans = () => (
  <Trans {...PromotionEligibility} />
)
