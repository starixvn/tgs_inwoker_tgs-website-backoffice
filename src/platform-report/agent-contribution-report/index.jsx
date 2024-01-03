import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Box,
  Breadcrumb,
  Set,
  Button,
  Text,
  Link,
  FieldStack,
  Icon,
  Level,
  Alert,
  List
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { Code } from "./menu"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { useAgentContributionList, API } from "./client"
import { AgentTypeSelect } from "../../agent/AgentType"
import Checkbox from "../../checkbox"
import headOf from "../../list/head"
import lastOf, { isLastIndex } from "../../list/last"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import BrandBar from "../../report/BrandBar"
import { isDev } from "../../env"
import DownloadButton from "../../button/DownloadButton"
import { urlWith } from "../../client"
import { AgentLevelSelect } from "../../agent/AgentLevel"
import Big from "big.js"
import { BonusDialogDisclosure } from "../BonusDialog"
import { Code as PageCode } from "./menu"
import { Code as ModuleCode } from "../menu"
import { useTableColumnHiddenLocalStorage } from "../../table/ActionBar"
import { BonusAmountTrans, NetProfitTrans, TotalTrans } from "../../trans/Field"
import {
  BetAmountTrans,
  TurnoverTrans,
  ValidBetAmountTrans
} from "../../trans/Game"
import { UserNameTrans } from "../../trans/User"
import { DepositAmountTrans, WithdrawAmountTrans } from "../../trans/Payment"
import {
  CompanyWinLossTrans,
  DepositAmountAfterDeductingTransferFeeTrans
} from "../../trans/Platform"
import {
  AgentContributionReportTrans,
  AgentTrans,
  useAgentUsernameTrans
} from "../../trans/Agent"

const MainTable = "main"
const TableLocalStorageKey = `${ModuleCode}:${PageCode}:${MainTable}`

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

export const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <ReportContent brandId={brandId} />}
    </Set>
  )
}

const ReportContent = ({ brandId }) => {
  let [usernames, setUsernames] = useState([])
  let username = lastOf(usernames)
  let agentUsername = headOf(usernames)

  let dateRange = yesterday()

  let [hiddenColumns] = useTableColumnHiddenLocalStorage(
    TableLocalStorageKey,
    []
  )

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentType: undefined,
    includeAgents: true,
    from: dateRange.start,
    to: dateRange.end,
    levelType: undefined,
    sortBy: [{ id: "username", desc: false }],
    hiddenColumns
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  useEffect(() => {
    setPageIndex(0)
  }, [JSON.stringify(usernames)])

  let { pageSize, from, to } = state
  const toSearchParams = () => ({
    ...toApiParams(state),
    username,
    from,
    to: startOfNextDay(to)
  })
  let {
    isLoading,
    data = {},
    error,
    mutate,
    deleteCache
  } = useAgentContributionList(username ? toSearchParams() : undefined)

  let columns = useColumns({
    usernames,
    setUsernames,
    items: data?.items
  })

  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            agentUsername={agentUsername}
            agentType={state?.agentType}
            from={state.from}
            to={state.to}
            levelType={state?.levelType}
            includeAgents={state?.includeAgents}
            isLoading={isLoading}
            search={({ agentUsername, ...data }) => {
              setUsernames([agentUsername])

              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
          />
          {data?.items?.length > 0 && (
            <Box>
              <DownloadButton
                id="export-report"
                isLoading={isLoading}
                href={urlWith(
                  toSearchParams(),
                  `${API}/exportAgentContributions`
                )}
              />
            </Box>
          )}
        </Level>
      }
      title={<AgentContributionReportTrans />}
    >
      <FieldStack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <DepositAmountAfterDeductingTransferFeeTrans />
            </List.Item>
          </List>
        </Alert>
        <AgentBreadcrumb usernames={usernames} setUsernames={setUsernames} />
        {username && (
          <Table
            columns={columns}
            data={data?.items}
            total={data?.items?.length > 0 && data?.total}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            foot={data?.items?.length > 0}
            stickyHead
            localStorageKey={TableLocalStorageKey}
            toggleColumnHidden={true}
          />
        )}
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const AgentBreadcrumb = ({ usernames = [], setUsernames }) => {
  if (usernames.length === 0) {
    return null
  }

  return (
    <Breadcrumb
      marginLeft="1rem"
      separator={
        <Icon icon={faChevronRight} type="font-awesome" color="gray" />
      }
    >
      {usernames.map((username, index, list) => {
        let path = list.slice(0, index + 1)

        let isCurrent = isLastIndex(index, list)
        return (
          <Breadcrumb.Item isCurrent={isCurrent} key={index}>
            <Breadcrumb.Link
              onClick={(event) => {
                if (!isCurrent) {
                  setUsernames(path)
                }
              }}
            >
              {username}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

const SearchBar = ({
  brandId,
  agentUsername,
  agentType,
  levelType,
  includeAgents,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      agentUsername,
      agentType,
      levelType,
      includeAgents,
      from,
      to
    }
  })

  let usernamePlaceholder = useAgentUsernameTrans()

  let includeAgentCheckboxLabel = useTrans({
    zh: "包含代理资讯",
    en: "Include Agent Info"
  })

  const onSubmit = (data) => search?.(data)

  let QueryMaxRangeDays = 31
  let todayRange = today()
  let DataRetentionDays = 180
  let minDate = subDays(todayRange.start, DataRetentionDays)
  let maxDate = todayRange.end

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateInputRange
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            minDate={minDate}
            maxDate={maxDate}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            dateDropdownMenuProps={{
              thisWeekProps: {
                end: maxDate
              },
              thisMonthProps: {
                end: maxDate
              }
            }}
            fakeTimeLabel
            required
          />
          <InputField
            name="agentUsername"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
            requiredMessage=""
            required
            autoFocus
          />
          <AgentTypeSelect name="agentType" />

          {/* 
          <AgentLevelSelect name="levelType" /> 
          */}

          <Checkbox name="includeAgents" label={includeAgentCheckboxLabel} />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const AgentType = "Agent"
const PlayerType = "Player"
const isPlayer = (type = "") => type === PlayerType
const isAgent = (type = "") => type === AgentType

const useColumns = ({ usernames = [], setUsernames, items = [] }) => {
  let bonusAmountTooltip = useTrans({
    zh: "反水(VIP) + 紅利(活動)",
    en: "Rebate (VIP) + Bonus (Promotion)"
  })

  let netProfitTooltip = useTrans({
    zh: "輸贏-調帳-紅利",
    en: "Win loss - Adjustment - Bonus"
  })
  return useMemo(
    () => [
      textColumn({
        id: "username",
        accessor: (row) => row,
        Header: <UserNameTrans />,
        TotalCell: () => <TotalTrans />,
        Cell: ({ value }) => {
          let { type } = value
          if (isAgent(type)) {
            return (
              <Link
                onClick={(event) => {
                  let path = [...usernames, value?.username]
                  setUsernames(path)
                }}
              >
                {value?.username}
              </Link>
            )
          }
          return <Text.Block>{value?.username}</Text.Block>
        },
        Footer: () => <Trans zh="页总计" en="Page Total" />,
        footerCellProps: {
          textAlign: "center"
        }
      }),
      textColumn({
        accessor: "type",
        Header: <Trans zh="账户类型" en="Account Type" />,
        TotalCell: () => null,
        Cell: ({ value = "" }) => {
          switch (value) {
            case "Player":
              return <Trans zh="玩家" en="Player" />
            case AgentType:
              return <AgentTrans />
            default:
              return value
          }
        },
        Footer: () => <Box />
      }),
      numberDecimalColumn({
        id: "depositAmount",
        accessor: (row) => row,
        sumColumn: "depositAmount",
        Header: <DepositAmountTrans />,
        disableSortBy: true,
        toValue: ({ depositAmount, depositHandlingFee = 0 } = {}) => {
          let value = Number.isFinite(depositAmount)
            ? new Big(depositAmount).minus(depositHandlingFee).toNumber()
            : depositAmount
          return value
        },
        toTotal: ({ depositAmount, depositHandlingFee = 0 } = {}) => {
          let value = Number.isFinite(depositAmount)
            ? new Big(depositAmount).minus(depositHandlingFee).toNumber()
            : depositAmount
          return value
        },
        TotalCell: ({ value }) => <FormattedNumberDecimal value={value} />
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        sumColumn: "withdrawalAmount",
        Header: <WithdrawAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        /*
        id: "bonusAmount",
        accessor: (row) => row,
        toValue: (row) => row?.bonusAmount,
        */
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <BonusAmountTrans title={bonusAmountTooltip} />
        /*
        TotalCell: ({ value }) => <FormattedNumberDecimal value={value} />,
        Cell: ({ value: record }) => {
          return (
            <BonusDialogDisclosure
              value={record?.bonusAmount}
              use={Link}
              useFetch={() => {
                return {
                  isLoading: false,
                  data: {
                    items: [
                      {
                        promotionBonus: 1,
                        vipRebate: 2,
                        birthdayBonus: 3,
                        upgradeBonus: 4,
                        quarterlyBonus: 5
                      }
                    ]
                  },
                  error: undefined
                }
              }}
            />
          )
        }
        */
      }),
      numberDecimalColumn({
        accessor: "bonusAdjustAmount",
        sumColumn: "bonusAdjustAmount",
        Header: <Trans zh="优惠调帐" en="Bonus Adjustment Amount" />
      }),
      numberDecimalColumn({
        accessor: "agentAdjustAmount",
        sumColumn: "agentAdjustAmount",
        Header: <Trans zh="代理调账" en="Agent Adjustment Amount" />
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <BetAmountTrans />
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <ValidBetAmountTrans />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        sumColumn: "turnover",
        Header: <TurnoverTrans />
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        sumColumn: "winLossAmount",
        Header: <CompanyWinLossTrans />
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <NetProfitTrans title={netProfitTooltip} />
      })
    ],
    [
      JSON.stringify(items),
      JSON.stringify(usernames),
      bonusAmountTooltip,
      netProfitTooltip
    ]
  )
}
