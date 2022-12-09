import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  Icon,
  Breadcrumb
} from "bumbag"
import PageContent from "../../page/Content"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  FormattedNumber,
  Trans,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import { today, yesterday } from "../../date/range"
import { startOfNextDay } from "../../date/startOfNextDay"
import {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { startOfToday, subDays } from "date-fns"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
//TODO: how to toggle fake client and real client?
import { useAgentDividend, useAgentDividendList, API } from "./client"
import { AgentWinLossDialogDisclosure } from "./AgentWinLoss"
import { AgentProfitSharingDialogDisclosure } from "./AgentProfitSharingDialog"
import { AgentTypeSelect } from "../../agent/AgentType"
import { isDev } from "../../env"
import { urlWith } from "../../client"
import DownloadButton from "../../button/DownloadButton"
import { AgentTeamContributionDialogDisclosure } from "./AgentTeamContribution"
import { BonusDialogDisclosure } from "../BonusDialog"
import headOf from "../../list/head"
import lastOf, { isLastIndex } from "../../list/last"
import {
  faAngleDown,
  faAngleRight,
  faCaretRight,
  faCaretDown,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons"

export const PlatformAgentProfitSharingReport = ({ brandId }) => {
  let [treePaths, setTreePaths] = useState([])
  let agent = lastOf(treePaths)

  const appendTreePath = (node) => {
    setTreePaths((paths) => [...paths, node])
  }

  const backToTreePath = (node) => {
    //TODO: skip if last node
    let index = treePaths.findIndex((item) => item.id === node.id)
    if (index >= 0) {
      setTreePaths((paths) => {
        let result = paths.slice(0, index + 1)
        return result
      })
    }
  }

  const notInsideTreePath = (username = "") => {
    let node = treePaths.find((node) => node.username === username)
    return !node
  }

  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    username: "",
    type: "",
    from: dateRange.start,
    to: dateRange.end,
    levelType: undefined
  })

  let username = agent?.username || state?.username

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  useEffect(() => {
    setPageIndex(0)
  }, [JSON.stringify(username)])

  let { pageSize, from, to } = state
  const toSearchParams = () => ({
    ...toApiParams(state),
    username,
    sortby: "username",
    from,
    to: startOfNextDay(to)
  })
  let {
    isLoading: isLoadingAgent,
    data: agentData,
    error: agentError,
    mutate: mutateAgent,
    deleteCache: deleteAgentCache
  } = useAgentDividend(username ? toSearchParams() : undefined)
  let {
    isLoading: isLoadingList,
    data,
    error,
    mutate,
    deleteCache
  } = useAgentDividendList(username ? toSearchParams() : undefined)
  let isLoading = isLoadingAgent || isLoadingList

  useEffect(() => {
    if (agentData?.agent && notInsideTreePath(agentData?.agent?.username)) {
      appendTreePath(agentData?.agent)
    }
  }, [agentData?.agent])

  let items = treePaths.map((node, index, list) => ({
    ...node,
    depth: index,
    isParent: true,
    isLeaf: false,
    isLastParent: isLastIndex(index, list),
    isHighlightedRow: true
  }))
  if (data?.total && data?.items) {
    items = [
      ...items,
      {
        ...data.total,
        isTotal: true,
        depth: treePaths.length,
        isLeaf: true,
        isHighlightedRow: true
      },
      ...data.items.map((node) => ({
        ...node,
        depth: treePaths.length,
        isLeaf: true
      }))
    ]
  }

  let columns = useColumns({
    brandId,
    from,
    to,
    items,
    treePaths,
    appendTreePath,
    backToTreePath
  })
  return (
    <PageContent
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            username={state?.username}
            type={state?.type}
            levelType={state?.levelType}
            from={from}
            to={to}
            isLoading={isLoading}
            search={({ username, ...data }) => {
              if (state?.username != username) {
                setTreePaths([])
              }

              setState({
                pageIndex: 0,
                username,
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
                href={urlWith(toSearchParams(), `${API}/exportAgentDividends`)}
              />
            </Box>
          )}
        </Level>
      }
      title={<Trans zh="代理分红报表" en="Agent Profit Sharing Report" />}
    >
      {username && (
        <FieldStack>
          <Alert variant="bordered" type="info" accent marginBottom="1rem">
            <List listStyleType="disc" listStylePosition="inside">
              <List.Item>
                <Trans
                  zh="红利金额 = VIP福利 + VIP反水 + 活动的优惠金额。"
                  en="Bonus Amount = VIP Bonus + VIP Rebate + Promotion Bonus Amount."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="代理承担红利 = 红利金额 * 分红比例。"
                  en="Agent-Covered Bonus = Bonus Amount * Profit Sharing Percentage."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="代理承担优惠调帐 = 优惠调帐 * 分红比例。"
                  en="Agent-Covered Bonus Adjust = Bonus Adjustment Amount * Profit Sharing Percentage."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="净盈利 = 公司输赢金额 - 代理红利 - 代理优惠。"
                  en="Net Profit = CO. W/L - Bonus Amount - Bonus Adjustment Amount."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="直属玩家贡献 = 净盈利  * 分红比例。"
                  en="Direct-Player Contribution = Net Profit * Profit Sharing Percentage."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="团队贡献 = 下级代理净盈利 * (代理分红% - 下级代理分红%)。"
                  en="Team Contribution = Net Profit from Sub Agent * (Agent Profit Sharing Percentage - Sub Agent Profit Sharing Percentage)."
                />
              </List.Item>
              <List.Item>
                <Trans
                  zh="分红金额 = 直属玩家贡献 + 团队贡献 - 代理调帐。"
                  en="Profit Sharing Amount = Direct-Player Contribution + Team Contribution - Agent Adjustment Amount."
                />
              </List.Item>
            </List>
          </Alert>
          <TotalsInfo data={data} />
          <AgentBreadcrumb
            treePaths={treePaths}
            backToTreePath={backToTreePath}
          />
          <Table
            columns={columns}
            data={items}
            initialState={state}
            controlledState={state}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
            getRowProps={({ original: { isHighlightedRow } } = {}) => {
              if (isHighlightedRow) {
                return {
                  backgroundColor: "white600",
                  fontWeight: "bold"
                }
              }
              return {}
            }}
            stickyHead
            hasDividers
            isHoverable
          />
        </FieldStack>
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const AgentBreadcrumb = ({ treePaths = [], backToTreePath }) => {
  if (treePaths.length === 0) {
    return null
  }

  return (
    <Breadcrumb
      separator={
        <Icon icon={faChevronRight} type="font-awesome" color="gray" />
      }
    >
      {treePaths.map((agent, index, list) => {
        let isCurrent = isLastIndex(index, list)
        return (
          <Breadcrumb.Item isCurrent={isCurrent} key={agent.id}>
            <Breadcrumb.Link
              onClick={(event) => {
                if (!isCurrent) {
                  backToTreePath(agent)
                }
              }}
            >
              {agent.username}
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

const TotalsInfo = ({ data }) => {
  //TODO: data from api
  let totalWinLoss = undefined
  let totalCost = undefined
  let totalNetProfit = undefined

  if (
    !Number.isFinite(totalWinLoss) ||
    !Number.isFinite(totalCost) ||
    !Number.isFinite(totalNetProfit)
  ) {
    return null
  }

  return (
    <Set
      isFilled
      css={css`
        font-weight: bold;
      `}
    >
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Win Loss：" zh="总输赢金额：" />
        <FormattedNumberDecimal value={totalWinLoss} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Cost：" zh="总成本：" />
        <FormattedNumberDecimal value={totalCost} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Net Profit：" zh="总盈余：" />
        <FormattedNumberDecimal value={totalNetProfit} />
      </Alert>
      <Alert
        accent
        variant="bordered"
        paddingTop="0.5rem"
        paddingBottom="0.5rem"
      >
        <Trans en="Total Profit Sharing：" zh="总分红金额：" />
        <FormattedNumberDecimal value={totalCost} />
      </Alert>
    </Set>
  )
}

const SearchBar = ({
  brandId,
  username,
  type,
  levelType,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      username,
      type,
      levelType,
      from,
      to
    }
  })

  let usernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent username"
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
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernamePlaceholder}
            requiredMessage=""
            required
            autoFocus
          />
          <AgentTypeSelect name="type" />

          {/* 
          <AgentLevelSelect name="levelType" /> 
          */}

          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  brandId,
  from,
  to,
  items = [],
  treePaths = [],
  appendTreePath,
  backToTreePath
}) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        id: "username",
        accessor: (row) => row,
        Header: <Trans zh="代理用户名" en="Agent Username" />,
        textAlign: "left",
        Cell: ({ value: record }) => {
          if (record?.isTotal) {
            return (
              <Text.Block marginLeft={`${treePaths?.length ?? 0}rem`}>
                <Trans zh="总计" en="Total" />
              </Text.Block>
            )
          }

          let Container = record?.isLastParent ? Text.Block : Link.Block
          return (
            <Container
              marginLeft={`${record?.depth ?? 0}rem`}
              onClick={() => {
                if (record.isLeaf) {
                  appendTreePath(record)
                } else {
                  backToTreePath(record)
                }
              }}
              whiteSpace="nowrap"
            >
              {record.isLeaf ? (
                ""
              ) : (
                <Icon icon={faAngleDown} type="font-awesome" />
              )}
              {record?.username}
            </Container>
          )
        },
        disableSortBy: true
      }),
      numberDecimalPercentageColumn({
        accessor: "agentDividendPercentage",
        Header: <Trans zh="分红比例" en="Profit Sharing Percentaget" />,
        disableSortBy: true,
        textAlign: "right"
      }),
      numberDecimalColumn({
        /*
        id: "bonusAmount",
        accessor: (row) => row,
        toValue: (row) => row?.bonusAmount,
        */
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        textAlign: "right",
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
        accessor: "agentCoveredBonus",
        sumColumn: "agentCoveredBonus",
        Header: <Trans zh="代理承担红利" en="Agent-Covered Bonus" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAdjustAmount",
        sumColumn: "bonusAdjustAmount",
        Header: <Trans zh="优惠调帐" en="Bonus Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "agentCoveredBonusAdjust",
        sumColumn: "agentCoveredBonusAdjust",
        Header: <Trans zh="代理承担优惠调帐" en="Agent-Covered Bonus Adjust" />,
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
        id: "winLossAmount",
        accessor: (row) => row,
        sumColumn: "winLossAmount",
        toValue: (row) => row?.winLossAmount,
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        /*
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        */
        disableSortBy: true,
        Cell: ({ value: record }) => {
          if (!record?.id) {
            return (
              <FormattedNumber
                value={record?.winLossAmount}
                format="0,0.00"
                digits={2}
              />
            )
          }

          return (
            <AgentWinLossDialogDisclosure
              brandId={brandId}
              agentId={record?.id}
              start={from}
              end={to}
              username={record?.username}
              value={record?.winLossAmount}
              use={Link}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="Net Profit" />,
        disableSortBy: true
      })
    ]

    columns.push(
      ...[
        numberDecimalColumn({
          accessor: "fromPlayerAgentDividendAmount",
          sumColumn: "fromPlayerAgentDividendAmount",
          Header: <PlayerContributionHeader />,
          disableSortBy: true
        }),
        numberDecimalColumn({
          id: "fromTeamAgentDividendAmount",
          accessor: (row) => row,
          sumColumn: "fromTeamAgentDividendAmount",
          toValue: (row) => row?.fromTeamAgentDividendAmount,
          Header: <TeamContributionHeader />,
          /*
          TotalCell: ({ value }) => (
            <FormattedNumber value={value} format="0,0.00" digits={2} />
          ),
          */
          disableSortBy: true,
          Cell: ({ value: record }) => {
            if (!record?.id) {
              return (
                <FormattedNumber
                  value={record?.fromTeamAgentDividendAmount}
                  format="0,0.00"
                  digits={2}
                />
              )
            }

            return (
              <AgentTeamContributionDialogDisclosure
                brandId={brandId}
                agentId={record?.id}
                start={from}
                end={to}
                username={record?.username}
                value={record?.fromTeamAgentDividendAmount}
                use={Link}
              />
            )
          }
        }),
        numberDecimalColumn({
          accessor: "agentAdjustAmount",
          sumColumn: "agentAdjustAmount",
          Header: <Trans zh="代理调账" en="Agent Adjustment Amount" />,
          disableSortBy: true
        }),
        numberDecimalColumn({
          id: "agentDividendAmount",
          accessor: (row) => row,
          sumColumn: "agentDividendAmount",
          toValue: (row) => row?.agentDividendAmount,
          Header: <ProfitSharingAmountHeader />,
          /*
          TotalCell: ({ value }) => (
            <FormattedNumber value={value} format="0,0.00" digits={2} />
          ),
          */
          disableSortBy: true,
          Cell: ({ value: record }) => {
            if (!record?.id) {
              return (
                <FormattedNumber
                  value={record?.agentDividendAmount}
                  format="0,0.00"
                  digits={2}
                />
              )
            }

            return (
              <AgentProfitSharingDialogDisclosure
                brandId={brandId}
                agentId={record?.id}
                start={from}
                end={to}
                username={record?.username}
                value={record?.agentDividendAmount}
                use={Link}
              />
            )
          }
        })
      ]
    )

    return columns
  }, [JSON.stringify(items)])
}

const ProfitSharingAmountHeader = () => {
  return <Trans zh="分红金额" en="Profit Sharing Amount" />
}

const PlayerContributionHeader = () => {
  let title = useTrans({
    zh: "玩家貢獻 = 該代理之直屬玩家貢獻值",
    en: "Player Contribution = A total contribution amount from the agent’s direct players displayed."
  })
  return <Trans zh="直属玩家贡献" en="Player Contribution" title={title} />
}

const TeamContributionHeader = () => {
  let title = useTrans({
    zh: "團隊貢獻 = 該代理底下，全部代理的團隊貢獻值",
    en: "Team Contribution = A total contribution amount of the team displayed which belongs to the agent."
  })
  return <Trans zh="团队贡献" en="Team Contribution" title={title} />
}
