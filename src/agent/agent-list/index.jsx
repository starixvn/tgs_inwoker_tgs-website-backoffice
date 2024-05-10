import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffectOnce } from "react-use"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  Level,
  Spinner,
  Alert,
  List
} from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import AutoSizer from "react-virtualized-auto-sizer"
import sequenceColumn from "../../table/column/sequence"
import { useAgentList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import AgentStatus, {
  AgentStatusSelect,
  AgentStatusLabel
} from "../AgentStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { Code, View } from "./menu"
import { ViewButton, EditButton, AddAgentButton } from "./button"
import { FormattedNumberDecimalPercentage } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { numberColumn } from "../../table/column/numberColumn"
import { AgentLevelLabel, AgentLevelSelect } from "../AgentLevel"
import { AgentTypeLabel, AgentTypeSelect, isAgentTypeCash } from "../AgentType"
import {
  AgentConfigStatusLabel,
  isAgentConfigRequired,
  isAgentConfigDone
} from "../AgentConfigStatus"
import { isDev } from "../../env"
import { ViewAgentProfitSharingSettingDialogDisclosure } from "../AgentMultipleLayerProfitSharingSetting"
import { isAgentProfitSharingOneLayer } from "../AgentProfitSharingType"
import { useBrand } from "../../merchant/platforms/client"
import {
  RealNameTrans,
  UserNameTrans,
  useUserNameTrans
} from "../../trans/User"
import { ActionTrans } from "../../trans/Action"
import { ConfigStatusTrans, StatusTrans } from "../../trans/Status"
import {
  AgentLevelTrans,
  AgentListRemarkInfoTrans,
  AgentListStatusInfoTrans,
  AgentTypeTrans,
  AgentsTrans,
  DirectPlayersTrans,
  ProfitSharingPercentageTrans,
  TeamNumberTrans
} from "../../trans/Agent"
import { ConfigAgentProfitSharingDialogDisclosure } from "./ConfigAgentProfitSharingDialog"
import { NegativeDividendDialogDisclosure } from "./NegativeDividendDialog"
import { ProductFeeDialogDisclosure } from "./ProductFeeDialog"
import { AgentProductFeeDialogDisclosure } from "./AgentProductFeeDialog"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<AgentsTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()

  let { isLoading, data: brand, error, mutate } = useBrand(brandId)

  return (
    <Set orientation="vertical" isFilled height="100%">
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && brandId && brand && (
        <BodyContent brandId={brandId} brand={brand} />
      )}
      {error && <AlertDialog {...error} onClickClose={mutate} />}
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand }) => {
  let location = useLocation()
  let navigate = useNavigate()

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    status: AgentStatus.Enabled,
    levelType: "",
    type: "",
    username: location?.state?.username ?? ""
  })

  useEffectOnce(() => {
    if (location?.state?.username) {
      let state = { ...location.state, username: "" }
      navigate(location.pathname, {
        state,
        replace: true
      })
    }
  }, [location?.state?.username])

  let {
    data = {},
    isLoading,
    mutate,
    error,
    emptyData
  } = useAgentList({
    ...toApiParams(state),
    sortby: "username"
  })

  const reset = () => {
    mutate(undefined)
  }

  useEffect(() => {
    if (state.brandId != brandId) {
      reset()
      setState({ pageIndex: 0, brandId })
    }
  }, [brandId, brand])

  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId,
    brand
  })

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          status={state.status}
          username={state.username}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
          isLoading={isLoading}
        />
        <Set>
          <ProductFeeDialogDisclosure brandId={brand.id} />
          <AddAgentButton
            id="add-agent-dialog-disclosure"
            brand={brand}
            onSubmitted={mutate}
          />
        </Set>
      </Level>
      <Box>
        <Alert variant="bordered" type="info" accent marginBottom="0">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <AgentListStatusInfoTrans />
            </List.Item>
            <List.Item>
              <AgentListRemarkInfoTrans />
            </List.Item>
          </List>
        </Alert>
      </Box>
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                id="agent"
                columns={columns}
                data={data?.items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state?.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const SearchBar = ({
  brandId,
  status,
  username,
  search,
  isLoading,
  ...props
}) => {
  let usernameInputPlaceholder = useUserNameTrans()
  let formMethods = useForm({
    defaultValues: {
      status,
      username
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <AgentStatusSelect name="status" />
          <AgentLevelSelect name="levelType" />
          <AgentTypeSelect name="type" />
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

const useColumns = ({ mutate, items = [], brand } = {}) => {
  let hasAnyMenu = useHasSubMenuByRoute()
  let viewable = useIsDisplayMenuByRoute([View])

  return useMemo(() => {
    let columns = [
      sequenceColumn(),
      textColumn({
        accessor: "username",
        Header: <UserNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "realName",
        Header: <RealNameTrans />,
        disableSortBy: true
      }),
      textColumn({
        accessor: "type",
        Header: <AgentTypeTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentTypeLabel value={value} />
      }),
      textColumn({
        accessor: "levelType",
        Header: <AgentLevelTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentLevelLabel value={value} />
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <AgentStatusLabel value={value} />
      }),
      textColumn({
        id: "profitSharing",
        accessor: (row) => row,
        Header: <ProfitSharingPercentageTrans />,
        disableSortBy: true,
        Cell: ({ value }) => {
          let isCash = isAgentTypeCash(value?.type)
          if (!isCash) {
            return "-"
          }

          let configRequired = isAgentConfigRequired(value?.agentStatus)
          if (configRequired) {
            return "-"
          }

          let oneLayer = isAgentProfitSharingOneLayer(brand?.agentDividendType)
          if (oneLayer) {
            return (
              <FormattedNumberDecimalPercentage
                value={value?.dividendPercentage}
              />
            )
          }

          return (
            <ViewAgentProfitSharingSettingDialogDisclosure
              id="agent-profit-sharing-setting-dialog-disclosure"
              agentId={value?.id}
              disabled={!viewable}
            />
          )
        }
      }),
      /*
      textColumn({
        id: AgentLiveDealerRebatePercentage.Name,
        accessor: (row) => row,
        Header: <Trans zh="真人返佣%" en="Live Dealer Rebate %" />,
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
              value={value?.virtualSportsRebatePercentage}
              postfix="%"
            />
          )
        }
      }),
      */
      textColumn({
        accessor: "agentStatus",
        Header: <ConfigStatusTrans />,
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
      }),
      numberColumn({
        accessor: "teamNumber",
        Header: <TeamNumberTrans />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "playerNumber",
        Header: <DirectPlayersTrans />,
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push({
        id: "actions",
        disableSortBy: true,
        Header: <ActionTrans />,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        },
        accessor: (row) => {
          return row
        },
        Cell: ({ value }) => {
          let { agentStatus } = value
          let configDone = isAgentConfigDone(agentStatus)
          let configRequired = isAgentConfigRequired(agentStatus)
          return (
            <Set alignX="center">
              {configDone && (
                <>
                  <ViewButton
                    id="view-agent-dialog-disclosure"
                    brand={brand}
                    agent={value}
                  />
                  <EditButton
                    id="edit-agent-dialog-disclosure"
                    brand={brand}
                    agent={value}
                    onSubmitted={mutate}
                  />
                  <NegativeDividendDialogDisclosure agentId={value.id} />
                </>
              )}
              {configRequired && (
                <ConfigAgentProfitSharingDialogDisclosure
                  id="config-agent-dialog-disclosure"
                  palette="warning"
                  variant="outlined"
                  brand={brand}
                  agent={value}
                  onSubmitted={mutate}
                />
              )}
              <AgentProductFeeDialogDisclosure agent={value} />
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items), brand])
}
