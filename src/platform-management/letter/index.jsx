import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Flex, Set, Button, Text, Icon, Level } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { Trans, useTrans } from "../../i18n"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import { View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import AlertDialog from "../../dialog/Alert"
import { SortOrder } from "../../table/order"
import { ConfirmDeleteDialogDisclosure } from "../../dialog/ConfirmDeleteDialog"
import { Input, InputField } from "../../input/Input"
import { useLetterList } from "./client"
import AutoSizer from "react-virtualized-auto-sizer"
import { SendLetterDialogDisclosure } from "./SendLetterDialog"
import textColumn from "../../table/column/textColumn"
import { BoxType, BoxTypeButtons, isInbox, isSentBox } from "./BoxType"
import SearchButton from "../../button/SearchButton"
import { ViewLetterDisclosure } from "./ViewLetter"
import { ReplyLetterDisclosure } from "./ReplyLetter"
import { faReply } from "@fortawesome/free-solid-svg-icons"
import { PlayerSelect } from "../../player-management/player-list/PlayerSelect"
import { LetterTypeLabel } from "./LetterType"
import { ActionTrans } from "../../trans/Action"
import { UserNameTrans } from "../../trans/User"
import { StationLetterTrans } from "../../trans/Platform"
import { SubjectTrans } from "../../trans/Field"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<StationLetterTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()

  let [boxType, setBoxType] = useState(BoxType.Inbox)

  let { state, setState, setPageIndex, setSortOrder } = useTable({
    brandId
  })

  useEffect(() => {
    setState({ pageIndex: 0 })
  }, [brandId])

  let toSearchParams = () => ({ ...toApiParams(state) })

  let { isLoading, data, error, mutate, deleteCache } = useLetterList(
    brandId,
    boxType,
    toSearchParams()
  )

  let items = data?.items
  let columns = useColumns({
    brandId,
    items,
    boxType
  })

  let pageWidth = usePlatformPageContentWidth()

  return (
    <Set orientation="vertical" isFilled height="100%">
      <Level alignY="bottom" alignX="left" verticalBelow="mobile">
        <SearchBar
          brandId={brandId}
          boxType={boxType}
          search={(data = {}) => {
            setState({
              pageIndex: 0,
              ...data
            })
            mutate(null, true)
          }}
        />
        <Box>
          <SendLetterDialogDisclosure
            brandId={brandId}
            onSubmitted={() => {
              if (isSentBox(boxType)) {
                mutate()
              }
            }}
          />
        </Box>
      </Level>
      <BoxTypeButtons
        onChange={(value) => {
          setState({
            player: "",
            operator: ""
          })

          deleteCache()
          mutate(null, true)

          setBoxType(value)
        }}
      />
      <Box flex="1 0 50%">
        <AutoSizer disableWidth={true}>
          {({ height }) => {
            let width = pageWidth
            return (
              <Table
                columns={columns}
                data={items}
                initialState={state}
                controlledState={state}
                pageCount={pageCount(state?.pageSize, data?.totalCount)}
                setPageIndex={setPageIndex}
                setSortOrder={setSortOrder}
                isLoading={isLoading}
                maxSize={{ height, width }}
                stickyHead
                getRowProps={({ original: { replied } } = {}) => {
                  if (replied) {
                    return {
                      //TODO: define white500 = #fefeff
                      backgroundColor: "#fefeff" //white500
                    }
                  }
                  return {}
                }}
              />
            )
          }}
        </AutoSizer>
      </Box>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </Set>
  )
}

const SearchBar = ({ brandId, boxType, search, isLoading }) => {
  let formMethods = useForm({
    defaultValues: {
      player: "",
      operator: ""
    }
  })

  let senderPlaceholder = useTrans({
    zh: "寄件人",
    en: "Sender"
  })

  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          {isInbox(boxType) && (
            <PlayerSelect id="player-select" name="player" brandId={brandId} />
          )}
          {isSentBox(boxType) && (
            <InputField
              name="operator"
              placeholder={senderPlaceholder}
              showEmptyFieldValueAddonAfter
            />
          )}
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ brandId, items = [], boxType }) => {
  return useMemo(() => {
    let columns = [
      dateTimeColumn({
        accessor: "sentOn",
        Header: <Trans zh="时间" en="Date" />,
        disableSortBy: true
      })
    ]

    if (isInbox(boxType)) {
      columns.push(
        textColumn({
          accessor: "sender",
          Header: <UserNameTrans />,
          disableSortBy: true
        })
      )
    } else if (isSentBox(boxType)) {
      columns.push(
        textColumn({
          accessor: "receiverType",
          Header: <Trans zh="收件人" en="Receiver" />,
          disableSortBy: true,
          Cell: LetterTypeLabel
        })
      )
    }

    columns.push(
      textColumn({
        id: "subject",
        accessor: (row) => row,
        Header: <SubjectTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center" alignY="center">
              {record.replied && (
                <Icon
                  icon={faReply}
                  type="font-awesome"
                  color="text200"
                  css={css`
                    transform: scaleX(-1);
                  `}
                />
              )}
              <Box>{record.subject}</Box>
            </Set>
          )
        }
      })
    )

    if (isSentBox(boxType)) {
      columns.push(
        textColumn({
          accessor: "operator",
          Header: <Trans zh="寄件人" en="Sender" />,
          disableSortBy: true
        })
      )
    }

    columns.push(
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <ActionTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          return (
            <Set alignX="center">
              <ViewLetterDisclosure
                brandId={brandId}
                boxType={boxType}
                letterId={record?.id}
              />
              <ReplyLetterDisclosure
                brandId={brandId}
                boxType={boxType}
                letterId={record?.id}
              />
            </Set>
          )
        }
      })
    )

    return columns
  }, [JSON.stringify(items)])
}
