import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Set, Spinner, useModalState, Box } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import BrandBar from "../../report/BrandBar"
import { Trans, useTrans } from "../../i18n"
import { MessengerDialogDisclosure } from "./MessengerDialog"
import { CreateOrEditLiveChatDialogDisclosure } from "./LiveChatDialog"
import { isDev } from "../../env"
import { AgentMultipleLayerProfitSharingSettingFormBody } from "../../agent/AgentMultipleLayerProfitSharingSetting"
import Disclosure from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { useUpdatePlatformAgentDividendCondition } from "./client"
import { useBrand } from "../../merchant/platforms/client"
import { isAgentProfitSharingMultipleLayer } from "../../agent/AgentProfitSharingType"
import { Update } from "./menu"

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
  let { isLoading, data: brand, error, mutate, deleteCache } = useBrand(brandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && brandId && brand && (
        <BodyContent brandId={brandId} brand={brand} />
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const BodyContent = ({ brandId, brand }) => {
  let agentProfitSharingType = brand?.agentDividendType
  let multipleLayer = isAgentProfitSharingMultipleLayer(agentProfitSharingType)
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
        {multipleLayer && (
          <PlatformProfitSharingSettingDialogDisclosure
            id="profit-sharing-setting-dialog-disclosure"
            brandId={brandId}
          />
        )}
      </Set>
    </PageContent>
  )
}

const PlatformProfitSharingSettingDialogDisclosure = ({
  brandId,
  name = "brandAgentDividendConditions",
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="阶梯式分红设定" en="Tier-based Profit Sharing Setting" />
      </Disclosure>
      {dialog.visible && (
        <MultipleLayerProfitSharingSettingDialog
          brandId={brandId}
          dialog={dialog}
        />
      )}
    </>
  )
}

const MultipleLayerProfitSharingSettingDialog = ({
  brandId,
  dialog,
  ...props
}) => {
  //TODO: loading existing setting?
  let title = useTrans({
    zh: "阶梯式分红设定",
    en: "Profit Sharing Setting"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdatePlatformAgentDividendCondition(formData)

  const reset = () => {
    deleteCache()
    mutate(null, false)
    setSubmit(undefined)
  }

  const onSubmit = (formData) => {
    reset()

    setSubmit(formData)
  }

  return (
    <FormDialog
      defaultValues={{
        brandId,
        brandAgentDividendConditions: [] //TODO: need to load current setting?
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      {...props}
    >
      <AgentMultipleLayerProfitSharingSettingFormBody name="brandAgentDividendConditions" />
    </FormDialog>
  )
}
