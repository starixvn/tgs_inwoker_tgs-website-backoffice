import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Flex,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useAgentList, useCreditAgentList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { AgentStatusLabel, AgentStatusSelect } from "../AgentStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  AgentConfigStatusLabel,
  isAgentConfigRequired,
  isAgentConfigDone
} from "../AgentConfigStatus"
import { FormattedNumberDecimal, Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { CreditAgentTypeLabel, CreditAgentTypeSelect } from "./CreditAgentType"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let userBrandId = useUserBrandId()
  let [brandId, setBrandId] = useState(userBrandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId = "" }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: "",
    type: "",
    username: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { isLoading, data, error, mutate, deleteCache } = useCreditAgentList(
    brandId
      ? {
          ...toApiParams(state),
          sortby: "username",
          brandId
        }
      : undefined
  )

  let columns = useColumns({ mutate, items: data?.items, brandId })

  return (
    <PageContent
      title={<Trans zh="信用无限代列表" en="Agents" />}
      actionBar={
        <Flex justifyContent="space-between">
          <SearchBar
            brandId={brandId}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          TODO: add credit agent disclosure
          {/* <AddAgentButton brandId={brandId} onSubmitted={mutate} /> */}
        </Flex>
      }
    >
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brandId, search, isLoading, ...props }) => {
  let usernameInputPlaceholder = useTrans({
    zh: "用户名输入框",
    en: "Input user name"
  })

  let formMethods = useForm()

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <AgentStatusSelect name="status" />
          <CreditAgentTypeSelect name="type" />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ mutate, items = [], brandId } = {}) => {
  let hasAnyMenu = useHasSubMenuByRoute()

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <Trans zh="用户名" en="User name" />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
        Header: <Trans zh="代理类型" en="Agent Type" />,
        disableSortBy: true,
        Cell: ({ value }) => "TODO: 信用无限代?"
      }),
      textColumn({
        accessor: "levelType",
        Header: <Trans zh="代理种类" en="Agent Type" />,
        disableSortBy: true,
        Cell: ({ value }) => <CreditAgentTypeLabel value={value} />
      }),
      textColumn({
        accessor: "status",
        Header: <Trans zh="状态" en="Status" />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentStatusLabel value={value} />
      }),
      textColumn({
        id: "profitSharing",
        accessor: (row) => row,
        Header: <Trans zh="占成比例" en="Profit Sharing Percentage" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.dividendPercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentLiveDealerRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="真人返佣%" en="Live Dealer Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.liveDealerRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentEgameRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="电子返佣%" en="EGame Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.slotRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentCardGameRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="棋牌返佣%" en="Card Game Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let isCredit = isAgentTypeCredit(value?.type)
          if (!isCredit) {
            return "-"
          }

          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.cardGameRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentLotteryRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="彩票返佣%" en="Lottery Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.lotteryRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentSportsRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="体育返佣%" en="Sports Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.sportsRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        id: AgentVirtualSportsRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="虚拟体育返佣%" en="Virtual Sports Rebate %" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          return (
            <FormattedNumberDecimal
              value={value?.virtualSportsRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      textColumn({
        accessor: "agentStatus",
        Header: <Trans zh="配置状态" en="Config Status" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let configRequired = isAgentConfigRequired(value)

          return (
            <AgentConfigStatusLabel
              value={value}
              fontWeight={configRequired ? "bold" : undefined}
            />
          )
        }
      })
    ]

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        accessor: (row) => row,
        disableSortBy: true,
        Header: <Trans zh="操作" en="Actions" />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { agentStatus } = value
          let configDone = isAgentConfigDone(agentStatus)
          let configRequired = isAgentConfigRequired(agentStatus)
          return (
            <Set alignX="center">
              {configDone && (
                <>
                  "TODO: configDone view edit disclosure"
                  {/* <ViewButton record={value} brandId={brandId} />
                    <EditButton
                      brandId={brandId}
                      record={value}
                      onSubmitted={mutate}
                    /> */}
                </>
              )}
              {
                configRequired && "TODO: configRequired config btn"
                //   <ConfigButton
                //     palette="warning"
                //     variant="outlined"
                //     brandId={brandId}
                //     agentId={value?.id}
                //     onSubmitted={mutate}
                //   />
              }
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items)])
}
