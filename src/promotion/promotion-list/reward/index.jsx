import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Text,
  Button,
  Set,
  Icon,
  useModalState,
  Dialog,
  Card,
  Flex,
  Heading,
  FieldStack
} from "bumbag"
import { Trans } from "../../../i18n"
import Separator from "../../../layout/Separator"
import {
  useIsPromotionAdded,
  usePromotionType,
  useIsActivePromotion
} from "../usePromotionFormData"
import DepositRewardGroup from "./DepositRewardGroup"
import TurnoverRewardGroup from "./TurnoverRewardGroup"
import ReliefMoneyRewardGroup from "./ReliefMoneyRewardGroup"
import NewUserReward from "./NewUserReward"
import RouletteReward from "./RouletteReward"
import DepositLotteryReward from "./DepositLotteryReward"
import DummyReward from "./DummyReward"
import OfflineLoginReward from "./OfflineLoginReward"
import OfflineDepositReward from "./OfflineDepositReward"

const rewards = () => [
  ...DepositRewardGroup,
  ...TurnoverRewardGroup,
  ...ReliefMoneyRewardGroup,
  NewUserReward,
  RouletteReward,
  DepositLotteryReward,
  DummyReward,
  OfflineLoginReward,
  OfflineDepositReward
]

export const Main = ({ readOnly, ...props }) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)

  /*
  TODO: also use useIsPromotionStarted() ?
  let isAdded = useIsPromotionAdded()
  if (isAdded) {
    readOnly = true
  }
  */

  return Reward?.Main ? <Reward.Main readOnly={readOnly} {...props} /> : null
}

export const Content = (props) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)
  return Reward?.Content ? <Reward.Content {...props} /> : null
}

export const Rule = (props) => {
  let type = usePromotionType()
  let Reward = rewards().find((reward) => reward.PromotionType === type)
  return Reward?.Rule ? (
    <>
      <Separator />

      <Heading use="h5">
        <Trans zh="規則設定" en="Rule Settings" />
      </Heading>

      <Reward.Rule {...props} />
    </>
  ) : null
}

export default {
  Main,
  Content,
  Rule
}
