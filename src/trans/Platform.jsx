import React, { createContext, useContext, useState } from "react"
import { Trans, useTrans } from "../i18n"

const Platform = {
  zh: "平台",
  en: "Platform",
  vi: "Nền tảng"
}
export const PlatformTrans = () => <Trans {...Platform} />
export const usePlatformTrans = () => useTrans(Platform)

const ThirdPartyId = {
  zh: "三方单号",
  en: "3rd Party Id",
  vi: "Mã đơn bên thứ ba"
}
export const ThirdPartyIdTrans = () => <Trans {...ThirdPartyId} />
export const useThirdPartyIdTrans = () => useTrans(ThirdPartyId)

const GmsId = {
  zh: "GMS订单号",
  en: "GMS Id",
  vi: "Mã đơn GMS"
}
export const GmsIdTrans = () => <Trans {...GmsId} />
export const useGmsIdTrans = () => useTrans(GmsId)

const SystemId = {
  zh: "系统订单编号",
  en: "System Id",
  vi: "Mã đơn hệ thống"
}
export const SystemIdTrans = () => <Trans {...SystemId} />
export const useSystemIdTrans = () => useTrans(SystemId)

export const BalanceChangeReport = {
  zh: "帳變報表",
  en: "Balance Change Report",
  vi: "Báo cáo biến động giao dịch"
}
export const BalanceChangeReportTrans = () => <Trans {...BalanceChangeReport} />

export const PlatformManagement = {
  zh: "平台管理",
  en: "Platform",
  vi: "Quản lý nền tảng"
}
export const PlatformManagementTrans = () => <Trans {...PlatformManagement} />

export const CheckIP = {
  zh: "檢核IP地址",
  en: "Check IP",
  vi: "Xét duyệt địa chỉ IP"
}
export const CheckIPTrans = () => <Trans {...CheckIP} />

const SearchDuplicateIP = {
  zh: "搜索重複IP地址",
  en: "Search Duplicate IP",
  vi: "Tìm kiếm địa chỉ IP trùng lặp"
}
export const SearchDuplicateIPTrans = () => <Trans {...SearchDuplicateIP} />

const SearchIPByAccountID = {
  zh: "按玩家帳號搜索IP",
  en: "Search IP By Account ID",
  vi: "Nhấn tài khoản người chơi tìm kiếm IP"
}
export const SearchIPByAccountIDTrans = () => <Trans {...SearchIPByAccountID} />

const SearchMemberByIP = {
  zh: "按IP 搜索玩家",
  en: "Search Member By IP",
  vi: "Nhấn IP tìm kiếm người chơi"
}
export const SearchMemberByIPTrans = () => <Trans {...SearchMemberByIP} />

export const StationLetter = {
  zh: "站内信",
  en: "Station Letter",
  vi: "Thư nội bộ"
}
export const StationLetterTrans = () => <Trans {...StationLetter} />

export const PlatformReport = {
  zh: "平台报表",
  en: "Platform Report",
  vi: "Báo biểu nền tảng"
}
export const PlatformReportTrans = () => <Trans {...PlatformReport} />

export const MarketReport = {
  zh: "市场报表",
  en: "Market Report",
  vi: "Báo biểu thị trường"
}
export const MarketReportTrans = () => <Trans {...MarketReport} />

const DepositAmountAfterDeductingTransferFee = {
  zh: "存款金额: 为已扣除手续费之金额。",
  en: "Deposit Amount: The amount after deducting the transfer fee.",
  vi: "Số tiền gửi: là số tiền sau khi đã trừ đi phí dịch vụ."
}
export const DepositAmountAfterDeductingTransferFeeTrans = () => (
  <Trans {...DepositAmountAfterDeductingTransferFee} />
)

const PlatformCoveredBonus = {
  zh: "平台承担红利",
  en: "Platform-Covered Bonus",
  vi: "Nền tảng chịu trách nhiệm cho khoản thưởng"
}
export const PlatformCoveredBonusTrans = () => (
  <Trans {...PlatformCoveredBonus} />
)

const PlatformCoveredBonusInfo = {
  zh: "平台承担红利 = 红利金额 * (100% - 总代分红比例)。",
  en: "Platform-Covered Bonus = Bonus Amount * (100% - Chief Agent Profit Sharing Percentage).",
  vi: "Nền tảng chịu trách nhiệm cho khoản thưởng = Số tiền thưởng * (100% - Tỷ lệ chia thưởng của đại lý chung)"
}
export const PlatformCoveredBonusInfoTrans = () => (
  <Trans {...PlatformCoveredBonusInfo} />
)

const PlatformCoveredBonusAdjust = {
  zh: "平台承担优惠调帐",
  en: "Platform-Covered Bonus Adjust",
  vi: "Nền tảng chịu trách nhiệm cho việc điều chỉnh ưu đãi"
}
export const PlatformCoveredBonusAdjustTrans = () => (
  <Trans {...PlatformCoveredBonusAdjust} />
)

const PlatformCoveredBonusAdjustInfo = {
  zh: "平台承担优惠调帐 = 优惠调帐 * (100% - 总代分红比例)。",
  en: "Platform-Covered Bonus Adjust = Bonus Adjust * (100% - Chief Agent Profit Sharing Percentage).",
  vi: "Nền tảng chịu trách nhiệm cho việc điều chỉnh ưu đãi = Số tiền điều chỉnh ưu đãi * (100% - Tỷ lệ chia thưởng của đại lý chung"
}
export const PlatformCoveredBonusAdjustInfoTrans = () => (
  <Trans {...PlatformCoveredBonusAdjustInfo} />
)

const PlatformMarketReportNetProfitInfo = {
  zh: "净盈利 = 公司输赢金额 - 平台承担红利 - 平台承担优惠调帐 - 公司调帐 - 代理总分红。",
  en: "Net Profit = CO. W/L - Platform-Covered Bonus - Platform-Covered Bonus Adjust - C.O Adjustment Amount - Agent Profit.",
  vi: "Lợi nhuận ròng = Số tiền thắng thua của công ty - Nền tảng chịu trách nhiệm cho khoản thưởng - Nền tảng chịu trách nhiệm cho việc điều chỉnh ưu đãi - Điều chỉnh tài khoản của công ty - Tổng lợi nhuận chia cho đại lý"
}
export const PlatformMarketReportNetProfitInfoTrans = () => (
  <Trans {...PlatformMarketReportNetProfitInfo} />
)

export const Banners = {
  zh: "Banner 管理",
  en: "Banners",
  vi: "Quản lý Banners"
}
export const BannersTrans = () => <Trans {...Banners} />

export const Announcements = {
  zh: "公告管理",
  en: "Announcements",
  vi: "Quản lý thông báo"
}
export const AnnouncementsTrans = () => <Trans {...Announcements} />

export const OperationSettings = {
  zh: "营运设置",
  en: "Operation Settings",
  vi: "Cài đặt hoạt động"
}
export const OperationSettingsTrans = () => <Trans {...OperationSettings} />

//TODO: vi with Banners?
const AnnouncementMainMarquee = {
  zh: "首页跑马灯",
  en: "Main Marquee",
  vi: "Banners chạy trên trang chủ"
}
export const AnnouncementMainMarqueeTrans = () => (
  <Trans {...AnnouncementMainMarquee} />
)
export const useAnnouncementMainMarqueeTrans = () =>
  useTrans(AnnouncementMainMarquee)

const AnnouncementMainPopup = {
  zh: "首页弹跳",
  en: "Main Popup",
  vi: "Cửa sổ mới"
}
export const AnnouncementMainPopupTrans = () => (
  <Trans {...AnnouncementMainPopup} />
)
export const useAnnouncementMainPopupTrans = () =>
  useTrans(AnnouncementMainPopup)

const AnnouncementDepositPopup = {
  zh: "存款弹跳",
  en: "Deposit Popup",
  vi: "Cửa sổ nạp"
}
export const AnnouncementDepositPopupTrans = () => (
  <Trans {...AnnouncementDepositPopup} />
)
export const useAnnouncementDepositPopupTrans = () =>
  useTrans(AnnouncementDepositPopup)

const InstantMessaging = {
  zh: "一般通訊軟體",
  en: "Instant Messaging"
}
export const InstantMessagingTrans = () => <Trans {...InstantMessaging} />
export const useInstantMessagingTrans = () => useTrans(InstantMessaging)

const ThirdPartyLiveChatProvider = {
  zh: "三方即時客服廠商",
  en: "3rd Party Live Chat Provider",
  vi: "dịch vụ CSKH bên thứ 3"
}
export const ThirdPartyLiveChatProviderTrans = () => (
  <Trans {...ThirdPartyLiveChatProvider} />
)
export const useThirdPartyLiveChatProviderTrans = () =>
  useTrans(ThirdPartyLiveChatProvider)

export const WinlossReport = {
  zh: "输赢报表",
  en: "Winloss Report"
}
export const WinlossReportTrans = () => <Trans {...WinlossReport} />

export const LicenseeReport = {
  zh: "公司报表",
  en: "Licensee Report",
  vi: "Báo cáo công ty"
}
export const LicenseeReportTrans = () => <Trans {...LicenseeReport} />

const CompanyAdjust = {
  zh: "公司调账",
  en: "Company Adjust",
  vi: "Công ty điều chỉnh"
}
export const useCompanyAdjustTrans = () => useTrans(CompanyAdjust)
export const CompanyAdjustTrans = () => <Trans {...CompanyAdjust} />

const CompanyAdjustmentAmount = {
  zh: "公司调账",
  en: "Co. Adjustment Amount",
  vi: "Công ty điều chỉnh"
}
export const CompanyAdjustmentAmountTrans = () => (
  <Trans {...CompanyAdjustmentAmount} />
)

const CompanyWinLoss = {
  zh: "公司输赢金额",
  en: "Co. W/L",
  vi: "Lợi nhuận công ty thắng thua"
}
export const CompanyWinLossTrans = () => <Trans {...CompanyWinLoss} />

export const MarketingManagement = {
  zh: "市场管理",
  en: "Marketing Management",
  vi: "Quản lý thị trường"
}
export const MarketingManagementTrans = () => <Trans {...MarketingManagement} />

export const SystemConfig = {
  zh: "系统设置",
  en: "System Config",
  vi: "Cài đặt hệ thống"
}
export const SystemConfigTrans = () => <Trans {...SystemConfig} />

export const Admins = {
  zh: "管理员列表",
  en: "Admins",
  vi: "Danh sách quản trị viên"
}
export const AdminsTrans = () => <Trans {...Admins} />

export const Roles = {
  zh: "权限组管理",
  en: "Roles",
  vi: "Quản lý toàn quyền"
}
export const RolesTrans = () => <Trans {...Roles} />

export const Departments = {
  zh: "部门管理",
  en: "Departments"
}
export const DepartmentsTrans = () => <Trans {...Departments} />

export const Overview = {
  zh: "总览",
  en: "Overview",
  vi: "Tổng quan"
}
export const OverviewTrans = () => <Trans {...Overview} />

export const PlatformOverview = {
  zh: "平台总览",
  en: "Overview",
  vi: "Tổng quan nền tảng"
}
export const PlatformOverviewTrans = () => <Trans {...PlatformOverview} />

const OperationOverview = {
  zh: "运营概况",
  en: "Overview",
  vi: "Giới hạn mỗi đơn"
}
export const OperationOverviewTrans = () => <Trans {...OperationOverview} />

const Department = {
  zh: "部门",
  en: "Department",
  vi: "Bộ phận "
}
export const DepartmentTrans = () => <Trans {...Department} />
export const useDepartmentTrans = () => useTrans(Department)

const DepartmentName = {
  zh: "部门名称",
  en: "Department Name",
  vi: "Tên bộ phận"
}
export const DepartmentNameTrans = () => <Trans {...DepartmentName} />
export const useDepartmentNameTrans = () => useTrans(DepartmentName)

const Licensee = {
  zh: "公司",
  en: "Licensee",
  vi: "Công ty"
}
export const LicenseeTrans = () => <Trans {...Licensee} />
export const useLicenseeTrans = () => useTrans(Licensee)

const Company = {
  zh: "公司",
  en: "Company",
  vi: "Công ty"
}
export const CompanyTrans = () => <Trans {...Company} />

const NetDeposits = {
  zh: "存提差",
  en: "Net Deposits",
  vi: "Chênh lệch gửi và rút tiền"
}
export const NetDepositsTrans = () => <Trans {...NetDeposits} />

const DepositWithdrawDiff = {
  zh: "存提差",
  en: "Deposit Withdraw Diff.",
  vi: "Chênh lệch gửi và rút tiền"
}
export const DepositWithdrawDiffTrans = () => <Trans {...DepositWithdrawDiff} />
