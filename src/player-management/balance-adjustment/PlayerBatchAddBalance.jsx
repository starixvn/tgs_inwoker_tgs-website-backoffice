import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Dialog,
  useModalState,
  Stack,
  Heading,
  Button,
  Box,
  Set,
  FieldStack,
  FieldWrapper
} from "bumbag"
import { useIsDisplayMenuByRoute } from "../../user/context"
import Disclosure, { AddDisclosure } from "../../dialog/Disclosure"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import {
  CloseButtonFooter,
  ConfirmButtonFooter,
  ConfirmCancelFooter
} from "../../form/ConfirmButtonFooter"
import { Table, toApiParams, useTable, pageCount } from "../../table"
import { usePlayerAdjustIncreaseBalance } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import dateTimeColumn from "../../table/column/dateTime"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { formatDateTime } from "../../date/format"
import { FieldValues } from "../../layout/Grid"
import { formatNumberDecimal } from "../../number/format"
import Separator from "../../layout/Separator"
import { Update } from "./menu"
import FormDialog from "../../form/FormDialog"
import { useFormContext, useWatch, Controller } from "react-hook-form"
import Input from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import {
  PlayerAdjustBalanceTypeSelect,
  showIncludeInNetProfitSetting
} from "./PlayerAdjustBalanceType"
import { Switch } from "../../switch/Switch"
import { useDropzone } from "react-dropzone"
//TODO: use api instead of read file?
import { read as readSpreadsheet, utils } from "xlsx"
import { useBrandPaymentUpload } from "../../system/brandpayments/client"
//TODO
// 1. download btn
export const PlayerBatchAddBalanceDisclosure = ({
  brandId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  //TODO: batch add auth
  let isDisplay = useIsDisplayMenuByRoute([Update])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="批量加钱" en="Batch Add Balance" />
      </Disclosure>
      {dialog.visible && (
        <BatchAddDialog
          brandId={brandId}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const useFakeFetch = () => {
  return {
    isLoading: false,
    result: undefined,
    error: undefined,
    mutate: () => {},
    deleteCache: () => {}
  }
}

const BatchAddDialog = ({ brandId, onSubmitted, dialog }) => {
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useFakeFetch(formData)

  let title = useTrans({
    zh: "批量余额加分",
    en: "Batch Add Balance"
  })

  const onSubmit = (data) => {
    setSubmit(data)
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(undefined)
  }
  return (
    <FormDialog
      id="batch-add-balance-dialog"
      defaultValues={{
        brandId,
        transactionType: null
      }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      onSubmitted={onSubmitted}
      title={title}
      dialog={dialog}
      minWidth="60vw"
    >
      <FormBody />
    </FormDialog>
  )
}

const FormBody = ({}) => {
  let { control, getValues } = useFormContext()

  let brandId = getValues("brandId")

  let TransactionTypeField = "transactionType"
  let transactionType = useWatch({
    control,
    name: TransactionTypeField
  })

  let TransactionAmountField = "amount"
  let transactionAmount = useWatch({
    control,
    name: TransactionAmountField
  })

  let hasTransactionAmount = !!transactionAmount

  //TODO: upload btn?
  return (
    <>
      <FieldStack margin="1rem">
        <FieldWrapper label={<Trans zh="交易类型" en="Transaction Type" />}>
          <Set>
            <PlayerAdjustBalanceTypeSelect
              name={TransactionTypeField}
              required={hasTransactionAmount}
            />
            {showIncludeInNetProfitSetting(transactionType) && (
              <Switch
                name="includeInNetProfit"
                label={<Trans zh="需算入净盈利" en="Include in Net Profit" />}
              />
            )}
          </Set>
        </FieldWrapper>
        <BatchAdjustTable />
        {/* 
        TODO: rm
        <Box alignY="center">
          <Trans zh="交易金额" en="Amount" />
        </Box>
        <NumberInputField name={TransactionAmountField} min="0" step="0.01" />

        <Box alignY="center">
          <Trans zh="流水金额" en="Turnover Requirement Amount" />
        </Box>
        <NumberInputField name="bucketAmount" min="0" step="0.01" />

        <Box alignY="center">
          <Trans zh="备注" en="Remark" />
        </Box>
        <Input name="remark" /> 
        */}
      </FieldStack>
      <Input type="hidden" name="brandId" value={brandId} />
    </>
  )
}

const BatchAdjustTable = ({ name = "items" }) => {
  let { control, setValue } = useFormContext()
  //TODO
  //2. set array list
  //3. show table

  //TODO: useWatch or useFieldArray?
  let items = useWatch({
    control,
    name
  })
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        return (
          <FieldStack>
            <BatchAdjustTableMenuBar />
          </FieldStack>
        )
      }}
    />
  )
}

const DefaultMaxFiles = 1
const OneMBInBytes = 1048576
const DefaultMaxSize = OneMBInBytes * 10 //10MB

const BatchAdjustTableMenuBar = ({ name = "items" }) => {
  let { setValue, control } = useFormContext()
  let [formData, setFormData] = useState()

  //TODO: api integration
  let { result, isLoading, error, clearCache, deleteCache } =
    useBrandPaymentUpload(formData)

  let { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx",
    maxFiles: DefaultMaxFiles,
    maxSize: DefaultMaxSize,
    onDrop: (files = []) => {
      let [file] = files
      if (file) {
        let formData = new FormData()
        formData.append("file", file, file.name)
        setFormData(formData)

        //TODO: rm?
        file.arrayBuffer().then((data) => {
          let wb = readSpreadsheet(data)
          let result = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          //console.log("result", result)
        })
      }
    }
  })

  useEffect(() => {
    if (Array.isArray(result?.players) && !error) {
      //TODO: remove result?.players?.map
      setValue(
        name,
        result?.players?.map((username) => {
          return { username }
        })
      )
    }
  }, [result])

  let items = useWatch({
    control,
    name
  })

  let columns = useColumns({ items })
  return (
    <>
      <Set orientation="horizontal">
        <Button
          {...getRootProps({
            refKey: "elementRef"
          })}
        >
          TODO: Select File
          <input {...getInputProps()} />
        </Button>
        <Button
          use="a"
          href="/download/payments/list.xlsx"
          download="batch.xlsx"
          palette="primary"
          size="small"
        >
          <Trans zh="格式" en="Format" />
        </Button>
      </Set>
      {items && <Table columns={columns} data={items} />}
    </>
  )
}

const useColumns = ({ items }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="Username" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="交易金额" en="Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bucketAmount",
        Header: <Trans zh="流水金额" en="Turnover Requirement Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ]
    return columns
  }, [JSON.stringify(items)])
}
