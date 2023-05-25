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
  Text
} from "bumbag"
import PageContent from "../../page/Content"
import sequenceColumn from "../../table/column/sequence"
import dateTimeColumn from "../../table/column/dateTime"
import { useTable, Table, pageCount, toApiParams } from "../../table"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId
} from "../../user/context"
import { Code } from "./menu"
import {
  FormattedNumber,
  FormattedNumberDecimal,
  Trans,
  useTrans
} from "../../i18n"
import SearchButton from "../../button/SearchButton"
import equals from "fast-deep-equal"
import { InputField } from "../../input/Input"
import AlertDialog from "../../dialog/Alert"
import textColumn, { ellipsisTextColumn } from "../../table/column/textColumn"
import numberColumn, {
  numberDecimalColumn,
  numberDecimalPercentageColumn
} from "../../table/column/numberColumn"
import { today } from "../../date/range"
import DateTimeRangeInput from "../../date/DateTimeRangeInput"
import { useAdminLogList } from "./client"
import { LogDetailDialogDisclosure } from "../LogDetailDialog"
import { CopyTextBox } from "../../text/CopyTextBox"
import { SortOrder } from "../../table/order"
import { LogExceptionDialogDisclosure } from "../LogExceptionDialog"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { parseJSON } from "../../text/json"
import { parseISO } from "date-fns"
import { JsonDiffEditor } from "../../text/editor/JsonDiffEditor"
import {
  isObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  get,
  set,
  unset
} from "lodash-es"
import { isNil } from "ramda"
import clone from "clone-deep"
import { mergeTrans } from "../../record/mergeTrans"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return <Body />
}

/*
const Test = () => {
  //TODO: how to replace json key
  let settings = {
    key: {
      key: {
        zh: "鑰匙",
        en: "Keyy"
      }
    },
    value: {
      key: {
        zh: "價值",
        en: "Valla",
        key: {
          zh: "秘密鑰匙",
          en: "SeaKey"
        }
      },
      zh: {
        key: {
          zh: "中文v",
          en: "ch v"
        }
      }
    },
    rule: {
      key: {
        zh: "規則",
        en: "rule"
      },
      playerAutoJoin: {
        key: {
          zh: "自動參加",
          en: "Auto Join"
        }
      },
      gameType: {
        key: {
          zh: "遊戲類型",
          en: "Game Type"
        }
      }
    },
    localization: {
      key: {
        zh: "多語系",
        en: "Localization"
      },
      "en-US": {
        key: {
          zh: "英文",
          en: "Eng"
        },
        desktopBanner: {
          key: {
            zh: "桌面Banner",
            en: "Desktop Banner"
          }
        }
      }
    },
    localizationArray: {
      key: {
        zh: "多語系 List",
        en: "Localization List"
      },
      "en-US": {
        key: {
          zh: "英文",
          en: "Eng"
        },
        desktopBanner: {
          key: {
            zh: "桌面Banner",
            en: "Desktop Banner"
          }
        }
      }
    },
    name: {
      key: {
        zh: "活动名称",
        en: "Promotion Name"
      }
    }
  }

  let a = {
    key: "mykey",
    value: {
      key: "value-key",
      zh: "zh valla",
      en: "en valla"
    },
    rule: {
      playerAutoJoin: true,
      percentage: 1,
      bonusAmountLimit: 2,
      turnoverMultiple: 3,
      gameType: "LiveDealer",
      gameProviderIds: ["8b0fe910-b8c6-440a-ae84-2f797b9a312f"]
    },
    autoSentPlayerBonus: true,
    localization: {
      "en-US": {
        name: "en title",
        subSubject: "en subtitle",
        desktopBanner:
          "http://localstack.localhost/tgs-project/promotion/aOimztA3hsF6YOhtTcKq3KOHxJqNyfsa.png",
        content: "<p>en rules</p>"
      },
      "id-ID": { name: "", subSubject: "" },
      "ja-JP": { name: "", subSubject: "" },
      "ko-KR": { name: "", subSubject: "" },
      "th-TH": { name: "", subSubject: "" },
      "vi-VN": { name: "", subSubject: "" },
      "zh-CN": {
        name: "中文 title",
        subSubject: "中文 subtitle",
        desktopBanner:
          "http://localstack.localhost/tgs-project/promotion/ladEDikUVysSGImvKSgNPBGeawVLnLmy.png",
        content: "<p>中文 條款</p>"
      },
      "zh-TW": { name: "", subSubject: "" }
    },
    localizationArray: [
      {
        "en-US": {
          name: "en title",
          subSubject: "en subtitle",
          desktopBanner:
            "http://localstack.localhost/tgs-project/promotion/aOimztA3hsF6YOhtTcKq3KOHxJqNyfsa.png",
          content: "<p>en rules</p>"
        }
      },
      {
        "zh-CN": {
          name: "中文 title",
          subSubject: "中文 subtitle",
          desktopBanner:
            "http://localstack.localhost/tgs-project/promotion/ladEDikUVysSGImvKSgNPBGeawVLnLmy.png",
          content: "<p>中文 條款</p>"
        },
        "zh-TW": { name: "", subSubject: "" }
      }
    ],
    name: "title",
    from: "2022-12-24T16:00:00.000Z",
    to: "2022-12-27T16:00:00.000Z",
    vipLevels: ["1"],
    promotionTypeGroup: "Turnover",
    promotionType: "TurnoverRebate",
    totalAmountLimit: 1000,
    unlimited: false,
    subSubject: "subtitle",
    gameTypeGroup: "LiveDealer",
    content: "<p>rules</p>",
    brandId: "4e86719f-243f-46f6-b010-5c758b7285af"
  }

  //TODO
  let b = {
    key: "mykey2",
    value: {
      key: "value-key2"
    },
    rule: {
      playerAutoJoin: true,
      percentage: 1,
      bonusAmountLimit: 2,
      turnoverMultiple: 3,
      gameType: "LiveDealer",
      gameProviderIds: ["8b0fe910-b8c6-440a-ae84-2f797b9a312f"]
    },
    autoSentPlayerBonus: true,
    localization: {
      "en-US": {
        name: "en title X",
        subSubject: "en subtitle X",
        desktopBanner:
          "http://localstack.localhost/tgs-project/promotion/aOimztA3hsF6YOhtTcKq3KOHxJqNyfsa.png",
        content: "<p>en rules</p>"
      },
      "id-ID": { name: "", subSubject: "" },
      "ja-JP": { name: "", subSubject: "" },
      "ko-KR": { name: "", subSubject: "" },
      "th-TH": { name: "", subSubject: "" },
      "vi-VN": { name: "", subSubject: "" },
      "zh-CN": {
        name: "中文 title X",
        subSubject: "中文 subtitle X",
        desktopBanner:
          "http://localstack.localhost/tgs-project/promotion/ladEDikUVysSGImvKSgNPBGeawVLnLmy.png",
        content: "<p>中文 條款</p>"
      },
      "zh-TW": { name: "", subSubject: "" }
    },
    localizationArray: [
      {
        "en-US": {
          name: "en title",
          subSubject: "en subtitle",
          desktopBanner:
            "http://localstack.localhost/tgs-project/promotion/aOimztA3hsF6YOhtTcKq3KOHxJqNyfsa.png",
          content: "<p>en rules</p>"
        }
      },
      {
        "zh-CN": {
          name: "中文 title",
          subSubject: "中文 subtitle",
          desktopBanner:
            "http://localstack.localhost/tgs-project/promotion/ladEDikUVysSGImvKSgNPBGeawVLnLmy.png",
          content: "<p>中文 條款</p>"
        },
        "zh-TW": { name: "", subSubject: "" }
      }
    ],
    name: "title X",
    from: "2022-12-24T16:00:00.000Z",
    to: "2022-12-27T16:00:00.000Z",
    vipLevels: ["1"],
    promotionTypeGroup: "Turnover",
    promotionType: "TurnoverRebate",
    totalAmountLimit: 1000,
    unlimited: false,
    subSubject: "subtitle",
    gameTypeGroup: "LiveDealer",
    content: "<p>rules</p>",
    brandId: "4e86719f-243f-46f6-b010-5c758b7285af"
  }
  return (
    <JsonDiffEditor
      original={JSON.stringify(mergeTrans({ settings, target: a }))}
      modified={JSON.stringify(mergeTrans({ settings, target: b }))}
    />
  )
}

const mergeTrans = ({ accum, lang = "zh", settings, target } = {}) => {
  if (isNil(accum)) {
    accum = isArray(target) ? [] : {}
  }

  return Object.entries(target).reduce((accum, [key, value]) => {
    //TODO: if value is a record or array?
    let clonedValue = clone(value)

    let settingRecord = get(settings, key)
    let trans = settingRecord?.key
    let tran = trans?.[lang]
    if (tran) {
      unset(accum, key)
      set(accum, tran, clonedValue)
    } else {
      set(accum, key, clonedValue)
    }

    let isDeep = !(isString(value) || isNumber(value) || isBoolean(value))
    if (isDeep) {
      if (isArray(value)) {
        value.map((target, index) => {
          let accum = clonedValue[index]
          let settings = settingRecord

          mergeTrans({
            accum,
            settings,
            target
          })
        })
      } else {
        mergeTrans({
          accum: clonedValue,
          settings: settingRecord,
          target: value
        })
      }
    }

    return accum
  }, accum)
}
*/

export const CodeContentPair = [Code, Content]

const StateQueryName = "state"
const Body = ({}) => {
  let { search, ...location } = useLocation()
  let navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams()

  let todayRange = today()

  let stateString = new URLSearchParams(search).get(StateQueryName)
  let initState = parseJSON(stateString) ?? {}
  if (typeof initState.from === "string") {
    initState.from = parseISO(initState.from)
  }
  if (typeof initState.to === "string") {
    initState.to = parseISO(initState.to)
  }
  let { state, setState, setPageIndex, setSortOrder } = useTable(initState)

  const syncSearchParams = (record) => {
    let search = `${StateQueryName}=${JSON.stringify(record)}`
    setSearchParams(search)
    /*
    TODO: setSearchParams?
    navigate.replace({
      search
    })
    */
  }

  let { pageIndex, pageSize } = state
  let {
    data = {},
    isLoading,
    mutate,
    error,
    deleteCache
  } = useAdminLogList({
    ...toApiParams(state),
    sortby: "RecordedOn",
    orderby: SortOrder.Descending
  })

  let columns = useColumns({ mutate, items: data?.items })

  return (
    <PageContent
      title={<Trans zh="Admin Logs" en="Admin Logs" />}
      actionBar={
        <SearchBar
          start={state?.from}
          end={state?.to}
          responseCode={state?.responseCode}
          trackingId={state?.trackingId}
          ip={state?.ip}
          path={state?.path}
          method={state?.method}
          serverName={state?.serverName}
          search={({ start, end, ...data } = {}) => {
            let record = {
              pageIndex: 0,
              from: start,
              to: end,
              ...data
            }
            setState(record)
            mutate()

            syncSearchParams(record)
          }}
          isLoading={isLoading}
        />
      }
    >
      <Table
        controlledState={state}
        columns={columns}
        data={data?.items}
        pageCount={pageCount(pageSize, data?.totalCount)}
        setPageIndex={(pageIndex) => {
          setPageIndex(pageIndex)

          syncSearchParams({ ...state, pageIndex })
        }}
        setSortOrder={setSortOrder}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        stickyHead
      />
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </PageContent>
  )
}

const SearchBar = ({
  start,
  end,
  responseCode,
  trackingId,
  ip,
  path,
  method,
  serverName,
  search,
  isLoading,
  ...props
}) => {
  let formMethods = useForm({
    defaultValues: {
      start,
      end,
      responseCode,
      trackingId,
      ip,
      path,
      method,
      serverName
    }
  })

  const onSubmit = (data) => search(data)

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Set>
          <DateTimeRangeInput showDateDropdownMenu />
          <InputField
            name="responseCode"
            showEmptyFieldValueAddonAfter
            placeholder="Response Code"
          />
          <InputField
            name="trackingId"
            showEmptyFieldValueAddonAfter
            placeholder="Tracking Id"
          />
          <InputField
            name="ip"
            showEmptyFieldValueAddonAfter
            placeholder="IP"
          />
          <InputField
            name="path"
            showEmptyFieldValueAddonAfter
            placeholder="Path"
          />
          <InputField
            name="method"
            showEmptyFieldValueAddonAfter
            placeholder="Method"
          />
          <InputField
            name="serverName"
            showEmptyFieldValueAddonAfter
            placeholder="Server Name"
          />
          <SearchButton isLoading={isLoading} disabled={isLoading} />
        </Set>
      </form>
    </FormProvider>
  )
}

const useColumns = ({ items = [] } = {}) => {
  return useMemo(() => {
    let columns = [
      textColumn({
        accessor: "id",
        Header: <Trans zh="Id" en="Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "trackingId",
        Header: <Trans zh="Tracking Id" en="Tracking Id" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "ip",
        Header: <Trans zh="Ip" en="Ip" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <CopyTextBox value={value} />
      }),
      textColumn({
        accessor: "path",
        Header: <Trans zh="Path" en="Path" />,
        disableSortBy: true,
        textAlign: "left",
        Cell: ({ value = "" }) => (
          <CopyTextBox value={value} alignX="left" textAlign="left" />
        )
      }),
      textColumn({
        accessor: "serverName",
        Header: <Trans zh="Server Name" en="Server Name" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "method",
        Header: <Trans zh="Method" en="Method" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "exception",
        Header: <Trans zh="Exception" en="Exception" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <LogExceptionDialogDisclosure value={value} />
      }),
      textColumn({
        accessor: "innerException",
        Header: <Trans zh="Inner Exception" en="Inner Exception" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <LogExceptionDialogDisclosure value={value} />
      }),
      textColumn({
        accessor: "stackTrace",
        Header: <Trans zh="Stack Trace" en="Stack Trace" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => <LogExceptionDialogDisclosure value={value} />
      }),
      textColumn({
        accessor: "responseCode",
        Header: <Trans zh="Response Code" en="Response Code" />,
        disableSortBy: true,
        Cell: ({ value = "" }) => value
      }),
      textColumn({
        accessor: "executionTimeMs",
        Header: <Trans zh="Execution Time Ms" en="Execution Time Ms" />,
        disableSortBy: true,
        Cell: ({ value }) => <FormattedNumber value={value} />
      }),
      dateTimeColumn({
        accessor: "recordedOn",
        Header: <Trans zh="Recorded On" en="Recorded On" />,
        disableSortBy: true
      }),
      textColumn({
        id: "actions",
        accessor: (row) => row,
        Header: <Trans zh="Actions" en="Actions" />,
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <Set alignX="center">
              <LogDetailDialogDisclosure record={value} />
            </Set>
          )
        }
      })
    ]

    return columns
  }, [JSON.stringify(items)])
}
