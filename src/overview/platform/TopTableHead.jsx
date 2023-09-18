import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Heading, Stack, Box, Icon, Table } from "bumbag"
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons"

export const SortableHead = ({
  column,
  sortType,
  setSortType,
  ascending = false,
  setAscending,
  onClick,
  textAlign = "right",
  children,
  ...props
}) => {
  if (!onClick) {
    onClick = () => {
      let isSameColumn = sortType === column
      setSortType(column)
      if (isSameColumn) {
        setAscending(!ascending)
      } else {
        //click on diff column
        setAscending(false)
      }
    }
  }

  let sorting = column === sortType
  let notSorting = !sorting
  return (
    <Table.HeadCell
      onClick={onClick}
      textAlign={textAlign}
      css={css`
        cursor: pointer;
      `}
      {...props}
    >
      <Box>
        {children}
        {notSorting && <Icon icon={faSort} type="font-awesome" opacity="0.4" />}
        {sorting && ascending && (
          <Icon icon={faSortUp} type="font-awesome" color="blue" />
        )}
        {sorting && !ascending && (
          <Icon icon={faSortDown} type="font-awesome" color="blue" />
        )}
      </Box>
    </Table.HeadCell>
  )
}

export const SortDescendingOnlyHead = ({
  column,
  sortType,
  setSortType,
  ascending = false,
  setAscending,
  onClick,
  textAlign = "right",
  children,
  ...props
}) => {
  if (!onClick) {
    onClick = () => {
      setSortType(column)
      setAscending(false)
    }
  }

  let sorting = column === sortType
  let notSorting = !sorting
  return (
    <Table.HeadCell
      onClick={onClick}
      textAlign={textAlign}
      css={css`
        cursor: pointer;
      `}
      {...props}
    >
      <Box>
        {children}
        <Icon
          icon={faSortDown}
          type="font-awesome"
          color={sorting && "blue"}
          opacity={notSorting && "0.4"}
        />
      </Box>
    </Table.HeadCell>
  )
}
