import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Action = {
  zh: "操作",
  en: "Actions",
  vi: "Thao tác"
}
export const useActionTrans = () => useTrans(Action)
export const ActionTrans = () => <Trans {...Action} />

const EditingRecords = {
  zh: "操作记录",
  en: "Editing Records",
  vi: "Lịch sử thao tác"
}
export const EditingRecordsTrans = () => <Trans {...EditingRecords} />

const ActionDateTime = {
  zh: "操作时间",
  en: "Date&Time",
  vi: "Lịch sử thao tác"
}
export const ActionDateTimeTrans = () => <Trans {...ActionDateTime} />

const ActionType = {
  zh: "操作项",
  en: "Type",
  vi: "Mục thao tác"
}
export const ActionTypeTrans = () => <Trans {...ActionType} />

const Remark = {
  zh: "备注",
  en: "Remark",
  vi: "Ghi chú"
}
export const useRemarkTrans = () => useTrans(Remark)
export const RemarkTrans = () => <Trans {...Remark} />

export const View = {
  zh: "查看",
  en: "View",
  vi: "Kiểm tra"
}
export const useViewTrans = () => useTrans(View)
export const ViewTrans = () => <Trans {...View} />

const Edit = {
  zh: "修改",
  en: "Edit",
  vi: "Đang chỉnh sửa"
}
export const useEditTrans = () => useTrans(Edit)
export const EditTrans = () => <Trans {...Edit} />

const TransactionType = {
  zh: "交易类型",
  en: "Transaction Type",
  vi: "Loại giao dịch"
}
export const useTransactionTypeTrans = () => useTrans(TransactionType)
export const TransactionTypeTrans = () => <Trans {...TransactionType} />

const AddBalance = {
  zh: "加钱",
  en: "Add Balance",
  vi: "Thêm tiền"
}
export const AddBalanceTrans = () => <Trans {...AddBalance} />

const DeductBalance = {
  zh: "扣钱",
  en: "Deduct Balance",
  vi: "Trừ tiền"
}
export const DeductBalanceTrans = () => <Trans {...DeductBalance} />

const CompanyAdjust = {
  zh: "公司调账",
  en: "Company Adjust",
  vi: "Công ty điều chỉnh"
}
export const useCompanyAdjustTrans = () => useTrans(CompanyAdjust)
export const CompanyAdjustTrans = () => <Trans {...CompanyAdjust} />

const AgentAdjust = {
  zh: "代理调账",
  en: "Agent Adjust",
  vi: "Đại lý điều chỉnh"
}
export const useAgentAdjustTrans = () => useTrans(AgentAdjustTrans)
export const AgentAdjustTrans = () => <Trans {...AgentAdjust} />

export const SystemAdjust = {
  zh: "系統调账",
  en: "System Adjust",
  vi: "Hệ thống điều chỉnh"
}
export const useSystemAdjustTrans = () => useTrans(SystemAdjust)
export const SystemAdjustTrans = () => <Trans {...SystemAdjust} />
