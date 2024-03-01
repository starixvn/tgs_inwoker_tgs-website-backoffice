import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Heading, Stack, Box, Button, Set, Alert, List, Spinner } from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { usePlayerIdentityList } from "./client"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useIsAdminUser
} from "../../user/context"
import { Code, View, Update } from "./menu"
import { Trans, useTrans } from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import BrandBar from "../../report/BrandBar"
import AlertDialog from "../../dialog/Alert"
import textColumn from "../../table/column/textColumn"
import { VipLevelLabel } from "../../vip-levels/VipLevel"
import { DateInputRangeField } from "../../date/DateTimeRangeInput"
import { startOfNextDay } from "../../date/startOfNextDay"
import { ReviewPlayerIdDialogDisclosure } from "./ReviewPlayerIdDialog"
import { isDev } from "../../env"
import { useBrand } from "../../merchant/platforms/client"
import PlayerIdentityState, {
  PlayerIdentitySelect,
  PlayerIdentityStateLabel
} from "./PlayerIdentityState"
import { Descending } from "../../table/order"
import { PlayerIdentityAttachment } from "./PlayerIdentityAttachment"
import { ResetPlayerIdentityAuthDisclosure } from "./ResetPlayerIdentityAuth"
import {
  ICNumberTrans,
  RealNameTrans,
  UserNameTrans,
  useUserNameTrans
} from "../../trans/User"
import { ActionTrans, RemarkTrans } from "../../trans/Action"
import { ApplicationTimeTrans, VerifiedTimeTrans } from "../../trans/Date"
import { StatusTrans } from "../../trans/Status"
import {
  PlayerIdVerificationInfoTrans,
  PlayerIdVerificationTrans
} from "../../trans/Player"
import { AttachmentTrans } from "../../trans/Field"

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
    </Set>
  )
}

const BodyContent = ({ brandId = "", brand }) => {
  let { state, setState, setPageIndex, setSortOrder } = useTable({
    status: PlayerIdentityState.WaitingVerify,
    username: ""
  })

  useEffect(() => {
    setState({ pageIndex: 0, brandId })
  }, [brandId])

  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = usePlayerIdentityList({
    ...toApiParams(state),
    /*
    sortby: "createdOn",
    orderby: Descending,
    */
    brandId,
    endCreatedOn: startOfNextDay(state.endCreatedOn),
    endReviewedOn: startOfNextDay(state.endReviewedOn)
  })

  let columns = useColumns({
    mutate,
    items: data?.items,
    brandId,
    brand
  })

  return (
    <PageContent
      title={<PlayerIdVerificationTrans />}
      actionBar={
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
      }
    >
      <Stack>
        <Alert variant="bordered" type="info" accent marginBottom="1rem">
          <List listStyleType="disc" listStylePosition="inside">
            <List.Item>
              <PlayerIdVerificationInfoTrans />
            </List.Item>
          </List>
        </Alert>
      </Stack>
      <Table
        columns={columns}
        data={data?.items}
        initialState={state}
        controlledState={state}
        pageCount={pageCount(state.pageSize, data?.totalCount)}
        setPageIndex={setPageIndex}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.playerCode}
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({ brandId, status, search, isLoading, ...props }) => {
  let usernameInputPlaceholder = useUserNameTrans()

  let formMethods = useForm({ defaultValues: { status } })

  const onSubmit = (data) => search?.(data)

  const maxRangeDays = 31
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set alignY="bottom">
          <PlayerIdentitySelect name="status" />
          <InputField
            name="username"
            showEmptyFieldValueAddonAfter
            placeholder={usernameInputPlaceholder}
            autocomplete="off"
          />
          <DateInputRangeField
            label={<ApplicationTimeTrans />}
            startProps={{
              name: "beginCreatedOn"
            }}
            endProps={{
              name: "endCreatedOn"
            }}
            maxRangeDays={maxRangeDays}
          />
          <DateInputRangeField
            label={<VerifiedTimeTrans />}
            startProps={{
              name: "beginReviewedOn"
            }}
            endProps={{
              name: "endReviewedOn"
            }}
            maxRangeDays={maxRangeDays}
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ mutate, items = [], brandId, brand } = {}) => {
  let hasViewAuth = useIsDisplayMenuByRoute([View])
  let hasUpdateAuth = useIsDisplayMenuByRoute([Update])
  let hasAnyMenu = hasViewAuth || hasUpdateAuth

  let enablePlayerIdentity = brand?.enablePlayerIdentity
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
        accessor: "idNumber",
        Header: <ICNumberTrans />,
        disableSortBy: true
      }),
      textColumn({
        id: "attachment",
        accessor: (row) => row,
        Header: <AttachmentTrans />,
        disableSortBy: true,
        Cell: ({ value: record }) => {
          let { playerCode, formId, status, attachmentId } = record

          return (
            <PlayerIdentityAttachment
              alignX="center"
              alignY="center"
              brandId={brandId}
              playerCode={playerCode}
              attachmentId={attachmentId}
              status={status}
              enablePlayerIdentity={enablePlayerIdentity}
              onUploaded={() => {
                mutate(null)
              }}
            />
          )
        }
      }),
      textColumn({
        accessor: "status",
        Header: <StatusTrans />,
        disableSortBy: true,
        Cell: ({ value }) => <PlayerIdentityStateLabel value={value} />
      }),
      textColumn({
        accessor: "remark",
        Header: <RemarkTrans />,
        disableSortBy: true
      })
    ]

    if (hasAnyMenu) {
      columns.push(
        textColumn({
          id: "actions",
          accessor: (row) => row,
          Header: <ActionTrans />,
          disableSortBy: true,
          Cell: ({ value: record }) => {
            let { playerCode, formId, status } = record
            return (
              <Set alignX="center">
                {enablePlayerIdentity && (
                  <ReviewPlayerIdDialogDisclosure
                    id="review-player-id-dialog-disclosure"
                    brandId={brandId}
                    playerCode={playerCode}
                    formId={formId}
                    status={status}
                    onSubmitted={mutate}
                  />
                )}
                {enablePlayerIdentity && (
                  <ResetPlayerIdentityAuthDisclosure record={record} />
                )}
              </Set>
            )
          }
        })
      )
    }
    return columns
  }, [JSON.stringify(items)])
}
