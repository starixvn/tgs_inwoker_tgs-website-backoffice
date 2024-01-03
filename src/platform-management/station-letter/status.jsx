import React, { useState, useEffect, useMemo, useRef } from "react"
import { Locales, Trans, useTrans } from "../../i18n"
import { PublishedTrans, RejectedTrans, ReviewTrans } from "../../trans/Status"

export const InVerify = 0
export const InVerifyName = "InVerify"

export const Published = 1
export const PublishedName = "Published"

export const Rejected = 2
export const RejectedName = "Rejected"

//string -> number
export const from = (value) => {
  switch (value) {
    case InVerifyName:
    case `${InVerify}`:
      return InVerify

    case PublishedName:
    case `${Published}`:
      return Published

    case RejectedName:
    case `${Rejected}`:
      return Rejected

    default:
      return value
  }
}

export const Label = ({ value }) => {
  switch (value) {
    case InVerify:
    case InVerifyName:
      return <ReviewTrans />

    case Published:
    case PublishedName:
      return <PublishedTrans />

    case Rejected:
    case RejectedName:
      return <RejectedTrans />

    default:
      return value
  }
}
