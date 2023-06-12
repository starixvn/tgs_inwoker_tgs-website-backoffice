import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef
} from "react"
import { css, Global } from "@emotion/react"
import { Pagination, Set } from "bumbag"
import { Trans, useTrans } from "../i18n"

export const Footer = forwardRef(({ table, setPageIndex }, ref) => {
  let previousText = useTrans({
    zh: "前一页",
    en: "Previous page"
  })

  let nextText = useTrans({
    zh: "下一页",
    en: "Next page"
  })

  // TODO: how to measure height + margin?
  // let [paginationRef, paginationMeasure] = useMeasure()

  let { pageCount, totalCount, state, gotoPage } = table

  let infos = [state?.pageIndex, pageCount, totalCount].filter(Number.isFinite)
  let noFooter = infos.length === 0

  if (noFooter) {
    return null
  }

  const getPage = () => state.pageIndex + 1

  return (
    <Set
      ref={ref}
      orientation="horizontal"
      verticalBelow="mobile"
      alignY="center"
    >
      {pageCount > 0 && (
        <Pagination
          // ref={paginationRef}
          previousText={previousText}
          nextText={nextText}
          currentPage={getPage()}
          onChangePage={(page) => {
            let pageIndex = page - 1
            setPageIndex(pageIndex)

            gotoPage(pageIndex)
          }}
          numberOfPages={pageCount}
          marginTop="0"
          marginLeft="0"
          css={css`
            width: max-content;
            z-index: 0;
          `}
        />
      )}
      {Number.isFinite(totalCount) && (
        <Text>
          <Trans zh={`筆數：${totalCount}`} en={`Rows：${totalCount}`} />
        </Text>
      )}
    </Set>
  )
})
