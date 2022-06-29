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
  Link
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Disclosure } from "../../dialog/Disclosure"
import FormDialog from "../../form/FormDialog"
import { View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import { useBrandLogo, useUpdateBrandLogo } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { InputField } from "../../input/Input"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch
} from "react-hook-form"
import { Tabs, Tab, TabPanel, TabList, useTabState } from "../../tab"
import head from "../../list/head"
import { HtmlEditor } from "../../text/editor/HtmlEditor"
import { useBrandLanguageCodes } from "../../dialog/LocalizationDialog"
import Backdrop from "../../dialog/Backdrop"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"

export const MaintenanceDateTimeRangeForm = ({ ...props }) => {
  //1. fetch Maintenance date time range
  //2. onSubmitted > reset form?
  //3. form: date time input range group + submit btn

  let editable = useIsDisplayMenuByRoute([Update])
  let readOnly = !editable
  let readable = useIsDisplayMenuByRoute([View])

  let formMethods = useForm()
  //TODO: fetch Maintenance date time range > reset form

  let [formData, setSubmit] = useState()
  const onSubmit = (data) => {
    console.log("onSubmit", data)
  }
  //TODO: update api with formData
  //TODO: useEffect > result > fetch maintenance date time range > reset from

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <DateTimeRangeInput addonAfter={<Button type="submit">Set</Button>} />
      </form>
    </FormProvider>
  )
}
