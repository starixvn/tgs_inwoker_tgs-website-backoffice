import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Group, Spinner, FieldWrapper, Button, DropdownMenu, Set } from "bumbag"
import { GeneralMessengerTypeSelect } from "./GeneralMessengerTypeSelect"
import { Input } from "../../input/Input"
import { FormattedNumber, Trans, useTrans } from "../../i18n"
import { useFormContext, useWatch } from "react-hook-form"

const General = "General"
const GeneralTrans = {
  zh: "一般",
  en: "General"
}

const Custom = "Custom"
const CustomTrans = {
  zh: "客制",
  en: "Custom"
}

export const CommunicationType = {
  General,
  Custom
}

const CommunicationTypeFieldName = "communicationType"
const TypeFieldName = "type"
export const CommunicationTypeField = () => {
  let { control, setValue } = useFormContext()
  let communicationType = useWatch({
    control,
    name: CommunicationTypeFieldName
  })

  let placeholder = useTrans({
    zh: "通讯软体",
    en: "Messenger"
  })

  return (
    <Set>
      <DropdownMenu
        menu={
          <>
            {communicationType != General && (
              <DropdownMenu.Item
                onClick={() => {
                  setValue(CommunicationTypeFieldName, General)
                  setValue(TypeFieldName, "")
                }}
              >
                <Trans {...GeneralTrans} />
              </DropdownMenu.Item>
            )}
            {communicationType != Custom && (
              <DropdownMenu.Item
                onClick={() => {
                  setValue(CommunicationTypeFieldName, Custom)
                  setValue(TypeFieldName, "")
                }}
              >
                <Trans {...CustomTrans} />
              </DropdownMenu.Item>
            )}
          </>
        }
      >
        <Button iconAfter="chevron-down" width="max-content">
          {communicationType == General && <Trans {...GeneralTrans} />}
          {communicationType == Custom && <Trans {...CustomTrans} />}
        </Button>
      </DropdownMenu>
      {communicationType == General && (
        <GeneralMessengerTypeSelect name={TypeFieldName} />
      )}
      {communicationType == Custom && (
        <Input name={TypeFieldName} placeholder={placeholder} />
      )}
    </Set>
  )
}
