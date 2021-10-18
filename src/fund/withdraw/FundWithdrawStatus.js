import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
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

//TODO: rm DeprecatedApprovedTrans for v1.8
const DeprecatedApprovedTrans = {
  zh: "已通过",
  en: "Approved"
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

export const isFundUnderReview = (value) => value === Review

export const isFundApproved = (value) => value === Approved

export const FundWithdrawStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case Review:
      return <Trans {...ReviewTrans} {...props} />
    case Approved:
      if (isDev()) {
        return <Trans {...ApprovedTrans} {...props} />
      }

      //TODO: rm DeprecatedApprovedTrans for v1.8
      return <Trans {...DeprecatedApprovedTrans} {...props} />
    case Paid:
      return <Trans {...PaidTrans} {...props} />
    case Rejected:
      return <Trans {...RejectedTrans} {...props} />
    default:
      return value ?? ""
  }
}

export const FundWithdrawStatusSelect = ({ placeholder, ...props }) => {
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
      label: useTrans(isDev() ? ApprovedTrans : DeprecatedApprovedTrans), //TODO: rm DeprecatedApprovedTrans for v1.8
      value: Approved
    }
  ]

  if (isDev()) {
    options.push({
      label: useTrans(PaidTrans),
      value: Paid
    })
  }

  options.push({
    label: useTrans(RejectedTrans),
    value: Rejected
  })

  return <Select placeholder={placeholder} options={options} {...props} />
}

export default {
  Review,
  Approved,
  Paid,
  Rejected
}
