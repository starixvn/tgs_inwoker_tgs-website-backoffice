import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Flex, Text, Group, FieldStack } from "bumbag"
import {
  Trans,
  useLocale,
  useTrans,
  Locales,
  FormattedNumberDecimalPercentage
} from "../../i18n"
import { useForm, useFormContext, useWatch } from "react-hook-form"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import Input from "../../input/Input"
import Textarea from "../../textarea"
import { SubjectTrans } from "../../trans/Field"

export const TabId = "autoAlert"

export const AutoAlertTab = (props) => {
  return (
    <Tab tabId={TabId} {...props}>
      <Trans zh="通知信-自動" en="Auto Alert" />
    </Tab>
  )
}

const BodyStyle = css`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: auto 1fr;
`

export const AutoAlertPanel = ({ readOnly, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === TabId

  return (
    <TabPanel tabId={TabId} {...props}>
      <Box css={BodyStyle}>
        <Box fontWeight="bold">
          <Trans zh="加值通知" en="Balance Alert" />
        </Box>
        <LowRiskAlertBox readOnly={readOnly} />

        <Box fontWeight="bold">
          <Trans zh="緊急加值通知" en="Balance Low Alert" />
        </Box>
        <MediumRiskAlertBox readOnly={readOnly} />

        <Box fontWeight="bold">
          <Trans zh="平台停用通知" en="Suspension Alert" />
        </Box>
        <HighRiskLobbySuspensionAlertBox readOnly={readOnly} />
      </Box>
    </TabPanel>
  )
}

const TextareaStyle = css`
  textarea {
    min-height: 15vh;
  }
`

const AlertBox = ({
  name = "",
  readOnly,
  subject = "",
  defaultContent = ""
}) => {
  return (
    <Box css={BodyStyle}>
      <SubjectTrans />
      <Input
        name={`${name}.emailSubject`}
        value={subject}
        disabled
        readOnly={readOnly}
        size="small"
      />

      <Trans zh="內容" en="Message" />
      <Textarea
        name={`${name}.emailContent`}
        defaultValue={defaultContent}
        readOnly={readOnly}
        disabled={readOnly}
        size="small"
        css={TextareaStyle}
      />
    </Box>
  )
}

const getLicensee = () => {
  let { getValues } = useFormContext()
  let code = getValues("licenseeCode")
  let name = getValues("licenseeName")
  return name || code
}

const getBrand = () => {
  let { getValues } = useFormContext()
  let code = getValues("brandCode")
  let name = getValues("brandName")
  return name || code
}

//TODO: other lang?
const LowRiskAlertBox = ({ readOnly }) => {
  let licensee = getLicensee()
  let brand = getBrand()
  let subjectPrefix = `[${licensee}][${brand}]`
  return (
    <AlertBox
      name="lowNotification"
      readOnly={readOnly}
      subject={`${subjectPrefix} 加值通知 Warning: Balance low`}
      defaultContent={`敬愛的夥伴您好，您的平台目前剩餘額度不足，為避免影響會員遊戲體驗，請盡速聯繫貴司對應商務進行加值，謝謝您。
Dear Partner,
We wanted to inform you that your site currently has reached a high balance usage. To maintain the stability and quality of your gaming experience, we kindly recommend reaching out to your designated business contact for a top-up. Thank you.
`}
    />
  )
}

//TODO: other lang?
const MediumRiskAlertBox = ({ readOnly }) => {
  let licensee = getLicensee()
  let brand = getBrand()
  let subjectPrefix = `[${licensee}][${brand}]`
  return (
    <AlertBox
      name="moderateNotification"
      readOnly={readOnly}
      subject={`${subjectPrefix} 緊急加值通知 Warning: Balance too low`}
      defaultContent={`敬愛的夥伴您好，您的平台目前剩餘額度嚴重不足，所有遊戲暫時不可進入；為避免影響平台正常運營，請立即聯繫貴司對應商務進行加值，謝謝您。
Dear Partner,
We wanted to inform you that your site currently has reached a higher balance usage, and the access to all games will be temporarily suspended. To maintain the stability of your site, we kindly recommend reaching out to your designated business contact for a top-up immediately. Thank you.
`}
    />
  )
}

//TODO: other lang?
const HighRiskLobbySuspensionAlertBox = ({ readOnly }) => {
  let licensee = getLicensee()
  let brand = getBrand()
  let subjectPrefix = `[${licensee}][${brand}]`
  return (
    <AlertBox
      name="highNotification"
      readOnly={readOnly}
      subject={`${subjectPrefix} 平台已停用，請立即加值 Notice of Suspension`}
      defaultContent={`貴司您好，由於您的平台剩餘額度已低於限制，平台及所有遊戲暫時不可進入；請立即聯繫貴司對應商務進行加值，並由專人協助您恢復平台運行，謝謝您。
Dear Partner,
We wanted to inform you that your site has been temporarily suspended due to a balance usage that has exceeded the limit. To recover the full access of platform and all games, we kindly recommend reaching out to your designated business contact for a top-up immediately. Thank you.
`}
    />
  )
}
