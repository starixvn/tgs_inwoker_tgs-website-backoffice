import React, { useEffect } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  useModalState,
  FieldStack,
  Box,
  Text,
  Dialog,
  Modal,
  Heading,
  Link,
  Set,
  Card,
  Icon,
  useBreakpoint
} from "bumbag"
import {
  FormattedDateTime,
  FormattedNumberDecimal,
  getTrans,
  Trans,
  useLocale,
  useTrans
} from "../../i18n"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { View } from "./menu"
import { ViewDisclosure } from "../../dialog/Disclosure"
import { FormDialog } from "../../form/FormDialog"
import { useFundDepositForm } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import clone from "clone-deep"
import { useFormContext } from "react-hook-form"
import { FieldValues } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import { PaymentMethodLabel } from "../../payment/method/PaymentMethod"
import Separator from "../../layout/Separator"
import {
  FundDepositStatusLabel,
  isFundDepositApproved
} from "./FundDepositStatus"
import Textarea, { TextareaField } from "../../textarea"
import Input, { InputField } from "../../input/Input"
import { NumberInputField } from "../../input/NumberInput"
import { useFundDepositFormData } from "./useFundDepositFormData"
import {
  faChevronRight,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons"
import BankType from "../../payment/BankType"
import { PhoneTrans, RealNameTrans, UserNameTrans } from "../../trans/User"
import {
  BankAccountTrans,
  ActualDepositAmountTrans,
  BankInfoTrans,
  ChannelNameTrans,
  DepositAmountTrans,
  DepositPaymentMethodTrans,
  TransferFeeTrans
} from "../../trans/Payment"
import {
  GmsIdTrans,
  PlatformTrans,
  ThirdPartyIdTrans
} from "../../trans/Platform"
import { ApplicationTimeTrans, UpdatedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"
import { AttachmentTrans, CSNoteTrans } from "../../trans/Field"
import { PlayerNoteTrans, PlayerTrans } from "../../trans/Player"

export const ViewFundDepositDisclosure = ({
  brandId,
  formId,
  playerCode,
  onVisibleChange,
  ...props
}) => {
  let dialog = useModalState()

  useEffect(() => {
    onVisibleChange?.(dialog.visible)
  }, [dialog.visible])

  let isDisplay = useIsDisplayMenuByRoute([View])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <ViewDisclosure {...dialog} {...props} />
      {dialog.visible && (
        <ViewFundDepositDialog
          brandId={brandId}
          formId={formId}
          playerCode={playerCode}
          dialog={dialog}
        />
      )}
    </>
  )
}

const ViewFundDepositDialog = ({
  brandId,
  formId,
  playerCode,
  dialog,
  ...props
}) => {
  let title = useTrans({
    zh: "查看存款",
    en: "View Deposit"
  })

  let { depositForm, brandPayment, paymentMethod, player, isLoading, error } =
    useFundDepositFormData(brandId, formId, playerCode)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} {...dialog} />
  }

  return (
    <Dialog.Modal
      id="view-deposit-dialog"
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      {...dialog}
    >
      <FormBody
        record={depositForm}
        brandPayment={brandPayment}
        paymentMethod={paymentMethod}
        player={player}
        readOnly={true}
      />
    </Dialog.Modal>
  )
}

export const FormBody = ({
  brandId,
  record,
  brandPayment,
  paymentMethod,
  player,
  readOnly = false
}) => {
  let hasAttachment = !!record?.paymentReturn?.manualReceiptFileId
  let attachmentUrl = `/api/fs/${record?.paymentReturn?.manualReceiptFileId}`

  let disabled = readOnly
  return (
    <>
      <FieldStack>
        <FieldValues marginLeft="1.5rem">
          <NormalLabel>
            <UserNameTrans />
          </NormalLabel>
          <Box alignY="center">{record?.username}</Box>

          <PlayerBox player={player} />

          <NormalLabel>
            <GmsIdTrans />
          </NormalLabel>
          <Box alignY="center">{record?.orderNo}</Box>

          <NormalLabel>
            <Trans zh="订单号" en="Id" />
          </NormalLabel>
          <Box alignY="center">{record?.id}</Box>

          <NormalLabel>
            <ThirdPartyIdTrans />
          </NormalLabel>
          <Box alignY="center">{record?.thirdPartyOrderNo}</Box>

          <NormalLabel>
            <DepositPaymentMethodTrans />
          </NormalLabel>
          <Box alignY="center">
            <PaymentMethodLabel value={record?.paymentMethodId} />
          </Box>

          <NormalLabel>
            <ChannelNameTrans />
          </NormalLabel>
          <Box alignY="center">{record?.channelName}</Box>

          <NormalLabel>
            <DepositAmountTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedNumberDecimal value={record?.amount} />
          </Box>

          <TransferFeePercentageBox
            record={record}
            brandPayment={brandPayment}
          />

          <HandlingFeeBox record={record} brandPayment={brandPayment} />

          <AmountReceivedBox record={record} brandPayment={brandPayment} />

          <NormalLabel>
            <ApplicationTimeTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.createdOn} />
          </Box>

          <NormalLabel>
            <UpdatedTimeTrans />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.updatedOn} placeholder="-" />
          </Box>

          <NormalLabel>
            <StatusTrans />
          </NormalLabel>
          <Box alignY="center">
            <FundDepositStatusLabel
              value={record?.status}
              data-status={record?.status}
            />
          </Box>

          {hasAttachment && (
            <>
              <NormalLabel>
                <AttachmentTrans />
              </NormalLabel>
              <Box alignY="center">
                <Link href={attachmentUrl} target="_blank">
                  <Trans zh="连结" en="Link" />
                </Link>
              </Box>
            </>
          )}
          <CryptoApplyInfoBox record={record} />
          <SendNoteApplyInfoBox record={record} />
        </FieldValues>
        <Separator />
        <ApplyInfoBox
          applyInfo={record?.applyInfo}
          paymentMethod={paymentMethod}
        />
        <NumberInputField
          name="actualAmount"
          label={<ActualDepositAmountTrans />}
          value={readOnly ? record?.actualAmount ?? record?.amount : undefined}
          step="0.01"
          disabled={disabled}
        />
        <TextareaField
          name="remark"
          label={<CSNoteTrans />}
          value={record?.remark}
          disabled={disabled}
        />
      </FieldStack>
      <Input type="hidden" value={brandId} />
    </>
  )
}

const PlayerBox = ({ player }) => {
  if (!player) {
    return null
  }

  let playerRealname = player?.realName
  return (
    <>
      {playerRealname && (
        <>
          <NormalLabel>
            <RealNameTrans />
          </NormalLabel>
          <Box alignY="center">{playerRealname}</Box>
        </>
      )}
    </>
  )
}

const AmountReceivedBox = ({ record, brandPayment }) => {
  let handlingFeeRate = brandPayment?.handlingFeeRatePercentile
  if (!Number.isFinite(handlingFeeRate) || handlingFeeRate == 0) {
    return null
  }

  let status = record?.status
  if (!isFundDepositApproved(status)) {
    return null
  }

  let handlingFee = record?.handlingFee
  if (!Number.isFinite(handlingFee)) {
    return null
  }

  let actualAmount = record?.actualAmount ?? record?.amount
  if (!Number.isFinite(actualAmount)) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="实收金额" en="Amount Received" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumberDecimal value={actualAmount - handlingFee} />
      </Box>
    </>
  )
}

const TransferFeePercentageBox = ({ record, brandPayment }) => {
  let handlingFeeRate = brandPayment?.handlingFeeRatePercentile
  if (!Number.isFinite(handlingFeeRate) || handlingFeeRate == 0) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="手续费比例" en="Fee Ratio" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumberDecimal value={handlingFeeRate} postfix="%" />
      </Box>
    </>
  )
}

const HandlingFeeBox = ({ record, brandPayment }) => {
  let handlingFeeRate = brandPayment?.handlingFeeRatePercentile
  if (!Number.isFinite(handlingFeeRate) || handlingFeeRate == 0) {
    return null
  }

  let status = record?.status
  if (!isFundDepositApproved(status)) {
    return null
  }

  let handlingFee = record?.handlingFee
  if (!Number.isFinite(handlingFee)) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <TransferFeeTrans />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumberDecimal value={handlingFee} />
      </Box>
    </>
  )
}

const SendNoteApplyInfoBox = ({ record }) => {
  let sendNote = record?.applyInfo?.sendNote
  if (!sendNote) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <PlayerNoteTrans />
      </NormalLabel>
      <Box alignY="center">{sendNote}</Box>
    </>
  )
}

const CryptoApplyInfoBox = ({ record }) => {
  let address = record?.applyInfo?.address
  if (!address) {
    return null
  }

  let sendAmount = record?.applyInfo?.sendAmount
  let bankType = record?.applyInfo?.bankType?.toUpperCase?.() ?? ""
  return (
    <>
      <NormalLabel>
        <Trans zh="匯率" en="Exchange rate" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumberDecimal
          value={record?.applyInfo?.rate}
          digits={4}
          format="0,0.00[00]"
        />
      </Box>
      <NormalLabel>
        <Trans zh={bankType} en={bankType} />
      </NormalLabel>
      <Set alignY="center">
        <FormattedNumberDecimal value={sendAmount} />
      </Set>
      <NormalLabel>
        <Trans zh="钱包地址" en="Wallet Address" />
      </NormalLabel>
      <Box alignY="center">{address}</Box>
    </>
  )
}

const BankApplyInfo = ({ accountName = "", account = "" }) => {
  return (
    <>
      <NormalLabel>
        <Trans zh="银行帐户名" en="Bank Account Name" />
      </NormalLabel>
      <Box alignY="center">{accountName}</Box>
      <NormalLabel>
        <BankAccountTrans />
      </NormalLabel>
      <Box alignY="center">{account}</Box>
    </>
  )
}

const EMoneyNameApplyInfo = ({ value = "" }) => {
  return (
    <>
      <NormalLabel>
        <Trans zh="E-money name" en="E-money name" />
      </NormalLabel>
      <Box alignY="center">{value}</Box>
    </>
  )
}

const CoinsphNameApplyInfo = ({ value = "" }) => {
  return (
    <>
      <NormalLabel>
        <RealNameTrans />
      </NormalLabel>
      <Box alignY="center">{value}</Box>
    </>
  )
}

const PhoneApplyInfo = ({ value = "" }) => {
  return (
    <>
      <NormalLabel>
        <PhoneTrans />
      </NormalLabel>
      <Box alignY="center">{value}</Box>
    </>
  )
}

const PlayerApplyInfoCardBody = ({ applyInfo, bankType }) => {
  switch (bankType) {
    case BankType.Bank: //refer to ManualDeposit/ManualDepositBankApplyInfo.cs
      return (
        <>
          <BankApplyInfo
            accountName={applyInfo?.sendBankName}
            account={applyInfo?.sendBankAccount}
          />
        </>
      )
    case BankType.FPS: //refer to ManualDeposit/ManualDepositFpsApplyInfo.cs
      return (
        <>
          <BankApplyInfo
            accountName={applyInfo?.sendBankName}
            account={applyInfo?.sendBankAccount}
          />
        </>
      )
    case BankType.EWallet: //refer to ManualDeposit/ManualDepositEWalletApplyInfo.cs
      return (
        <>
          <EMoneyNameApplyInfo value={applyInfo?.sendEMoneyName} />
          <PhoneApplyInfo value={applyInfo?.sendPhone} />
        </>
      )
    case BankType.Pulsa: //refer to ManualDeposit/ManualDepositPulsaApplyInfo.cs
      return (
        <>
          <PhoneApplyInfo value={applyInfo?.sendPhone} />
        </>
      )
    case BankType.Coinsph:
      return (
        <>
          <CoinsphNameApplyInfo value={applyInfo?.sendName} />
          <PhoneApplyInfo value={applyInfo?.sendPhone} />
        </>
      )
    default:
      return null
  }
}

const PlayerApplyInfoCard = ({ applyInfo, bankType }) => {
  return (
    <Card
      variant="bordered"
      title={
        <Heading use="h5">
          <PlayerTrans />
        </Heading>
      }
      css={css`
        flex: 1;
      `}
    >
      <FieldValues>
        <PlayerApplyInfoCardBody applyInfo={applyInfo} bankType={bankType} />
      </FieldValues>
    </Card>
  )
}

const PlatformApplyInfoCardBody = ({ applyInfo, bankType }) => {
  switch (bankType) {
    case BankType.Bank:
      return (
        <BankApplyInfo
          accountName={applyInfo?.receiveAccountName}
          account={applyInfo?.receiveBankAccount}
        />
      )
    case BankType.FPS:
      return <PhoneApplyInfo value={applyInfo?.phone} />
    case BankType.EWallet:
      return (
        <>
          <EMoneyNameApplyInfo value={applyInfo?.eMoneyName} />
          <PhoneApplyInfo value={applyInfo?.phone} />
        </>
      )
    case BankType.Pulsa:
      return <PhoneApplyInfo value={applyInfo?.phone} />
    case BankType.Coinsph:
      return (
        <>
          <CoinsphNameApplyInfo value={applyInfo?.name} />
          <PhoneApplyInfo value={applyInfo?.phone} />
        </>
      )
    default:
      return null
  }
}

const PlatformApplyInfoCard = ({ applyInfo, bankType }) => {
  return (
    <Card
      variant="bordered"
      title={
        <Heading use="h5">
          <PlatformTrans />
        </Heading>
      }
      css={css`
        flex: 1;
      `}
    >
      <FieldValues>
        <PlatformApplyInfoCardBody applyInfo={applyInfo} bankType={bankType} />
      </FieldValues>
    </Card>
  )
}

let applyInfoSupportedBankType = [
  BankType.Bank,
  BankType.FPS,
  BankType.EWallet,
  BankType.Pulsa,
  BankType.Coinsph
]
const ApplyInfoBox = ({ applyInfo, paymentMethod }) => {
  let bankType = paymentMethod?.bankType
  let isTablet = useBreakpoint("max-tablet")

  let isSupported = applyInfoSupportedBankType.includes(bankType)
  if (!isSupported) {
    return null
  }

  return (
    <>
      <Heading use="h6">
        <BankInfoTrans />
      </Heading>
      <Set orientation="horizontal" isFilled verticalBelow="tablet">
        <PlayerApplyInfoCard
          applyInfo={applyInfo}
          bankType={bankType}
          flex="1"
        />
        <Box alignX="center" alignY="center">
          <Icon
            icon={isTablet ? faChevronDown : faChevronRight}
            type="font-awesome"
          />
        </Box>
        <PlatformApplyInfoCard
          applyInfo={applyInfo}
          bankType={bankType}
          flex="1"
        />
      </Set>
    </>
  )
}
