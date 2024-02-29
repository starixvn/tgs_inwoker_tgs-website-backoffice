import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const UserName = {
  zh: "用戶名",
  en: "Username",
  vi: "dùng tài khoản"
}
export const useUserNameTrans = () => useTrans(UserName)
export const UserNameTrans = () => <Trans {...UserName} />

const Name = {
  zh: "姓名",
  en: "Name",
  vi: "Tên"
}
export const NameTrans = () => <Trans {...Name} />

const UserType = {
  zh: "用户类型",
  en: "User Type",
  vi: "Loại người dùng"
}
export const UserTypeTrans = () => <Trans {...UserType} />
export const useUserTypeTrans = () => useTrans(UserType)

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
  en: "Email"
}
export const EmailTrans = () => <Trans {...Email} />

const Telegram = {
  en: "Telegram"
}
export const TelegramTrans = () => <Trans {...Telegram} />
export const useTelegramTrans = () => useTrans(Telegram)

const Zalo = {
  en: "Zalo"
}
export const ZaloTrans = () => <Trans {...Zalo} />
export const useZaloTrans = () => useTrans(Zalo)

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

const BalanceChangeRecords = {
  zh: "账变记录",
  en: "Balance Change Records",
  vi: "Lịch sử biến động giao dịch"
}
export const BalanceChangeRecordsTrans = () => (
  <Trans {...BalanceChangeRecords} />
)

const BalanceBefore = {
  zh: "余额 (前)",
  en: "Before",
  vi: "Số dư (trước)"
}
export const BalanceBeforeTrans = () => <Trans {...BalanceBefore} />

const BalanceAfter = {
  zh: "余额 (后)",
  en: "After",
  vi: "Số dư (sau)"
}
export const BalanceAfterTrans = () => <Trans {...BalanceAfter} />

const RegisterIP = {
  zh: "注册IP地址",
  en: "Register IP",
  vi: "Địa chỉ IP đăng ký"
}
export const RegisterIPTrans = () => <Trans {...RegisterIP} />
export const useRegisterIPTrans = () => useTrans(RegisterIP)

const LoginIP = {
  zh: "登錄IP地址",
  en: "Login IP",
  vi: "Địa chỉ IP đăng nhập"
}
export const LoginIPTrans = () => <Trans {...LoginIP} />
export const useLoginIPTrans = () => useTrans(LoginIP)

const LastLoginIP = {
  zh: "最近登录IP地址",
  en: "Last Login IP",
  vi: "Địa chỉ IP đăng nhập cuối cùng"
}
export const LastLoginIPTrans = () => <Trans {...LastLoginIP} />

const LastLoginTime = {
  zh: "最近登录时间",
  en: "Last Login Time",
  vi: "Thời gian đăng nhập cuối cùng "
}
export const LastLoginTimeTrans = () => <Trans {...LastLoginTime} />

const UserStatusEnabled = {
  zh: "活跃",
  en: "Enabled",
  vi: "Hoạt động"
}
export const UserStatusEnabledTrans = () => <Trans {...UserStatusEnabled} />
export const useUserStatusEnabledTrans = () => useTrans(UserStatusEnabled)

const UserStatusDisabled = {
  zh: "封锁",
  en: "Disabled",
  vi: "Bị khóa"
}
export const UserStatusDisabledTrans = () => <Trans {...UserStatusDisabled} />
export const useUserStatusDisabledTrans = () => useTrans(UserStatusDisabled)

const RegisteredCount = {
  zh: "注册人数",
  en: "Registered Count",
  vi: "Số người đăng ký "
}
export const RegisteredCountTrans = () => <Trans {...RegisteredCount} />

const NewPlayers = {
  zh: "注册人数",
  en: "New Players",
  vi: "Số người đăng ký "
}
export const NewPlayersTrans = () => <Trans {...NewPlayers} />

const ChangePassword = {
  zh: "修改密码",
  en: "Change Password",
  vi: "Đặt lại mật khẩu"
}
export const ChangePasswordTrans = () => <Trans {...ChangePassword} />
export const useChangePasswordTrans = () => useTrans(ChangePassword)

const DesignatedUsers = {
  zh: "特定用户",
  en: "Designated Users",
  vi: "Người dùng cụ thể"
}
export const DesignatedUsersTrans = () => <Trans {...DesignatedUsers} />
export const useDesignatedUsersTrans = () => useTrans(DesignatedUsers)
