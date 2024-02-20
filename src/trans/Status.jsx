import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Status = {
  zh: "状态",
  en: "Status",
  vi: "Trạng thái"
}
export const StatusTrans = () => <Trans {...Status} />
export const useStatusTrans = () => useTrans(Status)

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

const Distributed = {
  zh: "已派发",
  en: "Distributed",
  vi: "đã phân phát"
}
export const DistributedTrans = () => <Trans {...Distributed} />
export const useDistributedTrans = () => useTrans(Distributed)

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

const Published = {
  zh: "已发布",
  en: "Published",
  vi: "Được phát hành"
}
export const PublishedTrans = () => <Trans {...Published} />

const NoSearchResult = {
  zh: "查无资料",
  en: "No Search Result",
  vi: "Không tìm thấy dữ liệu/Không có thông tin"
}
export const NoSearchResultTrans = () => <Trans {...NoSearchResult} />

const Automatic = {
  zh: "自动",
  en: "Auto",
  vi: "Thủ công"
}
export const AutoTrans = () => <Trans {...Automatic} />
export const useAutoTrans = () => useTrans(Automatic)

const Manual = {
  zh: "手动",
  en: "Manual",
  vi: "Tự động"
}
export const ManualTrans = () => <Trans {...Manual} />
export const useManualTrans = () => useTrans(Manual)

const Enabled = {
  zh: "开启",
  en: "Enabled",
  vi: "Mở / Bật"
}
export const EnabledTrans = (props) => <Trans {...Enabled} {...props} />
export const useEnabledTrans = () => useTrans(Enabled)

const Disabled = {
  zh: "关闭",
  en: "Disabled",
  vi: "Đóng / Tắt"
}
export const DisabledTrans = (props) => <Trans {...Disabled} {...props} />
export const useDisabledTrans = () => useTrans(Disabled)

//TODO: only Disabled or Inactive?
const Inactive = {
  zh: "关闭",
  en: "Inactive",
  vi: "Đóng / Tắt"
}
export const InactiveTrans = () => <Trans {...Inactive} />

const Effective = {
  zh: "有效",
  en: "Effective",
  vi: "Có hiệu lực"
}
export const EffectiveTrans = () => <Trans {...Effective} />

const Expired = {
  zh: "过期",
  en: "Expired",
  vi: "Quá hạn"
}
export const ExpiredTrans = () => <Trans {...Expired} />

const ConfigStatus = {
  zh: "配置状态",
  en: "Config Status",
  vi: "Trạng  thái thiết bị"
}
export const ConfigStatusTrans = () => <Trans {...ConfigStatus} />
export const useConfigStatusTrans = () => useTrans(ConfigStatus)

const Liable = {
  zh: "承担",
  en: "Liable",
  vi: "đảm nhận"
}
export const LiableTrans = () => <Trans {...Liable} />
export const useLiableTrans = () => useTrans(Liable)

const NotLiable = {
  zh: "不承担",
  en: "Not liable",
  vi: "không đảm nhận"
}
export const NotLiableTrans = () => <Trans {...NotLiable} />
export const useNotLiableTrans = () => useTrans(NotLiable)
