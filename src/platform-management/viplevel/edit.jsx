import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  FieldStack,
  Box,
  Button,
  Text,
  Modal,
  Set,
  useModalState,
  Columns,
  Heading,
  Level,
  Dialog
} from "bumbag"
import {
  Create as CreateMenu,
  Update as UpdateMenu,
  View as ViewMenu
} from "./menu"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import {
  AddDisclosure,
  EditDisclosure,
  ViewDisclosure
} from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { FieldValues } from "../../layout/Grid"
import Input, { InputField } from "../../input/Input"
import { useAddVipLevel, useUpdateVipLevel } from "../../vip-levels/client"
import { NormalLabel } from "../../form/Label"
import Checkbox from "../../checkbox"
import {
  CloseButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import {
  NumberInput,
  NumberInputField,
  PercentageNumberInputField
} from "../../input/NumberInput"
import clone from "clone-deep"
import { useFormContext, useWatch } from "react-hook-form"

export const AddButton = ({ brandId, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <AddDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const AddDialog = ({ brandId, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } =
    useAddVipLevel(formData)

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  let title = useTrans({
    zh: "新增等级",
    en: "Add VIP Level"
  })

  return (
    <FormDialog
      id="add-vip-level-dialog"
      defaultValues={{}}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="100vw"
      minWidth="85vw"
      placement="top"
    >
      <EditBody isAdd={true} />
    </FormDialog>
  )
}

export const EditButton = ({ brandId, record, onSubmitted, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <EditDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <EditDialog
          brandId={brandId}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({ brandId, record, onSubmitted, dialog, ...props }) => {
  let { id } = record

  let [formData, setSubmit] = useState()
  let { result, error, mutate, deleteCache, isLoading } = useUpdateVipLevel(
    id,
    formData
  )

  let title = useTrans({
    zh: "编辑等级",
    en: "Edit VIP Level"
  })

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      brandId
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }

  return (
    <FormDialog
      id="edit-vip-level-dialog"
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      maxWidth="100vw"
      minWidth="85vw"
      placement="top"
    >
      <EditBody />
    </FormDialog>
  )
}

const LevelKeepConditionField = "levelKeepCondition"
const LevelKeepAccumulateBetAmountField = "levelKeepAccumulateBetAmount"
const LevelKeepAccumulateDepositField = "levelKeepAccumulateDeposit"

const EditBody = ({ record, readonly = false, isAdd = false }) => {
  let { getValues, setValue, control } = useFormContext()
  let editable = !readonly
  let id = getValues("id")

  let levelKeepCondition = useWatch({
    name: LevelKeepConditionField,
    control
  })

  useEffect(() => {
    if (editable && levelKeepCondition) {
      setValue(LevelKeepAccumulateBetAmountField, 0)
      setValue(LevelKeepAccumulateDepositField, 0)
    }
  }, [editable, levelKeepCondition])

  return (
    <FieldStack orientation="vertical" paddingBottom="1.5rem">
      <Level width="100%">
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <Trans zh="升级条件" en="Upgrade conditions" />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <Trans
                  zh="累积投注金额 （当日）："
                  en="Required Daily bet amount to up level："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="levelUpAccumulateBetAmount" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.levelUpAccumulateBetAmount} />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="累积存款金额 （当日）："
                  en="Required Daily deposit amount to up level："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="levelUpAccumulateDeposit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.levelUpAccumulateDeposit} />
                </Box>
              )}
            </FieldValues>
          </Set>
        </Set>
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <Trans zh="等级维持条件" en="Level maintenance conditions" />
          </Heading>
          <Set
            orientation="vertical"
            isFilled
            marginLeft="1rem"
            marginRight="1rem"
          >
            <FieldValues>
              <NormalLabel>
                <Trans
                  zh="累积投注金额 （每季）："
                  en="Required Quarterly bet amount to maintain level："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput
                    name="levelKeepAccumulateBetAmount"
                    min="0"
                    disabled={levelKeepCondition}
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber
                    value={record?.levelKeepAccumulateBetAmount}
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="累积存款金额 （每季）："
                  en="Required Quarterly deposit amount to maintain level："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput
                    name="levelKeepAccumulateDeposit"
                    min="0"
                    disabled={levelKeepCondition}
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.levelKeepAccumulateDeposit} />
                </Box>
              )}
            </FieldValues>
            {editable && (
              <Checkbox
                name="levelKeepCondition"
                label={
                  <Trans
                    zh="无需等级维持条件"
                    en="Disable maintenance conditions"
                  />
                }
              />
            )}
            {readonly && (
              <Checkbox
                checked={record?.levelKeepCondition}
                disabled
                label={
                  <Trans
                    zh="无需等级维持条件"
                    en="Disable maintenance conditions"
                  />
                }
              />
            )}
          </Set>
        </Set>
      </Level>

      <Box border="default" height="1px" width="100%" borderBottom="none"></Box>

      <Level width="100%">
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <Trans zh="VIP福利" en="VIP benefits" />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <Trans zh="生日福利：" en="Birthday Bonus：" />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="birthBenefit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.birthBenefit} />
                </Box>
              )}

              <NormalLabel>
                <Trans zh="晋升福利：" en="Promotion Bonus：" />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="promotionBenefit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.promotionBenefit} />
                </Box>
              )}

              <NormalLabel>
                <Trans zh="季度福利：" en="Quarterly Bonus：" />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInput name="quarterlyBenefit" min="0" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.quarterlyBenefit} />
                </Box>
              )}
            </FieldValues>
          </Set>
          <Heading use="h5" marginTop="1rem">
            <Trans zh="提款限制" en="Withdrawal Policy" />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <Trans zh="單日次數：" en="Transactions per Day：" />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInputField
                    name="withdrawTransactionsPerDay"
                    min="1"
                    addonBefore={
                      <Button isStatic tabIndex="-1">
                        ＜＝
                      </Button>
                    }
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.withdrawTransactionsPerDay} />
                </Box>
              )}

              <NormalLabel>
                <Trans zh="單日總額：" en="Total Amount per Day：" />
              </NormalLabel>
              {editable && (
                <Box>
                  <NumberInputField
                    name="withdrawTotalAmountPerDay"
                    min="1"
                    addonBefore={
                      <Button isStatic tabIndex="-1">
                        ＜＝
                      </Button>
                    }
                  />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumber value={record?.withdrawTotalAmountPerDay} />
                </Box>
              )}
            </FieldValues>
          </Set>
        </Set>
        <Set orientation="vertical" isFilled flex="1">
          <Heading use="h5">
            <Trans zh="VIP返水比例" en="VIP Commission Rebate（%）" />
          </Heading>
          <Set
            orientation="vertical"
            marginLeft="1rem"
            marginRight="1rem"
            isFilled
          >
            <FieldValues>
              <NormalLabel>
                <Trans
                  zh="真人返水比例（%）："
                  en="Live Dealer Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="liveDealerRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.liveDealerRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="电子返水比例（%）："
                  en="EGame Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="slotRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.slotRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="棋牌返水比例（%）："
                  en="Card Game Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="cardGameRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.cardGameRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="体育返水比例（%）："
                  en="Sportsbook Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="sportsRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.sportsRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="虚拟体育返水比例（%）："
                  en="VirtualSports Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="virtualSportsRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.virtualSportsRebate}
                    postfix="%"
                  />
                </Box>
              )}

              <NormalLabel>
                <Trans
                  zh="彩票返水比例（%）："
                  en="Lottery Commission Rebate（%）："
                />
              </NormalLabel>
              {editable && (
                <Box>
                  <PercentageNumberInputField name="lotteryRebate" />
                </Box>
              )}
              {readonly && (
                <Box alignY="center">
                  <FormattedNumberDecimal
                    value={record?.lotteryRebate}
                    postfix="%"
                  />
                </Box>
              )}
            </FieldValues>
          </Set>
        </Set>
      </Level>
      <Input type="hidden" name="id" value={id} />
    </FieldStack>
  )
}

export const ViewButton = ({ record, ...props }) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && <ViewDialog record={record} dialog={dialog} />}
    </>
  )
}

const ViewDialog = ({ record, dialog }) => {
  let title = useTrans({
    zh: "查看等级",
    en: "View VIP Level"
  })
  return (
    <FormDialog
      id="view-vip-level-dialog"
      defaultValues={record}
      onCloseErrorAlert={dialog.hide}
      title={title}
      dialog={dialog}
      showActionButtons={false}
      footer={<CloseButtonFooter dialog={dialog} alignX="right" />}
      maxWidth="100vw"
      minWidth="70vw"
      placement="top"
    >
      <EditBody record={record} readonly={true} />
    </FormDialog>
  )
}
