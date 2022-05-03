import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Button, Text, Switch, Stack } from "bumbag"
import { Trans, useTrans } from "../../i18n"

const BrandMessages = {
  zh: "平台",
  en: "Platform"
}
export const useBrandTrans = () => useTrans(BrandMessages)
export const BrandTrans = () => <Trans {...BrandMessages} />
