import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

export const DepositList = {
  zh: "存款列表",
  en: "Deposit List",
  vi: "Lịch sử nạp"
}
export const DepositListTrans = () => <Trans {...DepositList} />

//TODO: vi trans
export const WithdrawList = {
  zh: "提款列表",
  en: "Withdraw List"
}
export const WithdrawListTrans = () => <Trans {...WithdrawList} />

const ChannelName = {
  zh: "通道名称",
  en: "Channel Name",
  vi: "Tên kênh"
}
export const ChannelNameTrans = () => <Trans {...ChannelName} />
export const useChannelNameTrans = () => useTrans(ChannelName)

const PaymentProvider = {
  zh: "金流商",
  en: "Payment Provider",
  vi: "Tên kênh"
}
export const PaymentProviderTrans = () => <Trans {...PaymentProvider} />
export const usePaymentProviderTrans = () => useTrans(PaymentProvider)

//TODO: vi trans
const PaymentMethod = {
  zh: "支付方式",
  en: "Payment Method"
}
export const PaymentMethodTrans = () => <Trans {...PaymentMethod} />
export const usePaymentMethodTrans = () => useTrans(PaymentMethod)

const DepositPaymentMethod = {
  zh: "存款类型",
  en: "Payment Method",
  vi: "Loại tiền gửi"
}
export const DepositPaymentMethodTrans = () => (
  <Trans {...DepositPaymentMethod} />
)
export const useDepositPaymentMethodTrans = () => useTrans(DepositPaymentMethod)

const PaymentName = {
  zh: "通道名称",
  en: "Payment Name",
  vi: "Tên kênh"
}
export const PaymentNameTrans = () => <Trans {...PaymentName} />

const DepositAmount = {
  zh: "存款金额",
  en: "Deposit Amount",
  vi: "Số tiền gửi"
}
export const DepositAmountTrans = () => <Trans {...DepositAmount} />
export const useDepositAmountTrans = () => useTrans(DepositAmount)

const ActualDepositAmount = {
  zh: "实际存款金额",
  en: "Actual Amount",
  vi: "Số tiền gửi thực tế"
}
export const ActualDepositAmountTrans = () => <Trans {...ActualDepositAmount} />

const ActualWithdrawAmount = {
  zh: "实际提款金额",
  en: "Actual Amount",
  vi: "Số tiền rút thực tế"
}
export const ActualWithdrawAmountTrans = () => (
  <Trans {...ActualWithdrawAmount} />
)

const TransferFee = {
  zh: "手续费",
  en: "Transfer Fee",
  vi: "Phí xử lý"
}
export const TransferFeeTrans = () => <Trans {...TransferFee} />

const WaitingPayment = {
  zh: "待支付",
  en: "Waiting Payment",
  vi: "Đang chờ thanh toán"
}
export const WaitingPaymentTrans = (props) => (
  <Trans {...WaitingPayment} {...props} />
)
export const useWaitingPaymentTrans = () => useTrans(WaitingPayment)

const PaidTime = {
  zh: "已支付时间",
  en: "Paid Time",
  vi: "Thời gian thanh toán"
}
export const PaidTimeTrans = () => <Trans {...PaidTime} />

const WithdrawAmount = {
  zh: "提款金额",
  en: "Amount",
  vi: "Số tiền rút"
}
export const WithdrawAmountTrans = () => <Trans {...WithdrawAmount} />

const Currency = {
  zh: "币种",
  en: "Currency",
  vi: "Loại tiền"
}
export const CurrencyTrans = () => <Trans {...Currency} />

const BankInfo = {
  zh: "银行卡信息",
  en: "Bank",
  vi: "Thông tin thẻ ngân hàng"
}
export const BankInfoTrans = () => <Trans {...BankInfo} />

const BankCardField = {
  zh: "银行卡栏位",
  en: "Bank Card Field",
  vi: "Tìm  kiếm thẻ ngân hàng"
}
export const useBankCardFieldTrans = () => useTrans(BankCardField)

const BankAccount = {
  zh: "银行卡号",
  en: "Bank Account",
  vi: "Số thẻ ngân hàng"
}
export const useBankAccountTrans = () => useTrans(BankAccount)
export const BankAccountTrans = () => <Trans {...BankAccount} />

const WithdrawAndCanceled = {
  zh: "提款(包含已取消提款)",
  en: "Withdrawal/Canceled Withdrawal"
}
export const WithdrawAndCanceledTrans = () => <Trans {...WithdrawAndCanceled} />
export const useWithdrawAndCanceledTrans = () => useTrans(WithdrawAndCanceled)

const WithdrawCanceled = {
  zh: "取消提款",
  en: "Cancel Withdrawal"
}
export const WithdrawCanceledTrans = () => <Trans {...WithdrawCanceled} />
export const useWithdrawCanceledTrans = () => useTrans(WithdrawCanceled)

const WithdrawCompleted = {
  zh: "提款完成",
  en: "Complete Withdrawal"
}
export const WithdrawCompletedTrans = () => <Trans {...WithdrawCompleted} />

const TransferAndCanceled = {
  zh: "转帐(含转帐取消)",
  en: "Transfer (Includes Canceled Transfer)"
}
export const TransferAndCanceledTrans = () => <Trans {...TransferAndCanceled} />
export const useTransferAndCanceledTrans = () => useTrans(TransferAndCanceled)

const TransferCanceled = {
  zh: "转帐取消",
  en: "Transfer Canceled"
}
export const TransferCanceledTrans = () => <Trans {...TransferCanceled} />
export const useTransferCanceled = () => useTrans(TransferCanceled)

const ManualPayout = {
  zh: "手动派发",
  en: "Manual Payout"
}
export const ManualPayoutTrans = () => <Trans {...ManualPayout} />
export const useManualPayoutTrans = () => useTrans(ManualPayout)

const PayoutAmount = {
  zh: "派发金额",
  en: "Payout Amount"
}
export const PayoutAmountTrans = () => <Trans {...PayoutAmount} />

const BalanceChangeTypeTransfer = {
  zh: "轉出",
  en: "Transfer Out"
}
export const BalanceChangeTypeTransferTrans = () => (
  <Trans {...BalanceChangeTypeTransfer} />
)
export const useBalanceChangeTypeTransferTrans = () =>
  useTrans(BalanceChangeTypeTransfer)

const BalanceChangeTypeTransferRollback = {
  zh: "轉出失敗",
  en: "Transfer Out Failed"
}
export const BalanceChangeTypeTransferRollbackTrans = () => (
  <Trans {...BalanceChangeTypeTransferRollback} />
)
export const useBalanceChangeTypeTransferRollbackTrans = () =>
  useTrans(BalanceChangeTypeTransferRollback)

const BalanceChangeTypeReceiveCommit = {
  zh: "轉入",
  en: "Transfer In"
}
export const BalanceChangeTypeReceiveCommitTrans = () => (
  <Trans {...BalanceChangeTypeReceiveCommit} />
)
export const useBalanceChangeTypeReceiveCommitTrans = () =>
  useTrans(BalanceChangeTypeReceiveCommit)

const BalanceChangeTypeReceiveRollback = {
  zh: "轉入失敗",
  en: "Transfer In Failed"
}
export const BalanceChangeTypeReceiveRollbackTrans = () => (
  <Trans {...BalanceChangeTypeReceiveRollback} />
)
export const useBalanceChangeTypeReceiveRollbackTrans = () =>
  useTrans(BalanceChangeTypeReceiveRollback)
