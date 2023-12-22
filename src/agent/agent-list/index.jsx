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
  Level,
  Spinner,
  Alert,
  List
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useAgentList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import AgentStatus, {
  AgentStatusSelect,
  AgentStatusLabel
} from "../AgentStatus"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code, View } from "./menu"
import { ViewButton, EditButton, ConfigButton, AddAgentButton } from "./button"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  FormattedNumberDecimalPercentage,
  Trans,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { AgentLevelLabel, AgentLevelSelect } from "../AgentLevel"
import {
  AgentTypeLabel,
  AgentTypeSelect,
  isAgentTypeCash,
  isAgentTypeCredit
} from "../AgentType"
import {
  AgentConfigStatusLabel,
  isAgentConfigRequired,
  isAgentConfigDone
} from "../AgentConfigStatus"
import AgentLiveDealerRebatePercentage from "../AgentLiveDealerRebatePercentage"
import AgentEgameRebatePercentage from "../AgentEgameRebatePercentage"
import AgentCardGameRebatePercentage from "../AgentCardGameRebatePercentage"
import AgentLotteryRebatePercentage from "../AgentLotteryRebatePercentage"
import AgentSportsRebatePercentage from "../AgentSportsRebatePercentage"
import AgentVirtualSportsRebatePercentage from "../AgentVirtualSportsRebatePercentage"
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
import { StatusTrans } from "../../trans/Status"
import { AgentLevelTrans, AgentTypeTrans, AgentsTrans } from "../../trans/Agent"

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
  let { isLoading, data: brand, error, mutate, deleteCache } = useBrand(brandId)

  return (
    <Set orientation="vertical" isFilled>
      <BrandBar
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {isLoading && (
        <Box alignY="center" alignX="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && brandId && brand && (
        <BodyContent brandId={brandId} brand={brand} />
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: AgentStatus.Enabled,
    levelType: "",
    type: "",
    username: ""
  })

  let { pageIndex, pageSize, status, levelType, type, username } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = useAgentList(
    brandId
      ? {
          ...toApiParams(state),
          sortby: "username",
          brandId
        }
      : undefined
  )

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    reset()
    setState({ pageIndex: 0, brandId })
  }, [brandId, brand])

  let agentProfitSharingType = brand?.agentDividendType
  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId,
    agentProfitSharingType
  })

  return (
    <PageContent
      title={<AgentsTrans />}
      actionBar={
        <Flex justifyContent="space-between">
          <SearchBar
            brandId={brandId}
            status={state.status}
            search={(data = {}) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
          <AddAgentButton
            id="add-agent-dialog-disclosure"
            brandId={brandId}
            agentProfitSharingType={agentProfitSharingType}
            onSubmitted={mutate}
          />
        </Flex>
      }
    >
      <Stack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <Trans
                zh="當進入此頁面時，預設顯示狀態為【正常】的代理清單，且所有狀態都會依照用戶名(A-Z)排序"
                en="When entering this table, the data with status: enable will show first, and all of status will be ordered by first letter (A-Z)"
              />
            </List.Item>
            <List.Item>
              <Trans
                zh="【備註】欄位會顯示在代理信息頁面中，此欄位能夠被修改，但只會儲存並顯示最新一次的修改內容"
                en="Remark will show in agent info page, and you can edit it. Please be aware that only the latest remark will be stored in our database."
              />
            </List.Item>
          </List>
        </Alert>
        <Table
          id="agent"
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </Stack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brandId, status, search, isLoading, ...props }) => {
  let usernameInputPlaceholder = useUserNameTrans()
  let formMethods = useForm({
    defaultValues: {
      status
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

const useColumns = ({
  mutate,
  items = [],
  brandId,
  agentProfitSharingType
} = {}) => {
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
        Header: <Trans zh="分红比例" en="Profit Sharing Percentage" />,
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

          let oneLayer = isAgentProfitSharingOneLayer(agentProfitSharingType)
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
      }),
      numberColumn({
        accessor: "teamNumber",
        Header: <Trans zh="团队人数" en="Team Number" />,
        disableSortBy: true
      }),
      numberColumn({
        accessor: "playerNumber",
        Header: <Trans zh="直属玩家人数" en="Direct Players" />,
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
                    record={value}
                    brandId={brandId}
                    agentProfitSharingType={agentProfitSharingType}
                  />
                  <EditButton
                    id="edit-agent-dialog-disclosure"
                    brandId={brandId}
                    agentProfitSharingType={agentProfitSharingType}
                    record={value}
                    onSubmitted={mutate}
                  />
                </>
              )}
              {configRequired && (
                <ConfigButton
                  id="config-agent-dialog-disclosure"
                  palette="warning"
                  variant="outlined"
                  brandId={brandId}
                  agentProfitSharingType={agentProfitSharingType}
                  agentId={value?.id}
                  onSubmitted={mutate}
                />
              )}
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items)])
}
