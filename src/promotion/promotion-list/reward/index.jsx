import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { usePromotionType } from "../edit"
import OfflineLoginReward from "./OfflineLoginReward"
import OfflineDepositReward from "./OfflineDepositReward"

const rewards = () => [OfflineLoginReward, OfflineDepositReward]

export const Main = ({}) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)
  return Reward?.Main ?? null
}

export const Content = ({}) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)
  return Reward?.Content ?? null
}

export const Rule = ({}) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)
  return Reward?.Rule ?? null
}
