import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Stack, Button, Set, Level, Text, Box, Dialog } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code, Update, ViewDetail, UpdateDetail } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { Trans, useTrans } from "../../i18n"
import { SearchButton } from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { useBrandGameList, useChangeBrandGameOrders } from "./client"
import { PlatformGameDetailButton } from "./PlatformGameDetailButton"
import { GamePlatformLabel } from "../games/GamePlatform.jsx"
import { GameTag } from "../games/GameTag"
import { GameTagSwitch } from "./GameTagSwitch"
import { GameStatusToggleSwitch } from "./GameStatusToggleSwitch"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { InputField } from "../../input/Input"
import { BrandGameProviderSelect } from "../brandproviders/BrandGameProviderSelect"
import AlertDialog from "../../dialog/Alert"
import { GameTypeLabel, AllGameTypeSelect } from "../GameType"
import { NumberInput } from "../../input/NumberInput"
import { ActionTrans, ConfirmOrderTrans } from "../../trans/Action.jsx"
import { StatusTrans } from "../../trans/Status.jsx"
import {
  GameIdTrans,
  GameListTrans,
  GameNameTrans,
  GameProviderNameTrans,
  GameTypeTrans,
  HotGameTrans,
  NewGameTrans,
  RecommendGameTrans
} from "../../trans/Game.jsx"
import { OrderTrans, SupportingDeviceTrans } from "../../trans/Field.jsx"

export { Code } from "./menu"

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<GameListTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let brandId = usePlatformId()
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId,
    gameProviderId: "",
    gameType: "",
    keyword: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let { gameProviderId, gameType, keyword } = state
  let { isLoading, data, error, mutate, emptyData } = useBrandGameList({
    ...toApiParams(state),
    sortby: "displayOrder"
  })

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          gameProviderId={gameProviderId}
          gameType={gameType}
          keyword={keyword}
          search={(data) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate()
          }}
        />
      </Level>
      <DataTable
        controlledState={state}
        data={data}
        pageSize={state.pageSize}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        mutate={mutate}
        isLoading={isLoading}
      />
      {error && <AlertDialog {...error} onClickClose={emptyData} />}
    </Set>
  )
}

const DataTable = ({
  controlledState,
  data,
  pageSize,
  setPageIndex,
  setSortOrder,
  isLoading,
  mutate
}) => {
  let editable = useIsDisplayMenuByRoute([Update])

  let formMethods = useForm()
  let [displayOrders, setDisplayOrders] = useState({})

  const setDisplayOrder = (id, displayOrder) => {
    setDisplayOrders((state) => {
      Reflect.set(state, id, displayOrder)
      return state
    })
  }

  let [submitData, setSubmit] = useState()

  let {
    result,
    isLoading: isChangingDisplayOrder,
    error,
    deleteCache
  } = useChangeBrandGameOrders(submitData)

  const onSubmit = (formData) => {
    let orders = []
    Object.entries(displayOrders).forEach(([id, value]) => {
      orders.push({
        id,
        displayOrder: value
      })
    })

    if (orders.length > 0) {
      setSubmit({
        orders
      })
    }
  }

  const reset = () => {
    setDisplayOrders({})
    setSubmit(undefined)
  }

  useEffect(() => {
    if (result && !error) {
      reset()
      mutate()
    }
  }, [result, error])

  const items = data?.items ?? []

  let columns = useColumns({
    items,
    mutate,
    formMethods,
    displayOrders,
    setDisplayOrder
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack spacing="major-1">
          <Table
            id="games"
            columns={columns}
            data={items}
            controlledState={controlledState}
            pageCount={pageCount(pageSize, data?.totalCount)}
            setPageIndex={setPageIndex}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          {error && <AlertDialog {...error} onClickClose={deleteCache} />}
          {editable && (
            <Dialog.Footer position="sticky" bottom="0">
              <Button isLoading={isChangingDisplayOrder} type="submit">
                <ConfirmOrderTrans />
              </Button>
            </Dialog.Footer>
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}

const SearchBar = ({
  brandId,
  gameProviderId = "",
  gameType = "",
  keyword = "",
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      keyword: ""
    }
  })

  let searchPlaceHolder = useTrans({
    zh: "关键字输入框",
    en: "Input keyword"
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <BrandGameProviderSelect name="gameProviderId" brandId={brandId} />
          <AllGameTypeSelect name="gameType" />
          <InputField
            name="keyword"
            showEmptyFieldValueAddonAfter
            placeholder={searchPlaceHolder}
            autocomplete="off"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({
  items = [],
  mutate,
  formMethods,
  displayOrders = {},
  setDisplayOrder
}) => {
  let { register, getValues } = formMethods
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasViewDetailAuth = useIsDisplayMenuByRoute([ViewDetail])
  let hasUpdateDetailAuth = useIsDisplayMenuByRoute([UpdateDetail])
  let hasAnyMenu = hasViewDetailAuth || hasUpdateDetailAuth

  return useMemo(() => {
    let columns = [
      {
        id: "displayOrder",
        accessor: (record) => record,
        Header: <OrderTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          if (!hasUpdateAuth) {
            return value.displayOrder ?? null
          }

          let { id } = value
          let displayOrder = displayOrders[id] ?? value.displayOrder
          return (
            <NumberInput
              name={id}
              size="small"
              width="5em"
              defaultValue={displayOrder}
              required
              min="1"
              minLength="1"
              registerOptions={{
                valueAsNumber: true
              }}
              onChange={(event) => {
                let displayOrder = parseInt(event.target.value)
                if (Number.isFinite(displayOrder)) {
                  setDisplayOrder(id, displayOrder)
                }
              }}
            />
          )
        }
      },
      {
        accessor: "gameId",
        Header: <GameIdTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "gameProviderName",
        Header: <GameProviderNameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "gameName",
        Header: <GameNameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center"
        },
        cell: {
          textAlign: "center"
        }
      },
      {
        accessor: "gameType",
        Header: <GameTypeTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Text.Block whiteSpace="nowrap" data-game-type={value}>
              <GameTypeLabel value={value} />
            </Text.Block>
          )
        }
      },
      {
        accessor: "platform",
        Header: <SupportingDeviceTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          return (
            <Text.Block whiteSpace="nowrap">
              <GamePlatformLabel value={value} />
            </Text.Block>
          )
        }
      },
      {
        id: "isHot",
        accessor: (record) => record,
        Header: <HotGameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id, isHot } = value
          return (
            <Text.Block whiteSpace="nowrap">
              <GameTagSwitch
                id={id}
                tag={GameTag.Hot}
                checked={isHot}
                onSubmitted={mutate}
              />
            </Text.Block>
          )
        }
      },
      {
        id: "isNew",
        accessor: (record) => record,
        Header: <NewGameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id, isNew } = value
          return (
            <Text.Block whiteSpace="nowrap">
              <GameTagSwitch
                id={id}
                tag={GameTag.New}
                checked={isNew}
                onSubmitted={mutate}
              />
            </Text.Block>
          )
        }
      },
      {
        id: "isRecommend",
        accessor: (record) => record,
        Header: <RecommendGameTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id, isRecommend } = value
          return (
            <Text.Block whiteSpace="nowrap">
              <GameTagSwitch
                id={id}
                tag={GameTag.Recommend}
                checked={isRecommend}
                onSubmitted={mutate}
              />
            </Text.Block>
          )
        }
      },
      {
        id: "status",
        accessor: (record) => record,
        Header: <StatusTrans />,
        disableSortBy: true,
        headCell: {
          textAlign: "center",
          whiteSpace: "nowrap"
        },
        cell: {
          textAlign: "center"
        },
        Cell: ({ value }) => {
          let { id, status } = value
          return (
            <Box alignX="center">
              <GameStatusToggleSwitch
                id={id}
                value={status}
                onSubmitted={mutate}
              />
            </Box>
          )
        }
      }
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
          return (
            <Set orientation="vertical" alignX="center">
              <PlatformGameDetailButton
                id="edit-game-dialog-disclosure"
                record={value}
                onSubmitted={mutate}
              />
            </Set>
          )
        }
      })
    }

    return columns
  }, [JSON.stringify(items)])
}
