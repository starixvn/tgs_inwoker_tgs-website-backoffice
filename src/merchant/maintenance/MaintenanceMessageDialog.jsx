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
import { useMaintenanceMessage, useUpdateMaintenanceMessage } from "./client"

export const ViewMaintenanceMessage = ({ brandId, ...props }) => {
  let dialog = useModalState()

  let readable = useIsDisplayMenuByRoute([View])
  if (!readable) {
    return null
  }
}

export const EditMaintenanceMessage = ({}) => {}
