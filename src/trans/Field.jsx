import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const NetProfit = {
  zh: "淨盈利",
  en: "Net Profit",
  vi: "Lợi nhuận ròng"
}
export const useNetProfitTrans = () => useTrans(NetProfit)
export const NetProfitTrans = (props) => <Trans {...NetProfit} {...props} />

const SettleAmount = {
  zh: "结算金额",
  en: "Settle Amount",
  vi: "Thanh toán"
}
export const SettleAmountTrans = () => <Trans {...SettleAmount} />

export const TransactionAmount = {
  zh: "交易金额",
  en: "Amount",
  vi: "Số tiền giao dịch"
}
export const TransactionAmountTrans = () => <Trans {...TransactionAmount} />

const TransactionId = {
  zh: "交易单号",
  en: "Transaction ID",
  vi: "Mã giao dịch"
}
export const TransactionIdTrans = () => <Trans {...TransactionId} />

const Sequence = {
  zh: "序",
  en: "Sequence",
  vi: "Số thứ tự"
}
export const SequenceTrans = () => <Trans {...Sequence} />

const Order = {
  zh: "序",
  en: "Order",
  vi: "Thứ tự/Trình tự"
}
export const OrderTrans = () => <Trans {...Order} />

const Subject = {
  zh: "主题",
  en: "Subject",
  vi: "Chủ đề"
}
export const SubjectTrans = () => <Trans {...Subject} />

const TotalDepositAmount = {
  zh: "总存款",
  en: "Total Deposit Amount",
  vi: "Tổng nạp"
}
export const TotalDepositAmountTrans = () => <Trans {...TotalDepositAmount} />
export const useTotalDepositAmountTrans = () => useTrans(TotalDepositAmount)

const TotalWithdrawAmount = {
  zh: "总提款",
  en: "Total Withdraw Amount",
  vi: "Tổng rút"
}
export const TotalWithdrawAmountTrans = () => <Trans {...TotalWithdrawAmount} />
export const useTotalWithdrawAmountTrans = () => useTrans(TotalWithdrawAmount)

const Attachment = {
  zh: "附件",
  en: "Attachment",
  vi: "File đính kèm"
}
export const AttachmentTrans = () => <Trans {...Attachment} />

const Unlimited = {
  zh: "无限",
  en: "Unlimited",
  vi: "Không giới hạn"
}
export const UnlimitedTrans = () => <Trans {...Unlimited} />
export const useUnlimitedTrans = () => useTrans(Unlimited)

const Multipliers = {
  zh: "倍",
  en: "Multipliers",
  vi: "Lần/Bội số"
}
export const MultipliersTrans = () => <Trans {...Multipliers} />

//en use "Supporting Device" instead of "Platform"?
const SupportingDevice = {
  zh: "支持设备",
  en: "Platform",
  vi: "Thiết bị hỗ trợ"
}
export const SupportingDeviceTrans = () => <Trans {...SupportingDevice} />
export const useSupportingDeviceTrans = () => useTrans(SupportingDevice)

const BasicInformation = {
  zh: "基本资料",
  en: "Basic Information",
  vi: "Dữ liệu cơ bản"
}
export const BasicInformationTrans = () => <Trans {...BasicInformation} />

const Vendor = {
  zh: "厂商",
  en: "Vendor",
  vi: "Nhà sản xuất"
}
export const VendorTrans = () => <Trans {...Vendor} />

const PeriodicMaintenance = {
  zh: "定期维护",
  en: "Periodic Maintenance",
  vi: "Thời gian bảo trì định kỳ"
}
export const PeriodicMaintenanceTrans = () => <Trans {...PeriodicMaintenance} />

const SupportHtml5 = {
  zh: "支持HTML5",
  en: "HTML5",
  vi: "Hỗ trợ HTML5"
}
export const SupportHtml5Trans = () => <Trans {...SupportHtml5} />

const Yes = {
  zh: "是",
  en: "Yes"
}
export const YesTrans = () => <Trans {...Yes} />

const No = {
  zh: "不",
  en: "No"
}
export const NoTrans = () => <Trans {...No} />

const RecommendedSize1200X486 = {
  zh: "建議尺寸:  1200 x 486px",
  en: "Recommended size: 1200 x 486px",
  vi: "Kích thước đề xuất: 1200 x 486px"
}
export const RecommendedSize1200X486Trans = () => (
  <Trans {...RecommendedSize1200X486} />
)

const RecommendedSize690X280 = {
  zh: "建議尺寸: 690 x 280px",
  en: "Recommended size: 690 x 280px",
  vi: "Kích thước đề xuất: 690 x 280px"
}
export const RecommendedSize690X280Trans = () => (
  <Trans {...RecommendedSize690X280} />
)

const RecommendedSize750X310 = {
  zh: "建議尺寸: 750 x 310px",
  en: "Recommended size: 750 x 310px",
  vi: "Kích thước đề xuất: 750 x 310px"
}
export const RecommendedSize750X310Trans = () => (
  <Trans {...RecommendedSize750X310} />
)

const RecommendedSize1920X600 = {
  zh: "建議尺寸: 1920 x 600px",
  en: "Recommended size: 1920 x 600px",
  vi: "Kích thước đề xuất: 1920 x 600px"
}
export const RecommendedSize1920X600Trans = () => (
  <Trans {...RecommendedSize1920X600} />
)

export const Default = {
  zh: "預設",
  en: "Default"
}
export const DefaultTrans = () => <Trans {...Default} />
export const useDefaultTrans = () => useTrans(Default)

const CheckType = {
  zh: "查核類型",
  en: "Check Type",
  vi: "Dạng kiểm tra"
}
export const CheckTypeTrans = () => <Trans {...CheckType} />
export const useCheckTypeTrans = () => useTrans(CheckType)

const BonusAmount = {
  zh: "红利金额",
  en: "Bonus Amount",
  vi: "Tiền thưởng"
}
export const BonusAmountTrans = (props) => <Trans {...BonusAmount} {...props} />
export const useBonusAmountTrans = () => useTrans(BonusAmount)

const Total = {
  zh: "总计",
  en: "Total",
  vi: "Tổng"
}
export const TotalTrans = () => <Trans {...Total} />

const CSNote = {
  zh: "客服备註",
  en: "CS Note",
  vi: "CSKH ghi chú"
}
export const CSNoteTrans = () => <Trans {...CSNote} />
export const useCSNoteTrans = () => useTrans(CSNote)

const Distribution = {
  zh: "派发机制",
  en: "Distribution",
  vi: "cơ chế phân phối"
}
export const DistributionTrans = () => <Trans {...Distribution} />

const BalanceOfCurrentPeriod = {
  zh: "本期结馀",
  en: "Balance of current period",
  vi: "số dư hiện tại"
}
export const BalanceOfCurrentPeriodTrans = () => (
  <Trans {...BalanceOfCurrentPeriod} />
)

const CurrentCycle = {
  zh: "本期",
  en: "Current",
  vi: "Hiện tại"
}
export const CurrentCycleTrans = () => <Trans {...CurrentCycle} />
export const useCurrentCycleTrans = () => useTrans(CurrentCycle)

const NextCycle = {
  zh: "下期",
  en: "Next",
  vi: "Kỳ tiếp theo"
}
export const NextCycleTrans = () => <Trans {...NextCycle} />
export const useNextCycleTrans = () => useTrans(NextCycle)

const SocialMedia = {
  en: "Social Media",
  zh: "社群媒体"
}
export const SocialMediaTrans = () => <Trans {...SocialMedia} />
export const useSocialMediaTrans = () => useTrans(SocialMedia)

//TODO: rm?
const SocialMediaType = {
  en: "Type",
  zh: "社群媒体"
}
export const SocialMediaTypeTrans = () => <Trans {...SocialMediaType} />
export const useSocialMediaTypeTrans = () => useTrans(SocialMediaType)

const Name = {
  en: "Name",
  zh: "名称"
}
export const NameTrans = () => <Trans {...Name} />
