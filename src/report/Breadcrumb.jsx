import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Box, Breadcrumb as _Breadcrumb, Set, Icon } from "bumbag"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

export const Breadcrumb = ({ items, item: Item = Link, onClickItem }) => {
  if (items.length === 0) {
    return null
  }

  return (
    <_Breadcrumb
      marginLeft="1rem"
      separator={
        <Icon icon={faChevronRight} type="font-awesome" color="gray" />
      }
    >
      {items.map((item, index, list) => {
        let path = list.slice(0, index + 1)

        let isCurrent = isLastIndex(index, list)
        return (
          <_Breadcrumb.Item isCurrent={isCurrent}>
            <Item value={item} onClick={onClickItem}>
              {item}
            </Item>
          </_Breadcrumb.Item>
        )
      })}
    </_Breadcrumb>
  )
}

const Link = ({ value, isCurrent, onClick, ...props }) => {
  return (
    <_Breadcrumb.Link
      onClick={(event) => {
        if (!isCurrent) {
          onClick(value)
        }
      }}
      {...props}
    >
      {value}
    </_Breadcrumb.Link>
  )
}
