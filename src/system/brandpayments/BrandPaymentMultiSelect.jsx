import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Flex,
  Level,
  FieldStack
} from "bumbag"
import { useBrandPaymentList } from "./client"
import { Select, SelectField } from "../../select/Select"

//TODO: group by payment provider name, payment method or payment channel
//TODO: quick menu to select group field options
export const BrandPaymentMultiSelect = ({}) => {
  
}
