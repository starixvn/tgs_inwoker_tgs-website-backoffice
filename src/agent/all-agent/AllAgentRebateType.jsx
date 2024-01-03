import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { CheckboxGroup } from "../../checkbox/CheckboxGroup"
import { useTrans } from "../../i18n"
import { usePlayerWinLossTrans } from "../../trans/Player"
import { useValidBetAmountTrans } from "../../trans/Game"

const ValidBet = "ValidBet"

const WinLoss = "WinLoss"

const AllAgentRebate = {
  ValidBet,
  WinLoss
}

const AllAgentRebateTypes = Object.values(AllAgentRebate)

export const AllAgentRebateTypeCheckboxGroup = ({ ...props }) => {
  let options = [
    { label: useValidBetAmountTrans(), value: ValidBet },
    {
      label: usePlayerWinLossTrans(),
      value: WinLoss
    }
  ]

  return <CheckboxGroup options={options} />
}
