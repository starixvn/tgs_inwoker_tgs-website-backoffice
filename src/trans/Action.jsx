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

const ActionType = {
  zh: "操作项",
  en: "Type",
  vi: "Mục thao tác"
}
export const ActionTypeTrans = () => <Trans {...ActionType} />

const Search = {
  zh: "搜索",
  en: "Search",
  vi: "Tìm kiếm"
}
export const SearchTrans = () => <Trans {...Search} />

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
export const ViewTrans = () => <Trans {...View} />
export const useViewTrans = () => useTrans(View)

const Edit = {
  zh: "修改",
  en: "Edit",
  vi: "Biên tập"
}
export const EditTrans = () => <Trans {...Edit} />
export const useEditTrans = () => useTrans(Edit)

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

const AgentAdjust = {
  zh: "代理调账",
  en: "Agent Adjust",
  vi: "Đại lý điều chỉnh"
}
export const useAgentAdjustTrans = () => useTrans(AgentAdjust)
export const AgentAdjustTrans = () => <Trans {...AgentAdjust} />

export const SystemAdjust = {
  zh: "系統调账",
  en: "System Adjust",
  vi: "Hệ thống điều chỉnh"
}
export const useSystemAdjustTrans = () => useTrans(SystemAdjust)
export const SystemAdjustTrans = () => <Trans {...SystemAdjust} />

const Operator = {
  zh: "操作者",
  en: "Operator",
  vi: "Người thao thác"
}
export const OperatorTrans = () => <Trans {...Operator} />

const Detail = {
  zh: "详情",
  en: "Detail",
  vi: "Chi tiết"
}
export const DetailTrans = () => <Trans {...Detail} />
export const useDetailTrans = () => useTrans(Detail)

const Import = {
  zh: "汇入",
  en: "Import",
  vi: "Chuyển vào"
}
export const ImportTrans = () => <Trans {...Import} />

const DownloadFormatFile = {
  zh: "下载文件格式",
  en: "Download Format File",
  vi: "Định dạng tệp tin tải về"
}
export const DownloadFormatFileTrans = () => <Trans {...DownloadFormatFile} />

const UploadFile = {
  zh: "上传文件",
  en: "Upload file",
  vi: "Tải lên tệp"
}
export const UploadFileTrans = () => <Trans {...UploadFile} />

const Cancel = {
  zh: "取消",
  en: "Cancel",
  vi: "Hủy bỏ"
}
export const CancelTrans = () => <Trans {...Cancel} />
export const useCancelTrans = () => useTrans(Cancel)

const Submit = {
  zh: "提交",
  en: "Submit",
  vi: "Gửi/Đệ trình"
}
export const SubmitTrans = () => <Trans {...Submit} />

const Confirm = {
  zh: "确定",
  en: "Submit",
  vi: "xác định"
}
export const ConfirmTrans = () => <Trans {...Confirm} />
export const useConfirmTrans = () => useTrans(Confirm)

const PreviousPage = {
  zh: "前一页",
  en: "Previous page",
  vi: "Trang trước"
}
export const PreviousPageTrans = () => <Trans {...PreviousPage} />
export const usePreviousPageTrans = () => useTrans(PreviousPage)

const NextPage = {
  zh: "下一页",
  en: "Next page",
  vi: "Trang sau"
}
export const NextPageTrans = () => <Trans {...NextPage} />
export const useNextPageTrans = () => useTrans(NextPage)

const ConfirmOrder = {
  zh: "确认排序",
  en: "Confirm Order",
  vi: "Xác nhận sắp xếp/Xác nhận thứ tự"
}
export const ConfirmOrderTrans = () => <Trans {...ConfirmOrder} />

const SpecialProcessing = {
  zh: "特殊处理",
  en: "Special Processing",
  vi: "Xử lí đặc biệt"
}
export const SpecialProcessingTrans = () => <Trans {...SpecialProcessing} />

export const Export = {
  zh: "汇出",
  en: "Export",
  vi: "Chuyển ra"
}
export const ExportTrans = () => <Trans {...Export} />

const Verify = {
  zh: "审核",
  en: "Verify",
  vi: "Xét duyệt"
}
export const VerifyTrans = () => <Trans {...Verify} />
export const useVerifyTrans = () => useTrans(Verify)

const Review = {
  zh: "审核",
  en: "Review",
  vi: "xem duyệt"
}
export const ReviewTrans = () => <Trans {...Review} />

const Add = {
  zh: "新增",
  en: "Add",
  vi: "Thêm vào"
}
export const AddTrans = (props) => <Trans {...Add} {...props} />
export const useAddTrans = () => useTrans(Add)

const Delete = {
  zh: "删除",
  en: "Delete",
  vi: "Xóa bỏ"
}
export const DeleteTrans = () => <Trans {...Delete} />
export const useDeleteTrans = () => useTrans(Delete)

const Approve = {
  zh: "通过",
  en: "Approve",
  vi: "thông qua"
}
export const ApproveTrans = () => <Trans {...Approve} />
export const useApproveTrans = () => useTrans(Approve)

export const Reject = {
  zh: "拒绝",
  en: "Reject",
  vi: "từ chối"
}
export const RejectTrans = () => <Trans {...Reject} />
export const useRejectTrans = () => useTrans(Reject)

const SelectAll = {
  zh: "全选",
  en: "All",
  vi: "Tất cả"
}
export const SelectAllTrans = () => <Trans {...SelectAll} />
