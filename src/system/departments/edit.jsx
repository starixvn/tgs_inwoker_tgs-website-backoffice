import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Modal, Box } from "bumbag"
import { Create as CreateMenu, Update as UpdateMenu } from "./menu"
import {
  useIsDisplayMenuByRoute,
  useUserBrandId,
  useUserLicenseeId,
  useUserResellerId,
  useUserRoleType
} from "../../user/context"
import { Trans, useTrans } from "../../i18n"
import { useAddDepartment, useEditDepartment } from "./client"
import Label from "../../form/Label"
import { FieldValues } from "../../layout/Grid"
import Disclosure from "../../dialog/Disclosure"
import {
  useForm,
  useFormContext,
  FormProvider,
  useWatch
} from "react-hook-form"
import FormDialog from "../../form/FormDialog"
import Input from "../../input/Input"
import { nextRoleType, RoleTypeSelect, useRoleTypeOptions } from "../roles/type"
import { MerchantIdSelect } from "../../merchant/MerchantSelect"
import ResellerIdSelect from "../../merchant/resellers/ResellerIdSelect"
import { useResellerLabel } from "../../merchant/resellers"
import LicenseeIdSelect from "../../merchant/licensees/LicenseeIdSelect"
import BrandIdSelect from "../../merchant/platforms/BrandIdSelect"
import {
  AddTrans,
  EditTrans,
  useAddTrans,
  useEditTrans
} from "../../trans/Action"
import {
  DepartmentNameTrans,
  LicenseeTrans,
  PlatformTrans
} from "../../trans/Platform"

export const AddButton = ({ onSubmitted, ...props }) => {
  let dialog = Modal.useState()
  let isDisplay = useIsDisplayMenuByRoute([CreateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <AddTrans />
      </Disclosure>
      {dialog.visible && (
        <AddDialog onSubmitted={onSubmitted} dialog={dialog} />
      )}
    </>
  )
}

const AddDialog = ({ onSubmitted, dialog, ...props }) => {
  let title = useAddTrans()

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, mutate, deleteCache } =
    useAddDepartment(submitData)

  const onSubmit = (data) => {
    let base = {
      resellerId: userResellerId,
      licenseeId: userLicenseeId,
      brandId: userBrandId
    }

    let formData = { ...base, ...data }
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{
        name: ""
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
      minWidth="50vw"
    >
      <EditBody isAdd={true} />
    </FormDialog>
  )
}

const EditBody = ({ record = {}, isAdd = false }) => {
  let userRoleType = useUserRoleType()
  let roleTypeOptions = useRoleTypeOptions()

  let { watch } = useFormContext()
  let resellerId = watch("resellerId", record?.resellerId ?? "")
  let licenseeId = watch("licenseeId", record?.licenseeId ?? "")
  let brandId = watch("brandId", record?.brandId ?? "")

  return (
    <Stack spacing="major-3" margin="major-1">
      <FieldValues>
        {isAdd && roleTypeOptions.length > 1 && (
          <>
            <Label name="roleType">
              <Trans zh="类型" en="Type" />
            </Label>
            <Box>
              <MerchantIdSelect
                disabled={!isAdd}
                start={nextRoleType(userRoleType)}
                resellerProps={{
                  defaultValue: resellerId
                }}
                licenseeProps={{
                  defaultValue: licenseeId
                }}
                brandProps={{
                  defaultValue: brandId
                }}
                required={false}
                parentRequired={true}
              />
            </Box>
          </>
        )}
        {!isAdd && record?.resellerId && (
          <>
            <Label>{useResellerLabel()}</Label>
            <ResellerIdSelect value={record?.resellerId} disabled />
          </>
        )}
        {!isAdd && record?.licenseeId && (
          <>
            <Label>
              <LicenseeTrans />
            </Label>
            <LicenseeIdSelect value={record?.licenseeId} disabled />
          </>
        )}
        {!isAdd && record?.brandId && (
          <>
            <Label>
              <PlatformTrans />
            </Label>
            <BrandIdSelect value={record?.brandId} disabled />
          </>
        )}
        <Label name="name" label={<DepartmentNameTrans />} />
        <Box>
          <Input name="name" required />
        </Box>
      </FieldValues>
    </Stack>
  )
}

export const EditButton = ({ id = "", record, onSubmitted, ...props }) => {
  let dialog = Modal.useState()
  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog}>
        <EditTrans />
      </Disclosure>
      {dialog.visible && (
        <EditDialog
          id={id}
          record={record}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const EditDialog = ({ id, record = {}, dialog, onSubmitted, ...props }) => {
  let title = useEditTrans()

  let [submitData, setSubmit] = useState()
  let { result, error, isLoading, mutate, deleteCache } = useEditDepartment(
    id,
    submitData
  )

  let userResellerId = useUserResellerId()
  let userLicenseeId = useUserLicenseeId()
  let userBrandId = useUserBrandId()

  const onSubmit = (data) => {
    let base = {
      resellerId: userResellerId,
      licenseeId: userLicenseeId,
      brandId: userBrandId
    }

    let formData = { ...base, ...data }
    setSubmit(formData)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={{ ...record }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={() => {
        reset()
        onSubmitted?.()
      }}
      title={title}
      dialog={dialog}
    >
      <EditBody record={record} />
    </FormDialog>
  )
}
