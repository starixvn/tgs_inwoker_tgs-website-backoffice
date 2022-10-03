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
  Icon,
  Spinner
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
import {
  useImportPlayerBatchAddBalance,
  usePlayerBatchAddBalanceList,
  useStartPlayerBatchAddBalance,
  useIsPlayerBatchAddBalanceEnd,
  usePlayerBatchAddBalanceResult
} from "./client"
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
//TODO: ImportSheetButton?
// import { read as readSpreadsheet, utils } from "xlsx"
import SequenceColumn from "../../table/column/sequence"
import { faFileExcel } from "@fortawesome/free-solid-svg-icons"
import {
  faFile,
  faSave,
  faArrowAltCircleDown
} from "@fortawesome/free-regular-svg-icons"
import Backdrop from "../../dialog/Backdrop"
import { connection } from "../../connection"
import { useMount, useUnmount } from "react-use"

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

//TODO: move to?
const SecondInMilliseconds = 1000

const confirmBatchDone = (result) => {
  if (result === true) {
    return true //done
  }

  if (result === null) {
    return true //no content
  }

  return false
}

const BatchAddDialog = ({ brandId, onSubmitted, dialog }) => {
  let [batchId, setBatchId] = useState()
  let [batchItems, setBatchItems] = useState()
  let [formData, setSubmit] = useState()
  let {
    result: isBatchStarted,
    isLoading: isLoadingBatchStarted,
    error: startBatchError,
    mutate: mutateStartBatch,
    deleteCache: deleteStartBatchCache
  } = useStartPlayerBatchAddBalance(brandId, batchId, formData)

  const resetStartBatch = () => {
    setBatchId(null)
    setSubmit(null)

    mutateStartBatch(null, false)
    deleteStartBatchCache()
  }

  let [isBatchDone, setBatchDone] = useState()

  useEffect(() => {
    let onNotify = ({ Type, BatchId, ...rest } = {}) => {
      console.log("onNotify Type", Type, "BatchId", BatchId, "rest", rest)
      if (Type === "BatchAdjustBalance") {
        setBatchDone(true)
      }
    }

    connection?.on("notify", onNotify)
    return () => {
      console.log("!!! connection off notify")
      connection?.off("notify", onNotify)
    }
  }, [isBatchStarted])

  useMount(() => {
    console.log("useMount")
  })

  useUnmount(() => {
    console.log("useUnmount")
  })

  //TODO: show alert after fail 3 times?
  let {
    result: isBatchEnded,
    isLoading: isLoadingBatchEnded,
    error: batchEndedError
  } = useIsPlayerBatchAddBalanceEnd(isBatchStarted && !isBatchDone && batchId, {
    refreshInterval: 10 * SecondInMilliseconds
  })

  let isLoading =
    isLoadingBatchStarted ||
    isLoadingBatchEnded ||
    (isBatchStarted && !isBatchDone)

  let title = useTrans({
    zh: "批量余额加分",
    en: "Batch Add Balance"
  })

  const onSubmit = ({ items, batchId, ...data } = {}) => {
    setBatchItems(items)
    setBatchId(batchId)
    setSubmit(data)
  }

  useEffect(() => {
    if (confirmBatchDone(isBatchEnded)) {
      setBatchDone(true)
    }
  }, [isBatchEnded])

  if (isLoading || isBatchDone) {
    return (
      <BatchResultDialog
        batchId={batchId}
        batchItems={batchItems}
        isProcessing={isLoading}
        dialog={dialog}
      />
    )
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
      error={startBatchError}
      onCloseErrorAlert={() => {
        resetStartBatch()
      }}
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

const BatchResultDialog = ({ batchId, batchItems, isProcessing, dialog }) => {
  let {
    isLoading,
    data: result,
    error
  } = usePlayerBatchAddBalanceResult(isProcessing === false && batchId)

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  let items = result?.map((item, index) => {
    return { ...batchItems[index], ...item }
  })

  let columns = useColumns({ items, showResult: true })
  return (
    <Backdrop {...dialog}>
      <Dialog.Modal
        hideBackdrop={true}
        hideOnClickOutside={false}
        footer={result && <CloseButtonFooter dialog={dialog} alignX="right" />}
        minWidth={items && "60vw"}
        maxWidth="95vw"
        {...dialog}
        css={css`
          & .bb-DialogContent {
            max-height: 65vh;
          }
          & .bb-DialogClose {
            z-index: 2;
          }
        `}
      >
        {(isLoading || isProcessing) && (
          <Set orientation="horizontal" alignX="center">
            <Trans zh="处理中" en="Processing" />
            <Spinner />
          </Set>
        )}
        {items && (
          <Table
            columns={columns}
            data={items}
            stickyHead
            containerProps={{
              maxHeight: "50vh",
              overflow: "auto"
            }}
          />
        )}
      </Dialog.Modal>
    </Backdrop>
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

//TODO: empty validation?
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

  let BatchIdField = "batchId"
  let batchId = useWatch({
    control,
    name: BatchIdField
  })

  let {
    result: importBatchResult,
    isLoading: isLoadingImportBatchResult,
    error: importBatchResultError,
    mutate: mutateImportBatchResult,
    deleteCache: deleteImportBatchResultCache
  } = useImportPlayerBatchAddBalance(brandId, formData)

  const resetImportBatch = () => {
    setFormData(null)
    deleteImportBatchResultCache()
    mutateImportBatchResult(null, false)
  }

  let {
    data: items,
    isLoading: isLoadingItems,
    error: itemsError,
    mutate: mutateItems,
    deleteCache: deleteItemsCache
  } = usePlayerBatchAddBalanceList(batchId)

  const resetItems = () => {
    deleteItemsCache()
    mutateItems(null, false)
  }

  //TODO: msg where?
  let maxErrorMsg = useTrans({
    zh: `必须小于或等于 ${MaxBatchAdd} 项`,
    en: `Must be less than or equal to ${MaxBatchAdd} items`
  })

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
    if (importBatchResult && !importBatchResultError) {
      setValue("batchId", importBatchResult)
    }
  }, [importBatchResult])

  useEffect(() => {
    if (items) {
      setValue(name, items)
    }
  }, [JSON.stringify(items)])

  let isLoading = isLoadingImportBatchResult || isLoadingItems
  return (
    <>
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
        <Box>
          <Button
            {...getRootProps({
              refKey: "elementRef"
            })}
            palette={palette}
            variant={variant}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <Trans zh="上传文件" en="Upload file" />
            <input {...getInputProps()} />
          </Button>
          <Input type="hidden" name={BatchIdField} value={batchId} />
        </Box>
      </FieldWrapper>
      {importBatchResultError && (
        <AlertDialog
          {...importBatchResultError}
          placement="center"
          onClickClose={resetImportBatch}
        />
      )}
      {itemsError && (
        <AlertDialog
          {...itemsError}
          placement="center"
          onClickClose={() => {
            resetImportBatch()
            resetItems()
          }}
        />
      )}
    </>
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

const useColumns = ({ items, showResult }) => {
  return useMemo(() => {
    let columns = [
      SequenceColumn({
        Footer: () => <Trans zh="总计" en="Total" />
      }),
      textColumn({
        accessor: "userName",
        Header: <Trans zh="用户名" en="Username" />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "adjustAmount",
        Header: <Trans zh="交易金额" en="Amount" />,
        sumColumn: "adjustAmount",
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        Header: <Trans zh="流水金额" en="Turnover Requirement Amount" />,
        sumColumn: "turnover",
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        disableSortBy: true
      })
    ]

    if (showResult) {
      columns.push(
        textColumn({
          accessor: "isSuccess",
          Header: <Trans zh="结果" en="Result" />,
          disableSortBy: true,
          Cell: ({ value: isSuccess }) => {
            return (
              <Text.Block color={isSuccess ? "success" : "warning"}>
                {isSuccess ? (
                  <Trans zh="成功" en="Success" />
                ) : (
                  <Trans zh="失败" en="Failed" />
                )}
              </Text.Block>
            )
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
