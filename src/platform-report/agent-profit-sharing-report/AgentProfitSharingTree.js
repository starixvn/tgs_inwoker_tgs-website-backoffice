import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
  forwardRef,
  useCallback,
  createContext,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import { Icon, Set, Spinner, Box, Button, Table, Text, Link } from "bumbag"
import { Trans, FormattedNumber, FormattedNumberDecimal } from "../../i18n"
import { flattenDeep, set } from "lodash-es"
import clone from "clone-deep"
import {
  useAgentProfitSharingRootList,
  useAgentProfitSharingChildrenList
} from "./client"
import textColumn from "../../table/column/textColumn"
import { numberDecimalColumn } from "../../table/column/numberColumn"
import { AgentWinLossDialogDisclosure } from "./AgentWinLoss"
import { AgentBonusDetailDialogDisclosure } from "./AgentBonusDetail"
import { AgentTeamContributionDialogDisclosure } from "./AgentTeamContribution"

import { useScrollbarWidth } from "react-use"
import { FixedSizeList, VariableSizeList } from "react-window"
import { useMeasure } from "react-use"
import AutoSizer from "react-virtualized-auto-sizer"

import useVirtual from "react-cool-virtual"
import { useTable, useBlockLayout, useResizeColumns } from "react-table"
import {
  faAngleDown,
  faAngleRight,
  faCaretRight,
  faCaretDown
} from "@fortawesome/free-solid-svg-icons"

const StickyListContext = createContext()

export const AgentProfitSharingTree = ({ brandId, start, end }) => {
  let searchParams = {
    brandId,
    from: start,
    to: end,
    page: 1,
    rows: 20
  }
  let { isLoading, data, mutate } = useAgentProfitSharingRootList(searchParams)

  if (isLoading) {
    return "loading"
  }

  //TODO: error dialog
  return (
    <>
      <AgentProfitSharingTreeBody
        data={data?.items}
        total={data?.items?.length > 0 && data?.total}
        brandId={brandId}
        start={start}
        end={end}
      />
    </>
  )
}

const AgentProfitSharingTreeBody = ({ data, total, brandId, start, end }) => {
  let [value, setValue] = useState(data)

  let [fetchChildrenParent, setFetchChildrenParent] = useState()
  let [fetchParams, setFetchParams] = useState()
  let {
    isLoading,
    data: childrenData,
    mutate
  } = useAgentProfitSharingChildrenList(fetchParams)

  useEffect(() => {
    if (fetchChildrenParent && childrenData) {
      let path = fetchChildrenParent.path

      setValue((tree) => {
        let result = set(
          clone(tree),
          [...path, "children"],
          childrenData?.items
        )
        return result
      })

      setFetchChildrenParent(undefined)
      setFetchParams(undefined)
    }
  }, [fetchChildrenParent, fetchParams, childrenData])

  let columns = useMemo(
    () => [
      {
        id: "node",
        accessor: (row) => row,
        Header: "",
        TotalCell: () => <Trans zh="总计" en="Total" />,
        Cell: ({ value: node }) => {
          let { hasChildren, children, expended, depth } = node
          if (!hasChildren) {
            return null
          }

          return (
            <Button
              disabled={isLoading}
              isLoading={
                expended && fetchChildrenParent?.id === node.id && isLoading
              }
              marginLeft={`${depth}rem`}
              size="small"
              variant="ghost"
              onClick={() => {
                let expended = !node.expended
                if (expended && !children) {
                  setFetchChildrenParent(node)
                  setFetchParams({
                    id: node.id,
                    brandId,
                    from: start,
                    to: end,
                    page: 1,
                    rows: 20
                  })
                }

                setValue((tree) => {
                  let result = set(
                    clone(tree),
                    [...node.path, "expended"],
                    !node.expended
                  )
                  return result
                })
              }}
            >
              <Icon
                icon={expended ? faCaretDown : faCaretRight}
                type="font-awesome"
              />
            </Button>
          )
        }
      },
      textColumn({
        accessor: "username",
        Header: <Trans zh="代理用户名" en="Agent Username" />,
        TotalCell: () => null,
        textOverflow: "ellipsis",
        Cell: ({ value }) => <span title={value}>{value}</span>
      }),
      numberDecimalColumn({
        accessor: "depositAmount",
        sumColumn: "depositAmount",
        Header: <Trans zh="存款金额" en="Deposit Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "withdrawalAmount",
        sumColumn: "withdrawalAmount",
        Header: <Trans zh="提款金额" en="Withdrawal Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "bonusAmount",
        sumColumn: "bonusAmount",
        Header: <Trans zh="红利金额" en="Bonus Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "companyAdjustAmount",
        sumColumn: "companyAdjustAmount",
        Header: <Trans zh="公司调账" en="Co. Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "agentAdjustAmount",
        sumColumn: "agentAdjustAmount",
        Header: <Trans zh="代理调账" en="Agent Adjustment Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "betAmount",
        sumColumn: "betAmount",
        Header: <Trans zh="投注金额" en="Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "validBetAmount",
        sumColumn: "validBetAmount",
        Header: <Trans zh="有效投注" en="Valid Bet Amount" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        accessor: "turnover",
        sumColumn: "turnover",
        Header: <Trans zh="流水" en="Turnover" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "winLossAmount",
        accessor: (row) => row,
        sumColumn: "winLossAmount",
        toValue: (row) => row?.winLossAmount,
        Header: <Trans zh="公司输赢金额" en="Co. W/L" />,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <AgentWinLossDialogDisclosure
              brandId={brandId}
              agentId={value?.id}
              start={start}
              end={end}
              username={value?.username}
              value={value?.winLossAmount}
              use={Link}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "netProfit",
        sumColumn: "netProfit",
        Header: <Trans zh="净盈利" en="Net Profit" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "agentDividendAmount",
        accessor: (row) => row,
        sumColumn: "agentDividendAmount",
        toValue: (row) => row?.agentDividendAmount,
        Header: <Trans zh="分红金额" en="Profit Sharing Amount" />,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <AgentBonusDetailDialogDisclosure
              brandId={brandId}
              agentId={value?.id}
              start={start}
              end={end}
              username={value?.username}
              value={value?.agentDividendAmount}
              use={Link}
            />
          )
        }
      }),
      numberDecimalColumn({
        accessor: "fromPlayerAgentDividendAmount",
        sumColumn: "fromPlayerAgentDividendAmount",
        Header: <Trans zh="玩家贡献" en="Player Contribution" />,
        disableSortBy: true
      }),
      numberDecimalColumn({
        id: "fromTeamAgentDividendAmount",
        accessor: (row) => row,
        sumColumn: "fromTeamAgentDividendAmount",
        toValue: (row) => row?.fromTeamAgentDividendAmount,
        Header: <Trans zh="团队贡献" en="Team Contribution" />,
        TotalCell: ({ value }) => (
          <FormattedNumber value={value} format="0,0.00" digits={2} />
        ),
        disableSortBy: true,
        Cell: ({ value }) => {
          return (
            <AgentTeamContributionDialogDisclosure
              brandId={brandId}
              agentId={value?.id}
              start={start}
              end={end}
              username={value?.username}
              value={value?.fromTeamAgentDividendAmount}
              use={Link}
            />
          )
        }
      })
    ],
    [JSON.stringify(value), JSON.stringify(total)]
  )

  return <WindowTree data={flatten(value)} total={total} columns={columns} />
}

const MemoizedRow = ({ row, index, cellProps, style, ...props }) => {
  return useMemo(() => {
    return (
      <div
        {...row.getRowProps({
          style
        })}
        css={css`
          border-bottom: 1px solid var(--bb-palette-white800, #000000);
        `}
      >
        {row.cells.map((cell, index) => {
          return (
            <Box
              css={css`
                text-overflow: ellipsis;
                overflow: hidden;
                border-right: 1px solid
                  ${cell.column.isResizing
                    ? "var(--bb-palette-primary, #000000)"
                    : "var(--bb-palette-white800, #000000)"};
              `}
              {...cellProps}
              {...cell.getCellProps([{ ...cell?.column?.cell }])}
            >
              {cell.render("Cell")}
            </Box>
          )
        })}
      </div>
    )
  }, [row.id, row.expended, JSON.stringify(style), JSON.stringify(props)])
}

const WindowTree = ({ data = [], total, columns = [] }) => {
  const defaultColumn = useMemo(() => {
    return {
      minWidth: 50,
      width: 150,
      maxWidth: 300
    }
  }, [])

  let table = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useBlockLayout,
    useResizeColumns
  )

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow
  } = table

  let cellProps = Table.Cell.useProps({})

  let headRowProps = Table.Head.useProps()

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)

      return (
        <MemoizedRow
          row={row}
          index={index}
          cellProps={cellProps}
          style={style}
        />
      )
    },
    [prepareRow, rows, cellProps]
  )

  let tableProps = Table.useProps({ hasDividers: true })
  let headRowCellProps = Table.HeadCell.useProps()

  let scrollbarWidth = useScrollbarWidth()

  let [headRef, head] = useMeasure()
  return (
    <AutoSizer disableWidth>
      {({ height }) => {
        let listHeight = Math.max(height - (head?.height ?? 0), 50 * 3)
        return (
          <Box overflow="auto" {...tableProps} {...getTableProps()}>
            <div ref={headRef}>
              {headerGroups.map((headerGroup) => (
                <div {...headRowProps} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Box
                      css={css`
                        text-overflow: ellipsis;
                        overflow: hidden;
                      `}
                      {...headRowCellProps}
                      {...column.getHeaderProps({ ...column?.headCell })}
                    >
                      {column.render("Header")}
                      <div
                        {...column.getResizerProps()}
                        css={css`
                          display: inline-block;
                          background: ${column.isResizing
                            ? "var(--bb-palette-primary, #000000)"
                            : "var(--bb-palette-white800, #000000)"};
                          width: 3px;
                          height: 100%;
                          position: absolute;
                          right: 0;
                          top: 0;
                          transform: translateX(50%);
                          z-index: 1;
                          touch-action: none;
                        `}
                      />
                    </Box>
                  ))}
                </div>
              ))}
              {total && (
                <div
                  {...headRowProps}
                  {...headerGroups?.[0].getHeaderGroupProps()}
                >
                  {table?.columns.map((column) => {
                    let columnId = column?.id ?? column?.accessor

                    let Body = column.TotalCell ?? column.Cell
                    let value = total[columnId]

                    return (
                      <Box
                        css={css`
                          text-overflow: ellipsis;
                          overflow: hidden;
                          border-right: 1px solid
                            ${column.isResizing
                              ? "var(--bb-palette-primary, #000000)"
                              : "var(--bb-palette-white800, #000000)"};
                        `}
                        {...headRowCellProps}
                        {...column.getHeaderProps({ ...column?.headCell })}
                      >
                        <Body value={value} />
                      </Box>
                    )
                  })}
                </div>
              )}
            </div>
            <FixedSizeList
              height={listHeight}
              itemCount={rows.length}
              itemSize={50}
              width={totalColumnsWidth + scrollbarWidth}
            >
              {RenderRow}
            </FixedSizeList>
          </Box>
        )
      }}
    </AutoSizer>
  )
}

const toLists = (item) => {
  let children = item?.children?.map((child, childIndex) => {
    child.depth = item.depth + 1
    child.path = [...item.path, "children", childIndex]

    if (!child.expended) {
      return child
    }
    let result = toLists(child)
    return result
  })

  let result = children?.length > 0 ? [item, ...children] : [item]
  return result
}

const flatten = (data = []) => {
  let lists = data?.map((item, index) => {
    item.depth = 0
    item.path = [index]

    if (!item.expended) {
      return item
    }
    let result = toLists(item)
    return result
  })
  let flattened = flattenDeep(lists)
  return flattened
}
