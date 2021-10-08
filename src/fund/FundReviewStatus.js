import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Trans, useTrans } from "../i18n"
import Select from "../select/Select"

const WaitingPayment = "WaitingPayment"
const WaitingPaymentTrans = {
  zh: "等待付款",
  en: "Waiting Payment"
}

const Review = "Review"
const ReviewTrans = {
  zh: "审核中",
  en: "Review"
}

const Approved = "Approved"
const ApprovedTrans = {
  zh: "已通过",
  en: "Approved"
}

const Rejected = "Rejected"
const RejectedTrans = {
  zh: "已拒绝",
  en: "Rejected"
}

export const isFundUnderReview = (value) => value === Review

export const isFundApproved = (value) => value === Approved

export const FundReviewStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case WaitingPayment:
      return <Trans {...WaitingPaymentTrans} {...props} />
    case Review:
      return <Trans {...ReviewTrans} {...props} />
    case Approved:
      return <Trans {...ApprovedTrans} {...props} />
    case Rejected:
      return <Trans {...RejectedTrans} {...props} />
    default:
      return value ?? ""
  }
}

export const FundReviewStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "状态",
    en: "Status"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(WaitingPaymentTrans),
      value: WaitingPayment
    },
    {
      label: useTrans(ReviewTrans),
      value: Review
    },
    {
      label: useTrans(ApprovedTrans),
      value: Approved
    },
    {
      label: useTrans(RejectedTrans),
      value: Rejected
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export default {
  WaitingPayment,
  Review,
  Approved,
  Rejected
}
