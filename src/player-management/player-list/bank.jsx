import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Icon,
  Spinner,
  Stack,
  Flex,
  Box,
  Card as _Card,
  Set,
  Button,
  Text,
  Label,
  Dialog,
  Table,
  useModalState,
  FieldStack,
  Switch
} from "bumbag"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { Trans, FormattedDateTime, FormattedNumber } from "../../i18n"
import { faMinus, faCog, faPlus } from "@fortawesome/free-solid-svg-icons"
import {
  useEditPlayerBank,
  useDeletePlayerBank,
  useAddPlayerBank,
  useSetDefaultPlayerBank,
  usePlayerBankList
} from "./client"
import AlertDialog from "../../dialog/Alert"
import Backdrop from "../../dialog/Backdrop"
import { Tab as _Tab, TabPanel } from "../../tab"
import Disclosure from "../../dialog/Disclosure"
import { Modal } from "../../dialog/Modal"
import Input from "../../input/Input"
import FormDialog from "../../form/FormDialog"
import {
  PaymentChannelLabel,
  PaymentChannelSelect
} from "../../payment/channel/PaymentChannel"
import { BrandPaymentMethodBankTypeSelect } from "../../payment/method/BrandPaymentMethodBankType"
import { useFormContext, useWatch } from "react-hook-form"
import { useBrandPaymentList } from "../../system/brandpayments/client"
import BrandPaymentTransferType from "../../system/brandpayments/BrandPaymentTransferType"
import clone from "clone-deep"
import { PhoneTrans, RealNameTrans } from "../../trans/User"
import {
  BankInfoTrans,
  BankAccountTrans,
  PaymentChannelTrans
} from "../../trans/Payment"
import { CancelTrans, OperatorTrans, SubmitTrans } from "../../trans/Action"
import { isDev } from "../../env"
import { UpdatedTimeTrans } from "../../trans/Date"

export const Key = "banks"

export const Tab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <BankInfoTrans />
    </_Tab>
  )
}

export const Panel = ({ brandId, playerCode, edit = false, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let { isLoading, data, error, mutate } = usePlayerBankList(
    isActive && playerCode
  )
  let banks = data?.items

  return (
    <TabPanel tabId={Key} {...props}>
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      <TwoColumns>
        {banks?.map((bank, index) => (
          <Bank
            key={index}
            brandId={brandId}
            playerCode={playerCode}
            record={bank}
            onSubmitted={mutate}
            edit={edit}
          />
        ))}
      </TwoColumns>
      {edit && (
        <AddBank
          brandId={brandId}
          playerCode={playerCode}
          onSubmitted={mutate}
        />
      )}
      {error && <AlertDialog {...error} onClickClose={mutate} />}
    </TabPanel>
  )
}

const IsDefaultSwitch = ({
  label = <Trans zh="預設" en="Default" />,
  ...props
}) => {
  return (
    <Switch
      label={label}
      css={css`
        pointer-events: none;
      `}
      {...props}
    />
  )
}

const UpdateInfoBox = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <OperatorTrans />
      </Box>
      <Box alignY="center">{record?.modifier}</Box>
      <Box alignY="center">
        <UpdatedTimeTrans />
      </Box>
      <Box alignY="center">
        <FormattedDateTime value={record?.updatedOn} />
      </Box>
    </>
  )
}

const Bank = ({
  brandId,
  playerCode,
  record = {},
  edit = false,
  onSubmitted
}) => {
  let { bankType = "", isDefault } = record
  let deleteDialog = useModalState()
  let editDialog = useModalState()
  let setDefaultDialog = useModalState()

  return (
    <Card data-field="bank-id" data-value={record.id}>
      <Set alignX="right">
        {edit && (
          <>
            <Disclosure
              id="delete-bank-dialog-disclosure"
              palette="danger"
              variant="outlined"
              {...deleteDialog}
            >
              <Icon icon={faMinus} fontSize="300" type="font-awesome" />
            </Disclosure>
            {deleteDialog.visible && (
              <DeleteDialog
                playerCode={playerCode}
                bank={record}
                onSubmitted={onSubmitted}
                dialog={deleteDialog}
              />
            )}
            <Disclosure id="edit-bank-dialog-disclosure" {...editDialog}>
              <Icon icon={faCog} fontSize="300" type="font-awesome" />
            </Disclosure>
            {editDialog.visible && (
              <EditDialog
                brandId={brandId}
                playerCode={playerCode}
                record={record}
                onSubmitted={onSubmitted}
                dialog={editDialog}
              />
            )}

            <Disclosure
              id="set-default-dialog-disclosure"
              disabled={isDefault}
              {...setDefaultDialog}
            >
              <IsDefaultSwitch checked={isDefault} />
            </Disclosure>

            {setDefaultDialog.visible && (
              <SetDefaultDialog
                brandId={brandId}
                playerCode={playerCode}
                bank={record}
                onSubmitted={onSubmitted}
                dialog={setDefaultDialog}
              />
            )}
          </>
        )}
        {!edit && <IsDefaultSwitch checked={isDefault} />}
      </Set>
      <FieldValues>
        <Box alignY="center">
          <PaymentChannelTrans />
        </Box>
        <PaymentChannelLabel value={record?.paymentChannelId} />

        <ViewBox record={record} />
        <UpdateInfoBox record={record} />
      </FieldValues>
    </Card>
  )
}

//TODOL: move bank type to payment?
export const BankType = {
  Bank: "Bank",
  Crypto: "Crypto",
  Usdt: "Usdt",
  ThirdParty: "ThirdParty",
  FPS: "FPS",
  EWallet: "EWallet",
  Pulsa: "Pulsa"
}

const ViewBox = ({ record }) => {
  let { bankType = "" } = record
  switch (bankType) {
    case BankType.Bank:
      return <ViewBank record={record} />
    case BankType.Crypto:
    case BankType.Usdt:
      return <ViewCrypto record={record} />
    case BankType.ThirdParty:
    case BankType.FPS:
      return <ViewThirdParty record={record} />
    case BankType.EWallet:
      return <ViewEWallet record={record} />
    case BankType.Pulsa:
      return <ViewPulsa record={record} />
    default:
      return null
  }
}

const ViewBank = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <BankNameLabel />
      </Box>
      <Box alignY="center" data-field="bankName">
        {record?.detail?.bankName ?? ""}
      </Box>

      <Box alignY="center">
        <BankBranchLabel />
      </Box>
      <Box alignY="center" data-field="bankBranch">
        {record?.detail?.bankBranch ?? ""}
      </Box>

      <Box alignY="center">
        <AccountName />
      </Box>
      <Box alignY="center" data-field="name">
        {record?.detail?.name ?? ""}
      </Box>

      <Box alignY="center">
        <BankAccount />
      </Box>
      <Box alignY="center" data-field="bankAccount">
        {record?.detail?.bankAccount ?? ""}
      </Box>

      <Box alignY="center">IFSC Code</Box>
      <Box alignY="center" data-field="IFSCcode">
        {record?.detail?.IFSCcode ?? ""}
      </Box>
    </>
  )
}

const ViewCrypto = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <Trans zh="钱包地址" en="Wallet address" />
      </Box>
      <Box alignY="center">{record?.detail?.address ?? ""}</Box>
    </>
  )
}

const ViewThirdParty = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <RealNameLabel />
      </Box>
      <Box alignY="center" data-field="username">
        {record?.detail?.username ?? ""}
      </Box>

      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box alignY="center" data-field="phone">
        {record?.detail?.phone ?? ""}
      </Box>
    </>
  )
}

const ViewEWallet = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <EWalletLabel />
      </Box>
      <Box alignY="center" data-field="eMoneyName">
        {record?.detail?.eMoneyName ?? ""}
      </Box>

      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box alignY="center" data-field="phone">
        {record?.detail?.phone ?? ""}
      </Box>
    </>
  )
}

const ViewPulsa = ({ record }) => {
  return (
    <>
      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box alignY="center" data-field="phone">
        {record?.detail?.phone ?? ""}
      </Box>
    </>
  )
}

const AddBank = ({ brandId, playerCode, onSubmitted }) => {
  let dialog = useModalState()
  return (
    <>
      <TwoColumns>
        <Card alignX="center">
          <Disclosure id="add-bank-dialog-disclosure" {...dialog}>
            <Icon icon={faPlus} fontSize="300" type="font-awesome" />
          </Disclosure>
        </Card>
      </TwoColumns>
      {dialog.visible && (
        <AddDialog
          brandId={brandId}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const Card = ({ children, ...props }) => (
  <_Card
    variant="bordered"
    margin="major-1"
    css={css`
      flex: 1 50%;
    `}
    {...props}
  >
    {children}
  </_Card>
)

const PaymentBankTypeTrans = () => <Trans zh="支付类型" en="Payment Type" />

const BankNameLabel = () => <Trans zh="银行" en="Bank" />

const BankBranchLabel = () => <Trans zh="银行分行" en="Bank Branch" />

const AccountName = () => <Trans zh="帐号名称" en="Account Name" />

const BankAccount = () => <BankAccountTrans />

const RealNameLabel = () => <RealNameTrans />

const PhoneLabel = () => <PhoneTrans />

const EWalletLabel = () => <Trans zh="E-money Name" en="E-money Name" />

const AddDialog = ({ brandId, playerCode, onSubmitted, dialog }) => {
  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, deleteCache, mutate } = useAddPlayerBank(
    playerCode,
    submitData
  )

  const onSubmit = (data = {}) => {
    setSubmit({
      brandId,
      ...data
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="add-bank-dialog"
        defaultValues={{
          detail: {}
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
        dialog={dialog}
      >
        <EditBody brandId={brandId} />
      </FormDialog>
    </Backdrop>
  )
}

const EditDialog = ({ brandId, playerCode, record, onSubmitted, dialog }) => {
  let [submitData, setSubmit] = useState()
  let { result, isLoading, error, deleteCache, mutate } = useEditPlayerBank(
    {
      playerCode,
      id: record?.id
    },
    submitData
  )

  const onSubmit = (data = {}) => {
    setSubmit({
      brandId,
      ...data
    })
  }

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setSubmit(null)
  }

  return (
    <Backdrop {...dialog}>
      <FormDialog
        id="edit-bank-dialog"
        defaultValues={clone(record)}
        onSubmit={onSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        onCloseErrorAlert={reset}
        onSubmitted={() => {
          reset()
          onSubmitted?.()
        }}
        dialog={dialog}
      >
        <EditBody brandId={brandId} />
      </FormDialog>
    </Backdrop>
  )
}

const EditBody = ({ brandId }) => {
  let {
    isLoading: isLoadingBrandPaymentList,
    data,
    error
  } = useBrandPaymentList({
    brandId,
    transferType: BrandPaymentTransferType.Withdrawal,
    showAll: true
  })
  let { watch } = useFormContext()

  let BankTypeFieldName = "bankType"
  let bankType = watch(BankTypeFieldName)
  let paymentChannelIdRange = data?.items
    ?.filter((item) => item.bankType === bankType)
    ?.map(({ paymentChannelId }) => paymentChannelId)

  return (
    <FieldValues>
      <Box alignY="center">
        <PaymentBankTypeTrans />
      </Box>
      <BrandPaymentMethodBankTypeSelect name={BankTypeFieldName} />

      <Box alignY="center">
        <PaymentChannelTrans />
      </Box>
      <PaymentChannelSelect
        name="paymentChannelId"
        isLoadingRange={isLoadingBrandPaymentList}
        range={paymentChannelIdRange}
        required
      />

      <EditBox bankType={bankType} />
    </FieldValues>
  )
}

const EditBox = ({ bankType }) => {
  switch (bankType) {
    case BankType.Bank:
      return <EditBank />
    case BankType.Crypto:
    case BankType.Usdt:
      return <EditCrypto />
    case BankType.ThirdParty:
    case BankType.FPS:
      return <EditThirdParty />
    case BankType.EWallet:
      return <EditEWallet />
    case BankType.Pulsa:
      return <EditPulsa />
    default:
      return null
  }
}

const EditBank = ({}) => {
  return (
    <>
      <Box alignY="center">
        <BankNameLabel />
      </Box>
      <Box alignY="center">
        <Input name="detail.bankName" />
      </Box>

      <Box alignY="center">
        <BankBranchLabel />
      </Box>
      <Box alignY="center">
        <Input name="detail.bankBranch" />
      </Box>

      <Box alignY="center">
        <AccountName />
      </Box>
      <Box>
        <Input name="detail.name" />
      </Box>

      <Box alignY="center">
        <BankAccount />
      </Box>
      <Box>
        <Input name="detail.bankAccount" />
      </Box>

      <Box alignY="center">IFSC code</Box>
      <Box>
        <Input name="detail.IFSCcode" />
      </Box>
    </>
  )
}

const EditCrypto = ({}) => {
  return (
    <>
      <Trans zh="钱包地址" en="Wallet address" />
      <Box>
        <Input name="detail.address" />
      </Box>
    </>
  )
}

const EditThirdParty = ({}) => {
  return (
    <>
      <Box alignY="center">
        <RealNameLabel />
      </Box>
      <Box>
        <Input name="detail.username" />
      </Box>

      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box>
        <Input name="detail.phone" />
      </Box>
    </>
  )
}

const EditEWallet = ({}) => {
  return (
    <>
      <Box alignY="center">
        <EWalletLabel />
      </Box>
      <Box>
        <Input name="detail.eMoneyName" />
      </Box>

      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box>
        <Input name="detail.phone" />
      </Box>
    </>
  )
}

const EditPulsa = ({}) => {
  return (
    <>
      <Box alignY="center">
        <PhoneLabel />
      </Box>
      <Box>
        <Input name="detail.phone" />
      </Box>
    </>
  )
}

const DeleteDialog = ({ playerCode, bank, onSubmitted, dialog }) => {
  let [id, setDeleteId] = useState()
  let { result, isLoading, error, deleteCache, mutate } = useDeletePlayerBank(
    playerCode,
    id
  )
  useEffect(() => {
    if (result && !error) {
      onSubmitted?.()
      dialog.hide()
    }
  }, [result, error])

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setDeleteId(undefined)
  }

  return (
    <Modal
      id="delete-bank-dialog"
      showActionButtons
      actionButtonsProps={{
        isLoading,
        onClickSubmit: () => setDeleteId(bank.id),
        onClickCancel: dialog.hide,
        cancelText: <CancelTrans />,
        submitText: <SubmitTrans />
      }}
      {...dialog}
    >
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <Box
        data-field="bank-id"
        data-value={bank.id}
        alignX="center"
        margin="major-1"
      >
        <Trans zh="是否删除此银行卡？" en="Do you want to delete this card?" />
      </Box>
    </Modal>
  )
}

const SetDefaultDialog = ({ playerCode, bank, onSubmitted, dialog }) => {
  let [id, setId] = useState()
  let { result, isLoading, error, deleteCache, mutate } =
    useSetDefaultPlayerBank(playerCode, id)

  const reset = () => {
    deleteCache()
    mutate(undefined, false)
    setId(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
      dialog.hide()
    }
  }, [result, error])

  return (
    <Modal
      id="set-default-bank-dialog"
      showActionButtons
      actionButtonsProps={{
        isLoading,
        onClickSubmit: () => setId(bank.id),
        onClickCancel: dialog.hide,
        cancelText: <CancelTrans />,
        submitText: <SubmitTrans />
      }}
      {...dialog}
    >
      {error && <AlertDialog {...error} onClickClose={reset} />}
      <Box
        data-field="bank-id"
        data-value={bank.id}
        alignX="center"
        margin="major-1"
      >
        <Trans
          zh="請確認是否將此卡，設定為預設提款銀行卡?？"
          en="Set this card as default?"
        />
      </Box>
    </Modal>
  )
}
