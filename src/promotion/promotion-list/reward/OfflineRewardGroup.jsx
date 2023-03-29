import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import OfflineLoginReward from "./OfflineLoginReward"
import OfflineDepositReward from "./OfflineDepositReward"

export const PromotionTypes = [
  OfflineLoginReward.PromotionType,
  OfflineDepositReward.PromotionType
]

export const Rewards = [OfflineLoginReward, OfflineDepositReward]

export default Rewards
