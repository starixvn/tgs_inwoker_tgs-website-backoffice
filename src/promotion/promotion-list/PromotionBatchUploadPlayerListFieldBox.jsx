//TODO: only visible when create promotion?
import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Set } from "bumbag"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTrans } from "../../i18n"
import { NormalLabel } from "../../form/Label"
import { VipLevelCheckboxGroup } from "../../vip-levels/CheckboxGroup"
import { PromotionTypeGroup, useFindPromotionType } from "../PromotionType"
import { usePromotionType } from "./edit"
import { get } from "lodash-es"

const FieldName = "batchId"

export const PromotionBatchUploadPlayerListFieldBox = ({
  disabled,
  readOnly
}) => {}
