import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const UserName = {
  zh: "用戶名",
  en: "User name",
  vi: "Tên tài khoản"
}
export const useUserNameTrans = () => useTrans(UserName)
export const UserNameTrans = () => <Trans {...UserName} />

const Birthday = {
  zh: "生日",
  en: "Birthday",
  vi: "Sinh nhật"
}
export const useBirthdayTrans = () => useTrans(Birthday)
export const BirthdayTrans = () => <Trans {...Birthday} />

const Phone = {
  zh: "手机号码",
  en: "Phone",
  vi: "Số điện thoại"
}
export const usePhoneTrans = () => useTrans(Phone)
export const PhoneTrans = () => <Trans {...Phone} />

const Email = {
  zh: "邮箱",
  en: "Email",
  vi: "Email"
}
export const EmailTrans = () => <Trans {...Email} />

const Telegram = {
  en: "Telegram"
}
export const TelegramTrans = () => <Trans {...Telegram} />

const RealName = {
  zh: "真实姓名",
  en: "Real Name",
  vi: "Tên thật"
}
export const useRealNameTrans = () => useTrans(RealName)
export const RealNameTrans = () => <Trans {...RealName} />

const ICNumber = {
  zh: "身分证",
  en: "IC Number",
  vi: "Thẻ căn cước"
}
export const useICNumberTrans = () => useTrans(ICNumber)
export const ICNumberTrans = () => <Trans {...ICNumber} />

const BankAccount = {
  zh: "银行卡号",
  en: "Bank Account",
  vi: "Số thẻ ngân hàng"
}
export const useBankAccountTrans = () => useTrans(BankAccount)
export const BankAccountTrans = () => <Trans {...BankAccount} />

const RegistrationTime = {
  zh: "注册时间",
  en: "Registration Time",
  vi: "Thời gian đăng ký"
}
export const useRegistrationTimeTrans = () => useTrans(RegistrationTime)
export const RegistrationTimeTrans = () => <Trans {...RegistrationTime} />

const Balance = {
  zh: "余额",
  en: "Balance",
  vi: "Số dư"
}
export const useBalanceTrans = () => useTrans(Balance)
export const BalanceTrans = () => <Trans {...Balance} />

const WalletBalance = {
  zh: "钱包余额",
  en: "Wallet Balance",
  vi: "Số dư ví"
}
export const useWalletBalanceTrans = () => useTrans(WalletBalance)
export const WalletBalanceTrans = () => <Trans {...WalletBalance} />

export const DepositForm = {
  zh: "存款单",
  en: "Deposit Form",
  vi: "Mã giao dịch nạp tiền"
}
export const useDepositFormTrans = () => useTrans(DepositForm)
export const DepositFormTrans = () => <Trans {...DepositForm} />

export const WithdrawForm = {
  zh: "提款单",
  en: "Withdrawal Form",
  vi: "Mã giao dịch  rút tiền"
}
export const useWithdrawFormTrans = () => useTrans(WithdrawForm)
export const WithdrawFormTrans = () => <Trans {...WithdrawForm} />

const ContactInfo = {
  zh: "联系信息",
  en: "Contact Info",
  vi: "Thông tin liên lạc"
}
export const useContactInfoTrans = () => useTrans(ContactInfo)
export const ContactInfoTrans = () => <Trans {...ContactInfo} />


const BankInfo = {
  
}