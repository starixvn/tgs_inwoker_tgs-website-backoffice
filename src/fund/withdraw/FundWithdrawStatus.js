import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { MultiSelect } from "../../select/MultiSelect"
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

export const UnprocessedStatus = [Review, Approved]

export const isFundUnderReview = (value) => value === Review || Approved

export const isFundApproved = (value) => value === Approved

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
    }
  ]

  options.push({
    label: useTrans(PaidTrans),
    value: Paid
  })

  options.push({
    label: useTrans(RejectedTrans),
    value: Rejected
  })

  return (
    <MultiSelect
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
  UnprocessedStatus
}
