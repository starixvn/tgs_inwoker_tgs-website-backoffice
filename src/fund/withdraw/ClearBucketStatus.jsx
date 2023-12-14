import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Text,
  Box,
  Set,
  FieldStack
} from "bumbag"
import Disclosure from "../../dialog/Disclosure"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import {
  RejectedTrans,
  useRejectedTrans,
  useStatusTrans
} from "../../trans/Status"

const Create = "Create"
const CreateTrans = {
  zh: "执行中",
  en: "Processing"
}

const Completed = "Completed"
const CompletedTrans = {
  zh: "已执行",
  en: "Completed"
}

const Rejected = "Rejected"

export const ClearBucketStatus = {
  Create,
  Completed,
  Rejected
}

export const ClearBucketStatusSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useStatusTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let options = [
    {
      label: useTrans(CreateTrans),
      value: Create
    },
    {
      label: useTrans(CompletedTrans),
      value: Completed
    },
    {
      label: useRejectedTrans(),
      value: Rejected
    }
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const ClearBucketStatusLabel = ({ value = "" }) => {
  switch (value) {
    case Create:
      return <Trans {...CreateTrans} />
    case Completed:
      return <Trans {...CompletedTrans} />
    case Rejected:
      return <RejectedTrans />
    default:
      return value
  }
}

export default {
  ...ClearBucketStatus,
  ClearBucketStatusSelect,
  ClearBucketStatusLabel
}
