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
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import { useForm, useFormContext, useWatch, Controller } from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { InputField, Input } from "../../input/Input"
import { usePromotionBrandId } from "./usePromotionFormData"
import { ImageLocalizationDialogDisclosure } from "../../file/upload/ImageUploadButton"
import { Disclosure } from "../../dialog/Disclosure"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import Backdrop from "../../dialog/Backdrop"
import { toFileUploadPath } from "../../file/upload/FileUploadPath"
import { useFindPromotionType } from "../PromotionType"
import { get } from "lodash-es"
import Separator from "../../layout/Separator"
import { useViewTrans } from "../../trans/Action"
import {
  PromotionBannerDesktopTrans,
  PromotionBannerMobileTrans,
  PromotionContentTrans,
  PromotionRulesTrans,
  PromotionSubTitleTrans
} from "../../trans/Promotion"
import {
  RecommendedSize1200X486Trans,
  RecommendedSize690X280Trans
} from "../../trans/Field"

const FieldName = "content"

export const ContentBox = ({ body: Body = FieldValues, children }) => {
  return (
    <>
      <Separator />
      <Heading use="h5">
        <PromotionContentTrans />
      </Heading>
      <Body>{children}</Body>
    </>
  )
}

export const ContentSetting = ({ readOnly }) => {
  let brandId = usePromotionBrandId()

  let disabled = readOnly
  return (
    <>
      <Separator />

      <Heading use="h5">
        <PromotionContentTrans />
      </Heading>
      <FieldValues>
        <NormalLabel>
          <PromotionSubTitleTrans />
        </NormalLabel>
        <Box alignY="center">
          <InputField
            name="subSubject"
            brandId={brandId}
            showLocalizationAddonAfter
            disabled={disabled}
            readOnly={readOnly}
            required
          />
        </Box>

        <NormalLabel>
          <PromotionBannerDesktopTrans />
        </NormalLabel>
        <Set orientation="vertical" alignY="center">
          <ImageLocalizationDialogDisclosure
            id="desktopBanner"
            brandId={brandId}
            name="desktopBanner"
            prefix="promotion"
            disabled={disabled}
            readOnly={readOnly}
            required
          />
          <Text.Block color="warning" fontWeight="bold" fontSize="150">
            <RecommendedSize1200X486Trans />
          </Text.Block>
        </Set>

        <NormalLabel>
          <PromotionBannerMobileTrans />
        </NormalLabel>
        <Set orientation="vertical" alignY="center">
          <ImageLocalizationDialogDisclosure
            id="mobileBanner"
            brandId={brandId}
            name="mobileBanner"
            prefix="promotion"
            disabled={disabled}
            readOnly={readOnly}
            required
          />
          <Text.Block color="warning" fontWeight="bold" fontSize="150">
            <RecommendedSize690X280Trans />
          </Text.Block>
        </Set>

        <NormalLabel>
          <PromotionContentTrans />
        </NormalLabel>
        <Box alignY="center">
          <HtmlEditorDisclosure
            brandId={brandId}
            name="content"
            disabled={disabled}
            readOnly={readOnly}
          />
        </Box>

        <NormalLabel>
          <PromotionRulesTrans />
        </NormalLabel>
        <Box alignY="center">
          <HtmlEditorDisclosure
            brandId={brandId}
            name="terms"
            disabled={disabled}
            readOnly={readOnly}
          />
        </Box>
      </FieldValues>
    </>
  )
}

export const HtmlEditorDisclosure = ({ brandId, name, readOnly }) => {
  let dialog = useModalState()

  let editTitle = useTrans({
    zh: "编辑",
    en: "Edit"
  })
  let viewTitle = useViewTrans()
  let title = readOnly ? viewTitle : editTitle
  return (
    <>
      <Disclosure width="fit-content" {...dialog}>
        {title}
      </Disclosure>
      {dialog.visible && (
        <HtmlEditorDialog
          brandId={brandId}
          name={name}
          readOnly={readOnly}
          dialog={dialog}
          title={title}
        />
      )}
    </>
  )
}

const HtmlEditorDialog = ({
  brandId,
  name,
  readOnly,
  dialog,
  title,
  ...props
}) => {
  let { visible } = props
  return (
    <Backdrop
      {...dialog}
      css={css`
        .tox-fullscreen & {
          top: 0;
          left: 0;
          transform: none;
        }
      `}
    >
      <Dialog.Modal
        {...dialog}
        hideBackdrop
        hideOnClickOutside={false}
        showCloseButton
        title={title}
        width="70vw"
        maxWidth="80vw"
        css={css`
          & .bb-DialogContent {
            max-height: 80vh;
          }
          .tox-fullscreen & {
            top: 0;
            left: 0;
            transform: none;
          }
        `}
      >
        <HtmlEditor
          brandId={brandId}
          name={name}
          imagesUploadUrl={toFileUploadPath("promotion")}
          readOnly={readOnly}
          height="480"
          active={visible}
          showLocalizationAddonAfter
        />
      </Dialog.Modal>
    </Backdrop>
  )
}
