import React, { useState, useEffect, useMemo, useRef, Children } from "react"
import { css, Global } from "@emotion/react"
import { CheckboxGroup } from "../../checkbox/CheckboxGroup"
import { useTrans } from "../../i18n"

const ValidBet = "ValidBet"
const ValidBetTrans = {
  zh: "有效投注",
  en: "Valid Bet"
}

const WinLoss = "WinLoss"
const WinLossTrans = {
  zh: "玩家输赢",
  en: "Player Win Loss"
}

const AllAgentRebate = {
  ValidBet,
  WinLoss
}

const AllAgentRebateTypes = Object.values(AllAgentRebate)

export const AllAgentRebateTypeCheckboxGroup = ({ ...props }) => {
  let options = [
    { label: useTrans(ValidBetTrans), value: ValidBet },
    {
      label: useTrans(WinLossTrans),
      value: WinLoss
    }
  ]

  return <CheckboxGroup options={options} />
}
