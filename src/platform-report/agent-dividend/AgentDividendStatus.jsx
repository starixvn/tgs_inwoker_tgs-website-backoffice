import React from "react"
import { css } from "@emotion/react"
import Select from "../../select/Select"
import {
  DistributedTrans,
  RejectedTrans,
  ReviewTrans,
  useDistributedTrans,
  useRejectedTrans,
  useReviewTrans,
  useStatusTrans
} from "../../trans/Status"

const ReadyToApprove = "ReadyToApprove"
const Sent = "Sent"
const Rejected = "Rejected"

export const AgentDividendStatusSelect = ({
  placeholder = useStatusTrans(),
  ...props
}) => {
  let options = [
    {
      label: useReviewTrans(),
      value: ReadyToApprove
    },
    {
      label: useDistributedTrans(),
      value: Sent
    },
    {
      label: useRejectedTrans(),
      value: Rejected
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const AgentDividendStatusLabel = ({ value = "" }) => {
  switch (value) {
    case ReadyToApprove:
      return <ReviewTrans />
    case Sent:
      return <DistributedTrans />
    case Rejected:
      return <RejectedTrans />
    default:
      return value
  }
}
