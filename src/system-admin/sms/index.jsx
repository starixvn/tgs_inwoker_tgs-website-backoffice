import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Button, Set, Icon, Level, Spinner } from "bumbag"
import { PageContent } from "../../page/Content"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { Code, View, Update } from "./menu"
import { useFormContext, useForm, FormProvider } from "react-hook-form"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import { SearchButton } from "../../button/SearchButton"
import {
  PlatformPageContent,
  usePlatformId
} from "../../page/PlatformPageContent"
import { useSmsList, usePlatformSmsList } from "./client"
import AlertDialog from "../../dialog/Alert"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  //TODO: title
  return (
    <PageContent title="Sms">
      <Body />
    </PageContent>
  )
}

export const CodeContentPair = [Code, Content]

const Body = () => {
  let { isLoading, data, error, mutate } = useSmsList()

  return (
    <Set orientation="vertical" isFilled height="100%">
      {isLoading && <Spinner />}
      {!isLoading && JSON.stringify(data)}
      {error && (
        <AlertDialog {...error} onClickClose={() => mutate([], false)} />
      )}
    </Set>
  )
}

//TODO: seems no need?
const SearchBar = ({ search, isLoading }) => {
  let formMethods = useForm()
  const onSubmit = (data) => search?.(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}
