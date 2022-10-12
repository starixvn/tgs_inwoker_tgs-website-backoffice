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
  Alert
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
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    agentType: undefined,
    includeAgents: true,
    from: dateRange.start,
    to: dateRange.end,
    levelType: undefined
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
    sortby: "username",
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
      title={<Trans zh="代理贡献报表" en="Agent Contribution Report" />}
    >
      <FieldStack>
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

  let usernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent username"
  })

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
        Header: <Trans zh="用户名" en="Username" />,
        TotalCell: () => <Trans zh="总计" en="Total" />,
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
        },
        disableSortBy: true
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
              return <Trans zh="代理" en="Agent" />
            default:
              return value
          }
        },
        Footer: () => <Box />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "depositAmount",
        accessor: (row) => row,
        sumColumn: "depositAmount",
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
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
        Header: <Trans zh="提款金额" en="Withdrawal Amount" />,
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
        Header: (
          <Trans zh="红利金额" en="Bonus Amount" title={bonusAmountTooltip} />
        ),
        disableSortBy: true
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
        accessor: "companyAdjustAmount",
        sumColumn: "companyAdjustAmount",
        Header: <Trans zh="公司调账" en="Co. Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAdjustAmount",
        sumColumn: "bonusAdjustAmount",
        Header: <Trans zh="优惠调帐" en="Bonus Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "agentAdjustAmount",
        sumColumn: "agentAdjustAmount",
        Header: <Trans zh="代理调账" en="Agent Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        sumColumn: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "winLossAmount",
        sumColumn: "winLossAmount",
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="Net Profit" title={netProfitTooltip} />,
        disableSortBy: true
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
