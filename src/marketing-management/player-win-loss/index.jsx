import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Box,
  Set,
  Flex,
  Button,
  Text,
  Switch,
  Input,
  Stack,
  Dialog,
  Level
} from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import AlertDialog from "../../dialog/Alert"
import BrandBar from "../../report/BrandBar"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import SearchButton from "../../button/SearchButton"
import { yesterday } from "../../date/range"
import { DateInputRange } from "../../date/DateTimeRangeInput"
import numberColumn, {
  numberDecimalColumn
} from "../../table/column/numberColumn"
import { usePlayerTotalAmountList } from "./client"
import textColumn from "../../table/column/textColumn"
// import { PlayerTotalWinLossDialogDisclosure } from "./PlayerTotalWinLossDialog"

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
    <Set orientation="vertical" isFilled height="100%">
      <BrandBar
        id="page-merchant-bar"
        onBrandChange={(value) => {
          setBrandId(value)
        }}
      />
      {brandId && <BodyContent brandId={brandId} />}
    </Set>
  )
}

const BodyContent = ({ brandId }) => {
  let dateRange = yesterday()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    agentUsername: "",
    playerUsername: "",
    from: dateRange.start,
    to: dateRange.end
  })

  let { agentUsername } = state
  let { isLoading, data, error, mutate, deleteCache } =
    usePlayerTotalAmountList(agentUsername ? toApiParams(state) : undefined)

  const reset = () => {
    mutate(null)
    deleteCache()
  }

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
    reset()
  }, [brandId])

  let columns = useColumns({
    items: data?.items,
    brandId,
    agentUsername
  })

  return (
    <PageContent
      title={<Trans zh="玩家总输赢报表" en="Player Total Win Loss Report" />}
      actionBar={
        <Level alignY="bottom" alignX="left" verticalBelow="mobile">
          <SearchBar
            brandId={brandId}
            agentUsername={state?.agentUsername}
            playerUsername={state?.playerUsername}
            from={state?.from}
            to={state?.to}
            search={(data) => {
              setState({
                pageIndex: 0,
                ...data
              })
              mutate()
            }}
            isLoading={isLoading}
          />
        </Level>
      }
    >
      {agentUsername && (
        <Table
          columns={columns}
          data={data?.items}
          initialState={state}
          controlledState={state}
          pageCount={pageCount(state.pageSize, data?.totalCount)}
          setPageIndex={setPageIndex}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
          stickyHead
        />
      )}
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  brandId,
  agentUsername,
  playerUsername,
  from,
  to,
  search,
  isLoading,
  ...props
}) => {
  let QueryMaxRangeDays = 31

  let agentUsernamePlaceholder = useTrans({
    zh: "代理用户名",
    en: "Agent Username"
  })

  let playerUsernamePlaceholder = useTrans({
    zh: "玩家用户名",
    en: "Player Username"
  })

  let formMethods = useForm({
    defaultValues: {
      agentUsername,
      playerUsername,
      from,
      to
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <InputField
            name="agentUsername"
            autoFocus
            showEmptyFieldValueAddonAfter
            placeholder={agentUsernamePlaceholder}
            required
          />
          <DateInputRange
            showDateDropdownMenu
            maxRangeDays={QueryMaxRangeDays}
            startProps={{
              name: "from"
            }}
            endProps={{
              name: "to"
            }}
            required
          />
          <InputField
            name="playerUsername"
            showEmptyFieldValueAddonAfter
            placeholder={playerUsernamePlaceholder}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [], from, to }) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "username",
        Header: <Trans zh="玩家用户名" en="Player Username" />,
        disableSortBy: true
      }),

      numberDecimalColumn({
        accessor: "bonusAmount",
        Header: <Trans zh="总优惠金额" en="Total Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "depositAmount",
        Header: <Trans zh="总充值金额" en="Total Deposit Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        Header: <Trans zh="总提款金额" en="Total Withdrawal Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "winLossAmount",
        accessor: (row) => row,
        Header: <Trans zh="总输赢金额" en="Total Win Loss Amount" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          //TODO
          return null
          //return <PlayerTotalWinLossDialogDisclosure />
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
