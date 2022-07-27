import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  useModalState,
  Stack,
  FieldStack,
  Card,
  Set,
  Table,
  Button,
  DropdownMenu,
  Icon,
  Box,
  Alert,
  Group,
  Spinner,
  FieldWrapper
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { useFormContext, useWatch } from "react-hook-form"
import head from "../../list/head"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import { useBrandLanguageCodes } from "../../dialog/LocalizationDialog"
import Backdrop from "../../dialog/Backdrop"
import BrandIdSelect from "../platforms/BrandIdSelect"
import { TimeSelectField2 } from "../../date/time"
import { useUpdateMaintenance } from "./client"
import { useBrandList } from "../platforms/client"

export const MaintenanceTimeRangeDialogDisclosure = ({
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let editable = useIsDisplayMenuByRoute([Update])
  if (!editable) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="维护时间" en="Maintenance Time" />
      </Disclosure>
      {dialog.visible && (
        <TimeRangeDialog onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const TimeRangeDialog = ({ dialog, onSubmitted, ...props }) => {
  let {
    isLoading: isLoadingBrandList,
    error: brandListError,
    data: brand
  } = useBrandList({
    showAll: true,
    sortby: "code"
  })

  let title = useTrans({
    zh: "维护时间",
    en: "Maintenance Time"
  })

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } =
    useUpdateMaintenance(formData)

  const reset = () => {
    deleteCache()
    mutate(null, false)
  }

  if (isLoadingBrandList) {
    return <LoadingBackdrop {...dialog} />
  }

  if (brandListError) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let brandIds = brand?.items.map((brand) => brand.id)
  return (
    <FormDialog
      defaultValues={{
        brandIds,
        beginTime: null,
        endTime: null
      }}
      onSubmit={({ ...data }) => {
        let form = {
          ...data
        }
        setSubmit(form)
      }}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      {...props}
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  let { control } = useFormContext()
  let BeginTimeField = "beginTime"
  let beginTime = useWatch({
    control,
    name: BeginTimeField
  })

  let startLabel = useTrans({
    zh: "开始",
    en: "Start"
  })

  let EndTimeField = "endTime"
  let endTime = useWatch({
    control,
    name: EndTimeField
  })
  let endLabel = useTrans({
    zh: "结束",
    en: "End"
  })
  return (
    <FieldStack orientation="vertical">
      {/* <BrandIdSelect name="brandId" /> */}
      <FieldStack orientation="horizontal">
        <TimeSelectField2
          name={BeginTimeField}
          defaultValue={beginTime}
          max={endTime}
          label={startLabel}
          required
        />
        <TimeSelectField2
          name={EndTimeField}
          defaultValue={endTime}
          min={beginTime}
          label={endLabel}
          required
        />
      </FieldStack>
    </FieldStack>
  )
}
