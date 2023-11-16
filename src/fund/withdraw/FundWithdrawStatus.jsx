import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { MultiSelectBox } from "../../select/MultiSelectBox"
import { isDev } from "../../env"

const Review = "Review"
const ReviewTrans = {
  zh: "审核中",
  en: "Review"
}

const Approved = "Approved"
const ApprovedTrans = {
  zh: "待支付",
  en: "Waiting Payment"
}

const Paid = "Paid"
const PaidTrans = {
  zh: "已支付",
  en: "Paid"
}

const Rejected = "Rejected"
const RejectedTrans = {
  zh: "已拒绝",
  en: "Rejected"
}

const Invalid = "Invalid"
const InvalidTrans = {
  zh: "无效",
  en: "Invalid"
}

export const UnprocessedStatus = [Review, Approved]

export const isFundUnderReview = (value) => value === Review

export const isFundApproved = (value) => value === Approved

export const isFundPaid = (value) => value === Paid

export const isFundInvalid = (value) => value === Invalid

export const FundWithdrawStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case Review:
      return <Trans {...ReviewTrans} {...props} />
    case Approved:
      return <Trans {...ApprovedTrans} {...props} />
    case Paid:
      return <Trans {...PaidTrans} {...props} />
    case Rejected:
      return <Trans {...RejectedTrans} {...props} />
    case Invalid:
      return <Trans {...InvalidTrans} {...props} />
    default:
      return value ?? ""
  }
}

export const FundWithdrawStatusSelect = ({
  placeholder,
  isMulti = true,
  ...props
}) => {
  let defaultPlaceholder = useTrans({
    zh: "状态",
    en: "Status"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(ReviewTrans),
      value: Review
    },
    {
      label: useTrans(ApprovedTrans),
      value: Approved
    },
    {
      label: useTrans(PaidTrans),
      value: Paid
    },
    {
      label: useTrans(RejectedTrans),
      value: Rejected
    },
    {
      label: useTrans(InvalidTrans),
      value: Invalid
    }
  ]

  return (
    <MultiSelectBox
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      {...props}
    />
  )
}

export default {
  Review,
  Approved,
  Paid,
  Rejected,
  Invalid,
  UnprocessedStatus
}
