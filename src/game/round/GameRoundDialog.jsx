import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  FieldStack,
  Text,
  Box,
  Button,
  Dialog,
  Columns,
  Set,
  Card,
  Link,
  Table
} from "bumbag"
import {
  useTrans,
  Trans,
  FormattedNumber,
  useLangCode,
  FormattedNumberDecimal
} from "../../i18n"
import { useGameRound } from "./client"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { FieldValues, TwoColumns } from "../../layout/Grid"
import { NormalLabel } from "../../form/Label"
import defaultFormatDateTime from "../../date/format"
import { GameRoundStatusLabel } from "./GameRoundStatus"
import { CloseButtonFooter } from "../../form/ConfirmButtonFooter"
import MonacoEditor, { loader } from "@monaco-editor/react"
import Textarea from "../../textarea"
import formatXml from "xml-formatter"
import { stringifyJSON } from "../../text/json"
import { ConfigPaths } from "../../text/editor/MonacoEditor"

loader.config({
  paths: ConfigPaths
})

export const GameRoundDialog = ({
  record = {},
  dialog,
  hideBackdrop,
  ...props
}) => {
  let { id } = record
  let language = useLangCode()
  let {
    isLoading,
    data = {},
    error
  } = useGameRound(id, {
    gameProviderCode: record.gameProviderCode,
    playerCode: record.playerCode,
    language
  })

  let title = useTrans({
    zh: "订单详情",
    en: "Order Detail"
  })

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return (
    <Dialog.Modal
      id="game-round-dialog"
      title={title}
      showCloseButton
      hideOnClickOutside={false}
      maxWidth="100vw"
      minWidth="80vw"
      placement="top"
      hideBackdrop={hideBackdrop}
      footer={<CloseButtonFooter dialog={dialog} />}
      {...dialog}
      {...props}
    >
      <Set orientation="vertical" isFilled>
        <Columns flexWrap="nowrap" spacing="major-4" marginBottom="0">
          <Columns.Column>
            <FieldValues>
              <NormalLabel>
                <Trans zh="用户名" en="Player Name" />
              </NormalLabel>
              <Box alignY="center">{record.playerName}</Box>

              <NormalLabel>
                <Trans zh="订单ID" en="Order ID" />
              </NormalLabel>
              <Box alignY="center">{record.id}</Box>

              <NormalLabel>
                <Trans zh="投注时间" en="Created On" />
              </NormalLabel>
              <Box alignY="center">
                {defaultFormatDateTime(record.createdOn)}
              </Box>

              <NormalLabel>
                <Trans zh="结算时间" en="Closed On" />
              </NormalLabel>
              <Box alignY="center">
                {defaultFormatDateTime(record.closedOn)}
              </Box>
            </FieldValues>
          </Columns.Column>
          <Columns.Column>
            <FieldValues>
              <NormalLabel>
                <Trans zh="三方用户名" en="Player Code" />
              </NormalLabel>
              <Box alignY="center">{record.playerCode}</Box>

              <NormalLabel>
                <Trans zh="三方订单ID" en="External ID" />
              </NormalLabel>
              <Box alignY="center">{record.externalRoundId}</Box>

              <NormalLabel>
                <Trans zh="三方投注时间" en="External Created On" />
              </NormalLabel>
              <Box alignY="center">
                {defaultFormatDateTime(record.externalCreatedOn)}
              </Box>

              <NormalLabel>
                <Trans zh="三方结算时间" en="External Closed On" />
              </NormalLabel>
              <Box alignY="center">
                {defaultFormatDateTime(record.externalClosedOn)}
              </Box>
            </FieldValues>
          </Columns.Column>
        </Columns>

        <Box
          border="default"
          height="1px"
          width="100%"
          borderBottom="none"
        ></Box>
        <Columns flexWrap="nowrap" spacing="major-4" marginTop="minor-1">
          <Columns.Column>
            <FieldValues>
              <NormalLabel>
                <Trans zh="游戏厂商" en="Game Provider" />
              </NormalLabel>
              <Box alignY="center">{record.gameProviderName}</Box>

              <NormalLabel>
                <Trans zh="游戏名称" en="Game Name" />
              </NormalLabel>
              <Box alignY="center">{record.gameName}</Box>

              <NormalLabel>
                <Trans zh="投注金额" en="Bet Amount" />
              </NormalLabel>
              <Box alignY="center">
                <FormattedNumberDecimal
                  id="bet-amount"
                  value={record.betAmount}
                />
              </Box>

              <NormalLabel>
                <Trans zh="有效投注" en="Valid Bet Amount" />
              </NormalLabel>
              <Box alignY="center">
                <FormattedNumberDecimal value={record.validBetAmount} />
              </Box>

              <NormalLabel>
                <Trans zh="流水" en="Turnover" />
              </NormalLabel>
              <Box alignY="center">
                <FormattedNumberDecimal value={record.turnover} />
              </Box>

              <NormalLabel>
                <Trans zh="输赢金额" en="Win Loss" />
              </NormalLabel>
              <Box alignY="center">
                <FormattedNumberDecimal value={record.winLoss} />
              </Box>

              <NormalLabel>
                <Trans zh="订单状态" en="Status" />
              </NormalLabel>
              <Box alignY="center">
                <GameRoundStatusLabel value={record.status} />
              </Box>

              <NormalLabel>
                <Trans zh="开奖结果" en="Game Result" />
              </NormalLabel>
              <Box alignY="center">{data.gameResult}</Box>
            </FieldValues>
          </Columns.Column>
          <Columns.Column>
            <FieldValues>
              <NormalLabel>
                <Trans zh="子游戏厂商" en="Sub Game Provider" />
              </NormalLabel>
              <Box alignY="center">{record.subGameProviderName}</Box>

              <NormalLabel>
                <Trans zh="游戏局号" en="ID" />
              </NormalLabel>
              <Box alignY="center">{record.id}</Box>

              <NormalLabel>
                <Trans zh="有效投注" en="Valid Bet Amount" />
              </NormalLabel>
              <Box alignY="center">
                <FormattedNumberDecimal value={record.validBetAmount} />
              </Box>

              <EmptyPlaceholderField />
              <EmptyPlaceholderValue />

              <EmptyPlaceholderField />
              <EmptyPlaceholderValue />
            </FieldValues>
          </Columns.Column>
        </Columns>
        <GameRoundDataCard value={data?.data} />
      </Set>
    </Dialog.Modal>
  )
}

const EmptyPlaceholderField = () => (
  <NormalLabel visibility="hidden">
    <Trans zh="Placeholder" en="Placeholder" />
  </NormalLabel>
)

const EmptyPlaceholderValue = () => (
  <Text.Block visibility="hidden"></Text.Block>
)

const GameRoundDataCard = ({ value: items = [], ...props }) => {
  return (
    <Card
      title={<Trans zh="开奖结果" en="Result" />}
      variant="bordered"
      spacing="major-1"
    >
      <Set orientation="vertical" isFilled>
        {items.map((item, index) => (
          <GameRoundDataContent key={index} value={item} />
        ))}
      </Set>
    </Card>
  )
}

//TODO: sync with backend
const ContentType = {
  Url: "Url", //1,
  Table: "Table", //2,
  Text: "Text", //3,
  Json: "Json", //4,
  Xml: "Xml" //5
}
const GameRoundDataContent = ({
  value: { type = "", ...record } = {},
  ...props
}) => {
  console.warn("TODO: GameRoundDataContent type:", type, "record: ", record)
  switch (type) {
    case ContentType.Url:
      return <UrlContent {...record} />

    case ContentType.Json:
      return <JsonContent {...record} />

    case ContentType.Table:
      return <TableContent {...record} />

    case ContentType.Text:
      return <Textarea value={record?.value ?? ""} />

    case ContentType.Xml:
      return <XmlContent {...record} />
    default:
      return null
  }
}

const UrlContent = ({ url = "" }) => {
  return (
    <Link.Block href={url} target="_blank">
      {url}
    </Link.Block>
  )
}

const JsonContent = ({ value = "" }) => {
  if (!value) {
    return null
  }

  let formattedValue = stringifyJSON(value)
  return (
    <MonacoEditor
      defaultLanguage="JSON"
      height="25vh"
      value={formattedValue}
      options={{
        readOnly: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        contextmenu: false,
        hideCursorInOverviewRuler: true
      }}
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
    />
  )
}

const XmlContent = ({ value = "", ...props }) => {
  let formattedValue = formatXml(value)
  return (
    <MonacoEditor
      defaultLanguage="XML"
      height="25vh"
      value={formattedValue}
      options={{
        readOnly: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        contextmenu: false,
        hideCursorInOverviewRuler: true
      }}
      css={css`
        border: 1px solid var(--bb-palette-white900, #000000);
        border-radius: 6px;
      `}
    />
  )
}

const TableContent = ({ headers = [], rows = [], ...props }) => {
  if (rows.length === 0) {
    return null
  }

  return (
    <Table>
      {headers.length && (
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <ContentHeader value={header} />
            ))}
          </Table.Row>
        </Table.Head>
      )}
      <Table.Body>
        {rows.map((row) => (
          <ContentRow headers={headers} value={row} />
        ))}
      </Table.Body>
    </Table>
  )
}

const ContentHeader = ({ value = "" }) => (
  <Table.HeadCell>{value}</Table.HeadCell>
)

const ContentRow = ({ value: record, headers = [] }) => {
  return (
    <Table.Row>
      {headers.map((header) => {
        let value = Reflect.get(record, header)
        return <Table.Cell>{value}</Table.Cell>
      })}
    </Table.Row>
  )
}

export default GameRoundDialog
