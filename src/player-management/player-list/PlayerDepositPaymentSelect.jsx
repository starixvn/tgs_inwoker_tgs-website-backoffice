import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Text } from "bumbag"
import { useTrans, Trans } from "../../i18n"
import Select from "../../select/Select"
import { usePlayerDepositPaymentList } from "../../system/brandpayments/client"

export const PlayerDepositPaymentSelect = ({
  brandId,
  playerCode,
  ...props
}) => {
  //TODO: placeholder?
  let { isLoading, data, error } = usePlayerDepositPaymentList({
    brandId,
    playerCode
  })
  console.log("data", data)

  return <Select />
}
