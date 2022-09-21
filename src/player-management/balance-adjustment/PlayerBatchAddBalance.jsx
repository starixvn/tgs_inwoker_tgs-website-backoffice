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
  FieldWrapper,
  Text,
  Link,
  Icon
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
import { useImportPlayerBatchAddBalance } from "./client"
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
import { Update, BatchAddBalance } from "./menu"
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
import SequenceColumn from "../../table/column/sequence"
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import {
  faFile,
  faSave,
  faArrowAltCircleDown
} from "@fortawesome/free-regular-svg-icons"
//TODO
// 1. download btn
export const PlayerBatchAddBalanceDisclosure = ({
  brandId,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([BatchAddBalance])
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
  //1. use
  let [formData, setSubmit] = useState()
  let { result, isLoading, error, mutate, deleteCache } = useFakeFetch(formData)

  let title = useTrans({
    zh: "批量余额加分",
    en: "Batch Add Balance"
  })

  const onSubmit = (data) => {
    console.log("onSubmit", data)
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
      maxWidth="95vw"
      css={css`
        & .bb-DialogContent {
          max-height: 75vh;
        }
        & .bb-DialogClose {
          z-index: 2;
        }
      `}
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

  return (
    <>
      <FieldStack margin="1rem">
        <FieldStack orientation="horizontal">
          <FieldWrapper label={<Trans zh="交易类型" en="Transaction Type" />}>
            <Set>
              <PlayerAdjustBalanceTypeSelect
                name={TransactionTypeField}
                required
              />
              {showIncludeInNetProfitSetting(transactionType) && (
                <Switch
                  name="includeInNetProfit"
                  label={<Trans zh="需算入净盈利" en="Include in Net Profit" />}
                />
              )}
            </Set>
          </FieldWrapper>
          <ImportBatchAddDataField />
        </FieldStack>
        <BatchAddTable />
      </FieldStack>
      <Input type="hidden" name="brandId" value={brandId} />
    </>
  )
}

//TODO: required validation
const ImportBatchAddDataField = ({ name = "items" }) => {
  let { control, setValue } = useFormContext()
  //TODO
  //2. set array list
  //3. show table
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, fieldState: { error }, formState }) => {
        let palette = error ? "danger" : "default"
        let variant = error ? "outlined" : "default"
        return <ImportBatchAddDataButton palette={palette} variant={variant} />
      }}
    />
  )
}

const DefaultMaxFiles = 1
const OneMBInBytes = 1048576
const DefaultMaxSize = OneMBInBytes * 10 //10MB
const MaxBatchAdd = 50
const ImportBatchAddDataButton = ({ name = "items", palette, variant }) => {
  let { setValue, control, getValues, clearErrors } = useFormContext()

  let brandId = getValues("brandId")
  let [formData, setFormData] = useState()
  let {
    result: batchId,
    isLoading: isLoadingBatchId,
    error: batchIdError,
    mutate: mutateBatchId,
    deleteCache: deleteBatchIdCache
  } = useImportPlayerBatchAddBalance(brandId, formData)

  //TODO: test limit > 50
  let maxErrorMsg = useTrans({
    zh: `必须小于或等于 ${MaxBatchAdd} 项`,
    en: `Must be less than or equal to ${MaxBatchAdd} items`
  })
  let [errors, setErrors] = useState([])

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
        /*
        file.arrayBuffer().then((data) => {
          let wb = readSpreadsheet(data)
          let [header, ...items] = utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[0]],
            {
              header: ["username", "amount", "bucketAmount", "remark"]
            }
          )

          if (items.length > MaxBatchAdd) {
            setErrors([maxErrorMsg])
          } else {
            clearErrors(name)
            setValue(name, items)
          }
        })
        */
      }
    }
  })

  useEffect(() => {
    if (batchId && !batchIdError) {
      //TODO: batch id
    }
    console.log("batchId", batchId)
  }, [batchId])

  //TODO: download excel with lang
  //TODO: test how to gen excel by code?
  return (
    <FieldWrapper
      label={
        <Text.Block>
          <Trans zh="汇入" en="Import" />
          <Link
            href="/api/batch-adj-balance"
            download="batch.xlsx"
            marginLeft="1rem"
          >
            <Trans zh="下载文件格式" en="Download Format File" />
          </Link>
        </Text.Block>
      }
    >
      <Button
        {...getRootProps({
          refKey: "elementRef"
        })}
        palette={palette}
        variant={variant}
      >
        <Trans zh="上传文件" en="Upload file" />
        <input {...getInputProps()} />
        {errors?.length > 0 && (
          <AlertDialog
            errors={errors}
            placement="center"
            onClickClose={() => {
              setErrors([])
            }}
          />
        )}
      </Button>
    </FieldWrapper>
  )
}

const BatchAddTable = ({ name = "items" }) => {
  let { setValue, control } = useFormContext()

  let items = useWatch({
    control,
    name
  })

  let columns = useColumns({ items })
  return (
    <>
      {items && (
        <Table
          columns={columns}
          data={items}
          foot={items?.length > 0}
          stickyHead
          containerProps={{
            maxHeight: "50vh",
            overflow: "auto"
          }}
        />
      )}
    </>
  )
}

const useColumns = ({ items }) => {
  return useMemo(() => {
    let columns = [
      SequenceColumn({
        Footer: () => <Trans zh="总计" en="Total" />
      }),
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="Username" />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="交易金额" en="Amount" />,
        sumColumn: "amount",
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bucketAmount",
        Header: <Trans zh="流水金额" en="Turnover Requirement Amount" />,
        sumColumn: "bucketAmount",
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
