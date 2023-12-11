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
