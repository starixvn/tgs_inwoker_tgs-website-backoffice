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

  let { depositForm, brandPayment, player, isLoading, error } =
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
            <Trans zh="用户名" en="Username" />
          </NormalLabel>
          <Box alignY="center">{record?.userName}</Box>

          <PlayerBox player={player} />

          <NormalLabel>
            <Trans zh="GMS订单号" en="GMS Id" />
          </NormalLabel>
          <Box alignY="center">{record?.orderNo}</Box>

          <NormalLabel>
            <Trans zh="订单号" en="Id" />
          </NormalLabel>
          <Box alignY="center">{record?.id}</Box>

          <NormalLabel>
            <Trans zh="三方订单号" en="3rd Party Id" />
          </NormalLabel>
          <Box alignY="center">{record?.thirdPartyOrderNo}</Box>

          <NormalLabel>
            <Trans zh="存款类型 " en="Payment Method" />
          </NormalLabel>
          <Box alignY="center">
            <PaymentMethodLabel value={record?.paymentMethodId} />
          </Box>

          <NormalLabel>
            <Trans zh="通道名称" en="Channel Name" />
          </NormalLabel>
          <Box alignY="center">{record?.channelName}</Box>

          <NormalLabel>
            <Trans zh="存款金额" en="Deposit Amount" />
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
            <Trans zh="申请时间" en="Application Time" />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.createdOn} />
          </Box>

          <NormalLabel>
            <Trans zh="更新时间" en="Updated Time" />
          </NormalLabel>
          <Box alignY="center">
            <FormattedDateTime value={record?.updatedOn} placeholder="-" />
          </Box>

          <NormalLabel>
            <Trans zh="状态" en="Status" />
          </NormalLabel>
          <Box alignY="center">
            <FundDepositStatusLabel value={record?.status} />
          </Box>

          {hasAttachment && (
            <>
              <NormalLabel>
                <Trans zh="附件" en="Attachment" />
              </NormalLabel>
              <Box alignY="center">
                <Link href={attachmentUrl} target="_blank">
                  <Trans zh="连结" en="Link" />
                </Link>
              </Box>
            </>
          )}
          {/* 
          TODO: rm
          <PhoneApplyInfoBox record={record} />
          <EMoneyNameApplyInfoBox record={record} /> 
          */}
          <CryptoApplyInfoBox record={record} />
          <SendNoteApplyInfoBox record={record} />
        </FieldValues>
        <Separator />
        <ApplyInfoBox applyInfo={record?.applyInfo} />
        <NumberInputField
          name="actualAmount"
          label={<Trans zh="实际存款金额" en="Actual Amount" />}
          value={readOnly ? record?.actualAmount ?? record?.amount : undefined}
          step="0.01"
          disabled={disabled}
        />
        <TextareaField
          name="remark"
          label={<Trans zh="客服备註" en="CS Note" />}
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
            <Trans zh="真实姓名" en="Real name" />
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
        <Trans zh="手续费" en="Transfer Fee" />
      </NormalLabel>
      <Box alignY="center">
        <FormattedNumberDecimal value={handlingFee} />
      </Box>
    </>
  )
}

/*
TODO: rm
const PhoneApplyInfoBox = ({ record }) => {
  let phone = record?.applyInfo?.phone
  if (!phone) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="电话号码" en="Phone" />
      </NormalLabel>
      <Box alignY="center">{phone}</Box>
    </>
  )
}

//TODO: rm
const EMoneyNameApplyInfoBox = ({ record }) => {
  let eMoneyName = record?.applyInfo?.sendEMoneyName
  if (!eMoneyName) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="E-money name" en="E-money name" />
      </NormalLabel>
      <Box alignY="center">{eMoneyName}</Box>
    </>
  )
}
*/

const SendNoteApplyInfoBox = ({ record }) => {
  let sendNote = record?.applyInfo?.sendNote
  if (!sendNote) {
    return null
  }

  return (
    <>
      <NormalLabel>
        <Trans zh="玩家备註" en="Player Note" />
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
        <Trans zh="银行卡帐号" en="Bank Card Account" />
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

const PhoneApplyInfo = ({ value = "" }) => {
  return (
    <>
      <NormalLabel>
        <Trans zh="电话号码" en="Phone" />
      </NormalLabel>
      <Box alignY="center">{value}</Box>
    </>
  )
}

const PlayerApplyInfoCardBody = ({ applyInfo }) => {
  let bankType = applyInfo?.bankType
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
    default:
      return null
  }
}

const PlayerApplyInfoCard = ({ applyInfo }) => {
  return (
    <Card
      variant="bordered"
      title={
        <Heading use="h5">
          <Trans zh="玩家" en="Player" />
        </Heading>
      }
      css={css`
        flex: 1;
      `}
    >
      <FieldValues>
        <PlayerApplyInfoCardBody applyInfo={applyInfo} />
      </FieldValues>
    </Card>
  )
}

const PlatformApplyInfoCardBody = ({ applyInfo }) => {
  let bankType = applyInfo?.bankType
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
    default:
      return null
  }
}

const PlatformApplyInfoCard = ({ applyInfo }) => {
  return (
    <Card
      variant="bordered"
      title={
        <Heading use="h5">
          <Trans zh="平台" en="Platform" />
        </Heading>
      }
      css={css`
        flex: 1;
      `}
    >
      <FieldValues>
        <PlatformApplyInfoCardBody applyInfo={applyInfo} />
      </FieldValues>
    </Card>
  )
}

let applyInfoSupportedBankType = [
  BankType.Bank,
  BankType.FPS,
  BankType.EWallet,
  BankType.Pulsa
]
const ApplyInfoBox = ({ applyInfo }) => {
  let bankType = applyInfo?.bankType
  let isTablet = useBreakpoint("max-tablet")

  let isSupported = applyInfoSupportedBankType.includes(bankType)
  if (!isSupported) {
    return null
  }

  //TODO: use memo?
  //TODO: able to rm
  // let hasBankAddress = !!applyInfo?.receiveBankAccountAddress
  // let hasMemo = !!applyInfo?.memo
  return (
    <>
      <Heading use="h6">
        <Trans zh="銀行卡信息" en="Bank Card Info" />
      </Heading>
      <Set orientation="horizontal" isFilled verticalBelow="tablet">
        <PlayerApplyInfoCard applyInfo={applyInfo} flex="1" />
        {/* 
        TODO: rm
        <Card
          variant="bordered"
          title={
            <Heading use="h5">
              <Trans zh="玩家" en="Player" />
            </Heading>
          }
        >
          <FieldValues>
            <NormalLabel>
              <Trans zh="银行帐户名" en="Bank Account Name" />
            </NormalLabel>
            <Box alignY="center">{applyInfo?.sendBankName}</Box>
            <NormalLabel>
              <Trans zh="银行卡帐号" en="Bank Card Account" />
            </NormalLabel>
            <Box alignY="center">{applyInfo?.sendBankAccount}</Box>
          </FieldValues>
        </Card> */}
        <Box alignX="center" alignY="center">
          <Icon
            icon={isTablet ? faChevronDown : faChevronRight}
            type="font-awesome"
          />
        </Box>
        <PlatformApplyInfoCard applyInfo={applyInfo} flex="1" />
        {/* <Card
          variant="bordered"
          title={
            <Heading use="h5">
              <Trans zh="平台" en="Platform" />
            </Heading>
          }
        >
          <FieldValues>
            <NormalLabel>
              <Trans zh="银行帐户名" en="Bank Account Name" />
            </NormalLabel>
            <Box alignY="center">{applyInfo?.receiveAccountName}</Box>

            <NormalLabel>
              <Trans zh="银行卡帐号" en="Bank Card Account" />
            </NormalLabel>
            <Box alignY="center">{applyInfo?.receiveBankAccount}</Box>
          </FieldValues>
        </Card> */}
      </Set>
      {/* 
      TODO: able to rm?
      <FieldValues marginLeft="1.5rem">
        {hasBankAddress && (
          <>
            <NormalLabel>
              <Trans zh="开户地址" en="Account Address" />
            </NormalLabel>
            <Box alignY="center">
              {applyInfo?.receiveBankAccountAddress}
            </Box>
          </>
        )}

        {hasMemo && (
          <>
            <NormalLabel>
              <Trans zh="附言" en="Memo" />
            </NormalLabel>
            <Box alignY="center">{applyInfo?.memo}</Box>
          </>
        )}
      </FieldValues> */}
    </>
  )
}
