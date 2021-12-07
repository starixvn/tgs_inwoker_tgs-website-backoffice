import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Set } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { Trans } from "../../i18n"
import { MessengerDialogDisclosure } from "./MessengerDialog"
import { CreateOrEditLiveChatDialogDisclosure } from "./LiveChatDialog"
import { isDev } from "../../env"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  return (
    <PageContent title={<Trans en="Operation Settings" zh="营运设置" />}>
      <Set>
        <MessengerDialogDisclosure
          id="instant-messaging-dialog-disclosure"
          brandId={brandId}
        />
        <CreateOrEditLiveChatDialogDisclosure
          id="live-chat-dialog-disclosure"
          brandId={brandId}
        />
      </Set>
    </PageContent>
  )
}
