import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  FieldStack,
  Table,
  Button,
  Icon,
  Group,
  useModalState,
  Text
} from "bumbag"
import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch
} from "react-hook-form"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../user/context"
import { Trans, useTrans } from "../i18n"
import FormDialog from "../form/FormDialog"
import { CloseButtonFooter } from "../form/ConfirmButtonFooter"
import clone from "clone-deep"
import { Input, InputField } from "../input/Input"
import { Disclosure } from "../dialog/Disclosure"
import { ConfirmText } from "../button/ActionButtons"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import Backdrop from "../dialog/Backdrop"
import {
  MaxNumber,
  NumberInput,
  PercentageNumberInputField
} from "../input/NumberInput"
import { useAgentList, useAgent } from "./agent-list/client"
import { useBrand } from "../merchant/platforms/client"
import { isNil } from "lodash-es"
import { isMonthlySettlementInterval } from "../date/SettlementIntervalType"
import { AlertDialog } from "../dialog/Alert"
import LoadingBackdrop from "../dialog/LoadingBackdrop"

export const AgentMultipleLayerProfitSharingSettingDialogDisclosure = ({
  name = "agentDividendConditions",
  brandId = "",
  parentUsername = "",
  readOnly,
  ...props
}) => {
  /* Note: ```MultipleLayer setting is independent, no need to check parent or child agents```
  
  let { isLoading: isLoadingBrand, data: brand, brandError } = useBrand(brandId)
  let {
    isLoading: isLoadingAgent,
    data: agentData,
    agentError
  } = useAgentList(
    brandId && parentUsername
      ? {
          brandId,
          username: parentUsername,
          page: 1,
          rows: 1
        }
      : undefined
  )
  let parentAgent = agentData?.items?.[0]

  let validParentAgent = !!(
    parentUsername &&
    parentAgent &&
    parentAgent?.agentDividendConditions?.length > 0
  )

  let parentAgentProfitSharingSettings = validParentAgent
    ? parentAgent.agentDividendConditions
    : undefined
  
  if (isLoadingBrand) {
    return <Disclosure disabled isLoading></Disclosure>
  }
  */

  let maxLevelSize = MaxNumber
  return (
    <SettingDisclosure
      name={name}
      // parentAgentProfitSharingSettings={parentAgentProfitSharingSettings}
      maxLevelSize={maxLevelSize}
      {...props}
    />
  )
}

export const AgentProfitSharingSettingRecordDialogDisclosure = ({
  record,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="分红设置" en="Profit Sharing Setting" />
      </Disclosure>
      {dialog.visible && (
        <SettingDialog record={record} readOnly dialog={dialog} />
      )}
    </>
  )
}

export const ViewAgentProfitSharingSettingDialogDisclosure = ({
  agentId,
  ...props
}) => {
  let dialog = useModalState()

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="分红设置" en="Profit Sharing Setting" />
      </Disclosure>
      {dialog.visible && <AgentDialog agentId={agentId} dialog={dialog} />}
    </>
  )
}

const AgentDialog = ({ agentId, dialog, ...props }) => {
  let { isLoading, data, error } = useAgent(agentId)
  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <SettingDialog
      record={data?.agentDividendConditions}
      readOnly
      dialog={dialog}
    />
  )
}

const SettingDisclosure = ({
  name,
  parentAgentProfitSharingSettings,
  maxLevelSize = MaxNumber,
  readOnly,
  ...props
}) => {
  let dialog = useModalState()

  let { control, watch, setValue } = useFormContext()
  let defaultValue = watch(name)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: true }}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty }
      }) => {
        let palette = invalid ? "danger" : "default"
        let variant = invalid ? "outlined" : "default"
        return (
          <>
            <Disclosure
              id="agent-profit-sharing-setting-dialog-disclosure"
              {...dialog}
              palette={palette}
              variant={variant}
              {...props}
            >
              <Trans zh="分红设置" en="Profit Sharing Setting" />
            </Disclosure>
            {dialog.visible && (
              <SettingDialog
                record={value}
                parentAgentProfitSharingSettings={
                  parentAgentProfitSharingSettings
                }
                maxLevelSize={maxLevelSize}
                onChange={(data) => {
                  let editable = !readOnly
                  if (editable) {
                    setValue(name, data, { shouldValidate: true })
                  }
                }}
                readOnly={readOnly}
                dialog={dialog}
              />
            )}
          </>
        )
      }}
    />
  )
}

const FieldName = "list"
const SettingDialog = ({
  record = [],
  parentAgentProfitSharingSettings,
  maxLevelSize,
  readOnly,
  dialog,
  onChange
}) => {
  let title = useTrans({
    zh: "分红设置",
    en: "Profit Sharing Setting"
  })

  let editable = !readOnly
  let defaultValues = {}
  Reflect.set(defaultValues, FieldName, clone(record))
  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="agent-profit-sharing-setting-dialog"
        defaultValues={defaultValues}
        onSubmit={(data) => {
          onChange?.(Reflect.get(data, FieldName))
          dialog.hide()
        }}
        stopPropagation={true}
        dialog={dialog}
        hideBackdrop
        title={title}
        submitText={<ConfirmText />}
        showActionButtons={editable}
        footer={
          !editable && <CloseButtonFooter dialog={dialog} alignX="right" />
        }
        minWidth="50vw"
      >
        <FormBody
          maxLevelSize={maxLevelSize}
          parentAgentProfitSharingSettings={parentAgentProfitSharingSettings}
          readOnly={readOnly}
        />
      </FormDialog>
    </Backdrop>
  )
}

const FormBody = ({
  maxLevelSize,
  parentAgentProfitSharingSettings,
  readOnly
}) => {
  let editable = !readOnly
  let { control, watch } = useFormContext()

  let fieldArray = useFieldArray({
    control,
    name: FieldName,
    keyName: "_id"
  })

  // let fields = watch(FieldName)
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>
            <Box></Box>
          </Table.HeadCell>
          <Table.HeadCell>
            <Trans zh="净盈利" en="Net Profit" />
          </Table.HeadCell>
          <Table.HeadCell>
            <Trans zh="活跃人数" en="Active Player" />
          </Table.HeadCell>
          <Table.HeadCell>
            <Trans zh="分红比例" en="Profit Sharing Percentage" />
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {fieldArray.fields.map((field, index) => (
          <SettingRow
            key={field._id}
            field={field}
            index={index}
            fieldArray={fieldArray}
            parentAgentProfitSharingSettings={parentAgentProfitSharingSettings}
            readOnly={readOnly}
          />
        ))}
        {readOnly && !fieldArray.fields.length && (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={4}>
              <Trans zh="无资料" en="No Data" />
            </Table.Cell>
          </Table.Row>
        )}
        {editable && fieldArray.fields.length < maxLevelSize && (
          <AddRow fieldArray={fieldArray} />
        )}
      </Table.Body>
    </Table>
  )
}

const AddRow = ({ fieldArray }) =>
  useMemo(
    () => (
      <Table.Row id={`add-agent-profit-sharing-setting`}>
        <Table.HeadCell>
          <Button
            id="add-agent-profit-sharing-setting"
            size="small"
            variant="ghost"
            onClick={(event) => {
              fieldArray.append({
                netProfit: "",
                activeNumber: "",
                dividendPercentage: ""
              })
            }}
          >
            <Icon icon={faPlus} type="font-awesome" />
          </Button>
        </Table.HeadCell>
        <Table.HeadCell colSpan="3"></Table.HeadCell>
      </Table.Row>
    ),
    [fieldArray]
  )

const DefaultMinSetting = {
  netProfit: 0,
  activeNumber: 0,
  dividendPercentage: 0
}

const SettingRow = ({
  field,
  index,
  fieldArray,
  readOnly,
  parentAgentProfitSharingSettings
}) => {
  let { control } = useFormContext()
  let previous = useWatch({
    control,
    name: `${FieldName}.${index - 1}`
  })
  let next = useWatch({
    control,
    name: `${FieldName}.${index + 1}`
  })

  let parentAgentSetting = parentAgentProfitSharingSettings?.[index]

  let editable = !readOnly
  let disabled = readOnly
  return (
    <>
      <Table.Row>
        <Table.Cell>
          <Input
            type="hidden"
            name={`${FieldName}.${index}.rank`}
            value={index + 1}
          />
          {editable && (
            <Button
              size="small"
              palette="danger"
              variant="ghost"
              onClick={(event) => {
                fieldArray.remove(index)
              }}
            >
              <Icon icon={faMinus} type="font-awesome" />
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          <NumberInput
            name={`${FieldName}.${index}.netProfit`}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={field.netProfit}
            registerOptions={{
              valueAsNumber: true
            }}
            min={Math.max(
              ...[
                DefaultMinSetting.netProfit,
                previous?.netProfit,
                parentAgentSetting?.netProfit
              ].filter(Number.isFinite)
            )}
            max={Math.min(
              ...[
                MaxNumber,
                next?.netProfit,
                parentAgentSetting?.netProfit
              ].filter(Number.isFinite)
            )}
            required
          />
        </Table.Cell>
        <Table.Cell>
          <NumberInput
            name={`${FieldName}.${index}.activeNumber`}
            readOnly={readOnly}
            disabled={disabled}
            defaultValue={field.activeNumber}
            registerOptions={{
              valueAsNumber: true
            }}
            min={Math.max(
              ...[
                DefaultMinSetting.activeNumber,
                previous?.activeNumber,
                parentAgentSetting?.activeNumber
              ].filter(Number.isFinite)
            )}
            max={Math.min(
              ...[
                MaxNumber,
                next?.activeNumber,
                parentAgentSetting?.activeNumber
              ].filter(Number.isFinite)
            )}
            required
          />
        </Table.Cell>
        <Table.Cell>
          <PercentageNumberInputField
            name={`${FieldName}.${index}.dividendPercentage`}
            readOnly={readOnly}
            disabled={disabled}
            registerOptions={{
              valueAsNumber: true
            }}
            defaultValue={field.dividendPercentage}
            min={Math.max(
              ...[
                DefaultMinSetting.dividendPercentage,
                previous?.dividendPercentage,
                parentAgentSetting?.dividendPercentage
              ].filter(Number.isFinite)
            )}
            max={Math.min(
              ...[
                MaxNumber,
                next?.netProfit,
                parentAgentSetting?.netProfit
              ].filter(Number.isFinite)
            )}
            required
          />
        </Table.Cell>
      </Table.Row>
    </>
  )
}
