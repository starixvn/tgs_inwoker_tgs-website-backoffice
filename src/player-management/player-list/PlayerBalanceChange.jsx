import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import {
  usePlayerBalanceChanges,
  usePlayerBalanceChangeTotalAmount
} from "./client"
import { Trans, useTrans } from "../../i18n"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import SearchButton from "../../button/SearchButton"
import { Tab as _Tab, TabPanel } from "../../tab"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import textColumn from "../../table/column/textColumn"
import { Descending } from "../../table/order"
import { subHours, endOfToday } from "date-fns"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { Select } from "../../select/Select"
import AlertDialog from "../../dialog/Alert"
import {
  GameActionTypeLabel,
  useGameActionTypeOptionList
} from "../../game/GameActionType"
import PlayerAdjustBalanceType, {
  usePlayerAdjustBalanceTypeOptionList,
  PlayerAdjustBalanceTypeLabel
} from "../balance-adjustment/PlayerAdjustBalanceType"

export const Key = "BalanceChange"

export const PlayerBalanceChangeTab = ({ ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="账变记录" en="Balance Change Records" />
    </_Tab>
  )
}

export const PlayerBalanceChangePanel = ({ brandId, playerCode, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  let dateRange = newDateRange()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    accountChangeType: "",
    from: dateRange.start,
    to: dateRange.end,
    brandId,
    playerCode
  })

  let { pageSize, accountChangeType, from, to } = state
  let depositOrWithdraw = isDepositOrWithdrawal(accountChangeType)

  let { isLoading, data, error, mutate, deleteCache } = usePlayerBalanceChanges(
    isActive
      ? toApiParams({
          ...state,
          sortby: "recordedOn",
          orderby: Descending
        })
      : undefined
  )
  let {
    isLoading: isLoadingTotalAmount,
    data: total,
    error: totalError,
    mutate: mutateTotal,
    deleteCache: deleteTotalCache
  } = usePlayerBalanceChangeTotalAmount(
    isActive && depositOrWithdraw ? toApiParams(state) : undefined
  )

  let columns = useColumns({ items: data?.items })
  return (
    <TabPanel tabId={Key} {...props}>
      <Stack spacing="major-2">
        <SearchBar
          accountChangeType={accountChangeType}
          start={from}
          end={to}
          search={({ accountChangeType, start, end }) => {
            setState({
              pageIndex: 0,
              accountChangeType,
              from: start,
              to: end
            })
            mutate()
            mutateTotal()
          }}
          isLoading={isLoading}
        />
        <Table
          columns={columns}
          data={data?.items}
          total={depositOrWithdraw && data?.items?.length > 0 && total}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          initialState={state}
          controlledState={state}
          isLoading={isLoading || isLoadingTotalAmount}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
      {totalError && (
        <AlertDialog {...totalError} onClickClose={deleteTotalCache} />
      )}
    </TabPanel>
  )
}

const SearchBar = ({
  accountChangeType,
  start,
  end,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      accountChangeType,
      start,
      end
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <PlayerTransactionTypeSelect name="accountChangeType" />
          <DateTimeRangeInput />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] }) =>
  useMemo(
    () => [
      dateTimeColumn({
        Header: <Trans zh="操作时间" en="Operation Time" />,
        TotalCell: () => <Trans zh="总和" en="Total" />,
        accessor: "recordedOn",
        disableSortBy: true
      }),
      textColumn({
        id: "transactionType",
        accessor: (row) => row,
        Header: <Trans zh="交易类型" en="Transaction Type" />,
        disableSortBy: true,
        TotalCell: () => null,
        Cell: ({ value: record }) => {
          let { transactionType, gameActionType } = record
          if (transactionType) {
            return <PlayerTransactionTypeLabel value={transactionType} />
          }
          return <GameActionTypeLabel value={gameActionType} />
        }
      }),
      numberDecimalColumn({
        accessor: "amount",
        Header: <Trans zh="交易金额" en="Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "balance",
        Header: <Trans zh="余额" en="Balance" />,
        TotalCell: () => null,
        disableSortBy: true
      }),
      textColumn({
        accessor: "remark",
        Header: <Trans zh="备注" en="Remark" />,
        TotalCell: () => null,
        disableSortBy: true
      })
    ],
    [JSON.stringify(items)]
  )

const newDateRange = () => ({
  start: subHours(Date.now(), 1),
  end: endOfToday()
})

const Deposit = "Deposit"
const DepositTrans = {
  zh: "存款",
  en: "Deposit"
}

const Withdrawal = "Withdrawal"
const WithdrawalTrans = {
  zh: "提款",
  en: "Withdrawal"
}

const isDepositOrWithdrawal = (value) =>
  value === Deposit || value === Withdrawal

//TODO: Remove
const Adjust = "Adjust"
const AdjustTrans = {
  zh: "调账",
  en: "Balance Adjustment"
}

const Bonus = "Bonus"
const BonusTrans = {
  zh: "红利",
  en: "Bonus"
}

const Rebate = "Rebate"
const RebateTrans = {
  zh: "返水",
  en: "Commission Rebate"
}

const Dividend = "Dividend"
const DividendTrans = {
  zh: "分紅",
  en: "Profit Sharing"
}

const Promotion = "Promotion"
const PromotionTrans = {
  zh: "活动",
  en: "Promotion"
}

const GameProviderFundIn = "GameProviderFundIn"
const GameProviderFundInTrans = {
  zh: "游戏转入",
  en: "Game Fund In"
}

const GameProviderFundOut = "GameProviderFundOut"
const GameProviderFundOutTrans = {
  zh: "游戏转出",
  en: "Game Fund Out"
}

const GameProviderDeposit = "GameProviderDeposit"
const GameProviderDepositTrans = {
  zh: "上分",
  en: "Game Deposit"
}

const GameProviderWithdrawal = "GameProviderWithdrawal"
const GameProviderWithdrawalTrans = {
  zh: "下分",
  en: "Game Withdrawal"
}

const UnsettledBetManual = "UnsettledBetManual"
const UnsettledBetManualTrans = {
  zh: "未结算单手动处理",
  en: "Unsettled Bet(Manual)"
}

const PromotionVipLevelUpgrade = "PromotionVipLevelUpgrade"
const PromotionVipLevelUpgradeTrans = {
  zh: "VIP晋升福利",
  en: "VIP Promotion Benefit"
}

const PromotionVipLevelSeason = "PromotionVipLevelSeason"
const PromotionVipLevelSeasonTrans = {
  zh: "VIP季度福利",
  en: "VIP Quarterly Benefit"
}

const PromotionVipLevelBirthday = "PromotionVipLevelBirthday"
const PromotionVipLevelBirthdayTrans = {
  zh: "VIP生日福利",
  en: "VIP Birthday Benefit"
}

const DividendAllAgentRebate = "DividendAllAgentRebate"
const DividendAllAgentRebateTrans = {
  zh: "全民代理返水",
  en: "All Agent Rebate"
}

const AdjustResettledBetManual = "AdjustResettledBetManual"
const AdjustResettledBetManualTrans = {
  zh: "已结算单再调整",
  en: "Settled Bet Readjusted"
}

const CancelWithdrawal = "CancelWithdrawal"
const CancelWithdrawalTrans = {
  zh: "取消提款",
  en: "Cancel Withdrawal"
}

export const PlayerTransactionTypeSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useTrans({
    zh: "交易类型",
    en: "Transaction Type"
  })
  placeholder = placeholder ?? defaultPlaceholder

  let adjustPlayerBalanceTypeOptions = usePlayerAdjustBalanceTypeOptionList()
  let gameActionTypeOptions = useGameActionTypeOptionList()
  let options = [
    {
      label: useTrans(DepositTrans),
      value: Deposit
    },
    {
      label: useTrans(WithdrawalTrans),
      value: Withdrawal
    },
    {
      label: useTrans(CancelWithdrawalTrans),
      value: CancelWithdrawal
    },
    ...adjustPlayerBalanceTypeOptions,
    {
      label: useTrans(BonusTrans),
      value: Bonus
    },
    {
      label: useTrans(RebateTrans),
      value: Rebate
    },
    {
      label: useTrans(DividendTrans),
      value: Dividend
    },
    {
      label: useTrans(PromotionTrans),
      value: Promotion
    },
    {
      label: useTrans(GameProviderFundOutTrans),
      value: GameProviderFundOut
    },
    {
      label: useTrans(GameProviderFundInTrans),
      value: GameProviderFundIn
    },
    {
      label: useTrans(GameProviderWithdrawalTrans),
      value: GameProviderWithdrawal
    },
    {
      label: useTrans(UnsettledBetManualTrans),
      value: UnsettledBetManual
    },
    {
      label: useTrans(PromotionVipLevelUpgradeTrans),
      value: PromotionVipLevelUpgrade
    },
    {
      label: useTrans(PromotionVipLevelSeasonTrans),
      value: PromotionVipLevelSeason
    },
    {
      label: useTrans(PromotionVipLevelBirthdayTrans),
      value: PromotionVipLevelBirthday
    },
    {
      label: useTrans(DividendAllAgentRebateTrans),
      value: DividendAllAgentRebate
    },
    {
      label: useTrans(AdjustResettledBetManualTrans),
      value: AdjustResettledBetManual
    },
    {
      label: useTrans(GameProviderDepositTrans),
      value: GameProviderDeposit
    },
    ...gameActionTypeOptions
  ]

  return <Select placeholder={placeholder} options={options} {...props} />
}

export const PlayerTransactionTypeLabel = ({ value = "" }) => {
  switch (value) {
    case Deposit:
      return <Trans {...DepositTrans} />
    case Withdrawal:
      return <Trans {...WithdrawalTrans} />
    case PlayerAdjustBalanceType.Company:
    case PlayerAdjustBalanceType.Agent:
    case PlayerAdjustBalanceType.System:
    case PlayerAdjustBalanceType.Transfer:
      return <PlayerAdjustBalanceTypeLabel value={value} />
    case Bonus:
      return <Trans {...BonusTrans} />
    case Rebate:
      return <Trans {...RebateTrans} />
    case Dividend:
      return <Trans {...DividendTrans} />
    case Promotion:
      return <Trans {...PromotionTrans} />
    case GameProviderFundOut:
      return <Trans {...GameProviderFundOutTrans} />
    case GameProviderFundIn:
      return <Trans {...GameProviderFundInTrans} />
    case GameProviderDeposit:
      return <Trans {...GameProviderDepositTrans} />
    case GameProviderWithdrawal:
      return <Trans {...GameProviderWithdrawalTrans} />
    case UnsettledBetManual:
      return <Trans {...UnsettledBetManualTrans} />
    case PromotionVipLevelUpgrade:
      return <Trans {...PromotionVipLevelUpgradeTrans} />
    case PromotionVipLevelSeason:
      return <Trans {...PromotionVipLevelSeasonTrans} />
    case PromotionVipLevelBirthday:
      return <Trans {...PromotionVipLevelBirthdayTrans} />
    case DividendAllAgentRebate:
      return <Trans {...DividendAllAgentRebateTrans} />
    case AdjustResettledBetManual:
      return <Trans {...AdjustResettledBetManualTrans} />
    case CancelWithdrawal:
      return <Trans {...CancelWithdrawalTrans} />
    default:
      return value
  }
}
