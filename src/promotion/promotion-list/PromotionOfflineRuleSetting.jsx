import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { usePromotionType } from "./edit"

const LoginReward = "LoginReward"

export const PromotionOfflineRuleSetting = ({ readOnly }) => {
  let promotionType = usePromotionType()

  switch (promotionType) {
  }
}

const LoginRewardRuleSetting = ({}) => {
  //TODO: hide "PromotionTotalFundsFieldBox" field by setting
  //1. upload btn
  //2. need review? paging? performance issue?
  //3.
}
