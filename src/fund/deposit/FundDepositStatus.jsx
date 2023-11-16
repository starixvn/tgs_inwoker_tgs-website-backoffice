import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Select } from "../../select/Select"
import { MultiSelectBox } from "../../select/MultiSelectBox"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"
import { isDev } from "../../env"

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

const Invalid = "Invalid"
const InvalidTrans = {
  zh: "无效",
  en: "Invalid"
}

export const UnprocessedStatus = [Review, WaitingPayment]

export const isFundDepositUnderReview = (value) => value === Review

export const isFundDepositApproved = (value) => value === Approved

export const FundDepositStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case WaitingPayment:
      return <Trans {...WaitingPaymentTrans} {...props} />
    case Review:
      return <Trans {...ReviewTrans} {...props} />
    case Approved:
      return <Trans {...ApprovedTrans} {...props} />
    case Rejected:
      return <Trans {...RejectedTrans} {...props} />
    case Invalid:
      return <Trans {...InvalidTrans} {...props} />
    default:
      return value ?? ""
  }
}

export const FundDepositStatusSelect = ({
  name = "status",
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
    },
    {
      label: useTrans(InvalidTrans),
      value: Invalid
    }
  ]

  return (
    <MultiSelectBox
      name={name}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      {...props}
    />
  )
}

export default {
  WaitingPayment,
  Review,
  Approved,
  Rejected,
  UnprocessedStatus
}
