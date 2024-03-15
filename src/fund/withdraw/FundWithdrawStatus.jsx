import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { MultiSelectBox } from "../../select/MultiSelectBox"
import { isDev } from "../../env"
import {
  InvalidTrans,
  RejectedTrans,
  ReviewTrans,
  useInvalidTrans,
  useRejectedTrans,
  useReviewTrans,
  useStatusTrans
} from "../../trans/Status"
import {
  WaitingPaymentTrans,
  useWaitingPaymentTrans
} from "../../trans/Payment"
import { LabelColorBox } from "../../box/LabelColorBox"
import { last } from "lodash-es"

const Review = "Review"

const Approved = "Approved"

const Paid = "Paid"
const PaidTrans = {
  zh: "已支付",
  en: "Paid"
}

const Rejected = "Rejected"

const Invalid = "Invalid"

export const UnprocessedStatus = [Review, Approved]

export const isFundUnderReview = (value) => value === Review

export const isFundApproved = (value) => value === Approved

export const isFundPaid = (value) => value === Paid

export const isFundInvalid = (value) => value === Invalid

export const FundWithdrawStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case Review:
      return <ReviewTrans {...props} />
    case Approved:
      return <WaitingPaymentTrans {...props} />
    case Paid:
      return <Trans {...PaidTrans} {...props} />
    case Rejected:
      return <RejectedTrans {...props} />
    case Invalid:
      return <InvalidTrans {...props} />
    default:
      return value ?? ""
  }
}

const toPreferredAlias = (value) => {
  const WaitingPayment = "WaitingPayment"
  const PreferredAlias = [[Approved, WaitingPayment]]
  let pair = PreferredAlias.find(([key]) => key == value)
  return last(pair)
}
export const FundWithdrawStatusBox = ({ value, ...props }) => {
  let alias = toPreferredAlias(value)

  return (
    <LabelColorBox value={alias ?? value} {...props}>
      <FundWithdrawStatusLabel value={value} />
    </LabelColorBox>
  )
}

export const FundWithdrawStatusSelect = ({
  placeholder,
  isMulti = true,
  ...props
}) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useReviewTrans(),
      value: Review
    },
    {
      label: useWaitingPaymentTrans(),
      value: Approved
    },
    {
      label: useTrans(PaidTrans),
      value: Paid
    },
    {
      label: useRejectedTrans(),
      value: Rejected
    },
    {
      label: useInvalidTrans(),
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
