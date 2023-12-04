import React, { useRef, useEffect } from "react"
import { css } from "@emotion/react"
import { Select } from "../../select/Select"
import { MultiSelectBox } from "../../select/MultiSelectBox"
import { Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, Controller, useWatch } from "react-hook-form"
import { isDev } from "../../env"
import {
  ApprovedTrans,
  InvalidTrans,
  RejectedTrans,
  ReviewTrans,
  useApprovedTrans,
  useInvalidTrans,
  useRejectedTrans,
  useReviewTrans,
  useStatusTrans
} from "../../trans/Status"
import {
  WaitingPaymentTrans,
  useWaitingPaymentTrans
} from "../../trans/Payment"

const WaitingPayment = "WaitingPayment"

const Review = "Review"

const Approved = "Approved"

const Rejected = "Rejected"

const Invalid = "Invalid"

export const UnprocessedStatus = [Review, WaitingPayment]

export const isFundDepositUnderReview = (value) => value === Review

export const isFundDepositApproved = (value) => value === Approved

export const FundDepositStatusLabel = ({ value, ...props }) => {
  switch (value) {
    case WaitingPayment:
      return <WaitingPaymentTrans {...props} />
    case Review:
      return <ReviewTrans {...props} />
    case Approved:
      return <ApprovedTrans {...props} />
    case Rejected:
      return <RejectedTrans {...props} />
    case Invalid:
      return <InvalidTrans {...props} />
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
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useWaitingPaymentTrans(),
      value: WaitingPayment
    },
    {
      label: useReviewTrans(),
      value: Review
    },
    {
      label: useApprovedTrans(),
      value: Approved
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
