import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Status = {
  zh: "状态",
  en: "Status",
  vi: "Trạng thái"
}
export const useStatusTrans = () => useTrans(Status)
export const StatusTrans = () => <Trans {...Status} />

const InBlacklist = {
  zh: "黑名单",
  en: "In Blacklist",
  vi: "Danh sách đen"
}
export const useInBlacklistTrans = () => useTrans(InBlacklist)
export const InBlacklistTrans = () => <Trans {...InBlacklist} />

const Review = {
  zh: "审核中",
  en: "Review",
  vi: "Đang xét duyệt"
}
export const ReviewTrans = (props) => <Trans {...Review} {...props} />
export const useReviewTrans = () => useTrans(Review)

const Approved = {
  zh: "已通过",
  en: "Approved",
  vi: "Đã thông qua"
}
export const ApprovedTrans = (props) => <Trans {...Approved} {...props} />
export const useApprovedTrans = () => useTrans(Approved)

const Rejected = {
  zh: "已拒绝",
  en: "Rejected",
  vi: "Đã từ chối"
}
export const RejectedTrans = (props) => <Trans {...Rejected} {...props} />
export const useRejectedTrans = () => useTrans(Rejected)

const Invalid = {
  zh: "无效",
  en: "Invalid",
  vi: "Không hợp lệ"
}
export const InvalidTrans = (props) => <Trans {...Invalid} {...props} />
export const useInvalidTrans = () => useTrans(Invalid)


