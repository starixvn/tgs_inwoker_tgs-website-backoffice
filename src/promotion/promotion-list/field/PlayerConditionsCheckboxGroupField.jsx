import React, { useState, useEffect, useMemo } from "react"
import { css } from "@emotion/react"
import { Box, Text, Button, Set, Icon } from "bumbag"
import { useFormContext, useWatch } from "react-hook-form"
import { NormalLabel } from "../../../form/Label"
import { CheckboxGroup } from "../../../checkbox"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import {
  useBirthdayTrans,
  usePhoneTrans,
  useRealNameTrans
} from "../../../trans/User"
import { PromotionEligibilityTrans } from "../../../trans/Promotion"
import { SelectAllTrans } from "../../../trans/Action"

export const PlayerConditionsCheckboxGroupField = ({
  name = "rule.playerConditions",
  readOnly
}) => {
  const Type = {
    Birthdate: "Birthdate",
    RealName: "RealName",
    Phone: "Phone"
  }

  const { setValue } = useFormContext()

  let options = [
    {
      label: useBirthdayTrans(),
      value: Type.Birthdate
    },
    {
      label: useRealNameTrans(),
      value: Type.RealName
    },
    {
      label: usePhoneTrans(),
      value: Type.Phone
    }
  ]

  let disabled = readOnly
  return (
    <>
      <NormalLabel>
        <PromotionEligibilityTrans />
      </NormalLabel>
      <Set alignY="center">
        {!disabled && (
          <Button
            onClick={() => {
              setValue(name, Object.values(Type))
            }}
            size="small"
            variant="ghost"
          >
            <Icon icon={faCheck} type="font-awesome" />
            <SelectAllTrans />
          </Button>
        )}
        <CheckboxGroup
          name={name}
          options={options}
          disabled={disabled}
          orientation="horizontal"
          id="playerConditions"
        />
      </Set>
    </>
  )
}
