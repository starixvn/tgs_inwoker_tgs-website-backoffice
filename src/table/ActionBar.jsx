import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef
} from "react"
import { css, Global } from "@emotion/react"
import {
  Icon,
  Set,
  Spinner,
  Box,
  DropdownMenu,
  Button,
  Popover,
  Group
} from "bumbag"
import { Trans, useTrans } from "../i18n"
import clone from "clone-deep"
import { get } from "lodash-es"
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CloseButton } from "../button/CloseButton"
import { isEmpty, complement } from "ramda"
import { useLocalStorage } from "react-use"
import { Checkbox } from "../checkbox"

const notEmpty = complement(isEmpty)

const Action = {
  ToggleColumnHidden: "toggleColumnHidden",
  ColumnOrder: "columnOrder",
  MenuAddonBefore: "menuAddonBefore",
  MenuAddonAfter: "menuAddonAfter"
}

export const useTableColumnHiddenLocalStorage = (
  tableLocalStorageKey = "",
  initialValue,
  options
) => {
  let key = `${tableLocalStorageKey}:hiddenColumns`
  return useLocalStorage(key, initialValue, options)
}

const ActionFields = Object.values(Action)

export const ActionBar = ({ table }) => {
  let showActionBar = !!ActionFields.find((actionField) => {
    let showAction = get(table, actionField)
    return showAction
  })

  if (!showActionBar) {
    return null
  }

  let { menuAddonBefore: MenuAddonBefore, menuAddonAfter: MenuAddonAfter } =
    table
  console.log("MenuAddonBefore", MenuAddonBefore)
  return (
    <Set
      orientation="horizontal"
      verticalBelow="tablet"
      css={css`
        width: max-content;
      `}
    >
      {MenuAddonBefore && <MenuAddonBefore table={table} />}
      <ToggleHiddenDropdownMenu table={table} />
      <ColumnOrderPopover table={table} />
      {MenuAddonAfter && <MenuAddonAfter table={table} />}
    </Set>
  )
}

const ToggleHiddenDropdownMenu = ({ table }) => {
  let popover = Popover.useState()

  let { allColumns, toggleColumnHidden, localStorageKey } = table

  let [hiddenColumnList, setHiddenColumnList] =
    useTableColumnHiddenLocalStorage(localStorageKey, [])

  if (!toggleColumnHidden) {
    return null
  }

  let availableColumns = allColumns.filter(
    ({ disableToggleHidden }) => !disableToggleHidden
  )

  let hiddenColumns = allColumns
    .filter(({ isVisible }) => !isVisible)
    .map(({ id }) => id)

  useEffect(() => {
    if (localStorageKey) {
      setHiddenColumnList(hiddenColumns)
    }
  }, [JSON.stringify(hiddenColumns)])

  return (
    <>
      <Popover.Disclosure use={Button} iconAfter="chevron-down" {...popover}>
        <Trans zh="筛选显示栏位" en="Filter" />
      </Popover.Disclosure>
      <Popover
        hasArrow
        {...popover}
        footer={
          <Box id="test-box" alignX="right" width="100%">
            <CloseButton width="max-content" onClick={popover.hide} />
          </Box>
        }
        css={css`
          overflow: hidden;
          & .bb-PopoverContent {
            max-height: 40vh;
            max-width: 85vw;
            overflow: auto;
          }

          & .bb-PopoverFooter > .bb-Box {
            width: 100%;
          }
        `}
      >
        <Set orientation="vertical">
          <ToggleAllHiddenColumnCheckbox columns={availableColumns} />
          {availableColumns.map((column) => (
            <ToggleHiddenColumnCheckbox key={column.id} column={column} />
          ))}
        </Set>
      </Popover>
    </>
  )
}

const ToggleAllHiddenColumnCheckbox = ({ columns = [] }) => {
  let isAllColumnVisible = !columns.find(({ isVisible }) => !isVisible)
  return (
    <Checkbox
      checked={isAllColumnVisible}
      label={<Trans zh={"全部"} en={"Default"} />}
      onChange={() => {
        columns.map((column) => {
          column.toggleHidden(isAllColumnVisible)
        })
      }}
    />
  )
}

const ToggleHiddenColumnCheckbox = ({ column }) => {
  return (
    <Checkbox
      {...column.getToggleHiddenProps()}
      label={toColumnHeader(column)}
      css={css`
        width: max-content;
      `}
    />
  )
}

const ColumnOrderButton = ({ column }) => {
  let {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
    isOver
  } = useSortable({
    id: column.id
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
    transition: transition
  }

  return (
    <Button
      type="button"
      ref={setNodeRef}
      palette={isDragging ? "primary" : isOver ? "success" : "default"}
      variant={isDragging || isOver ? "outlined" : "default"}
      {...attributes}
      {...listeners}
      style={style}
    >
      {toColumnHeader(column)}
    </Button>
  )
}

const toColumnHeader = (column, headers = []) => {
  if (notEmpty(column.Header)) {
    headers =
      headers.length === 0
        ? [column.Header]
        : [
            column.Header,
            <Icon icon="chevron-right" color="gray200" fontSize="150" />,
            ...headers
          ]
  }
  if (column?.parent) {
    return toColumnHeader(column.parent, headers)
  }
  return headers
}

const ColumnOrderPopover = ({ table }) => {
  let popover = Popover.useState()

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  )

  let { visibleColumns, setColumnOrder, columnOrder } = table
  if (!columnOrder) {
    return null
  }

  let items = visibleColumns.map((column) => {
    return column.id
  })

  function handleDragEnd(event) {
    console.log("onDragEnd event", event)
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)
      console.log("active", active, "over", over)
      let result = arrayMove(items, oldIndex, newIndex)
      setColumnOrder(result)
    }
  }

  //TODO: Popover need use "usePortal"?
  return (
    <>
      <Popover.Disclosure use={Button} {...popover}>
        Column Order
      </Popover.Disclosure>
      <Popover
        hasArrow
        {...popover}
        footer={
          <Box id="test-box" alignX="right" width="100%">
            <CloseButton width="max-content" onClick={popover.hide} />
          </Box>
        }
        css={css`
          max-width: 85vw;
          & .bb-PopoverFooter > .bb-Box {
            width: 100%;
          }
        `}
      >
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <Set>
            <SortableContext
              items={items}
              strategy={horizontalListSortingStrategy}
            >
              {visibleColumns.map((column) => {
                return <ColumnOrderButton key={column.id} column={column} />
              })}
            </SortableContext>
          </Set>
        </DndContext>
      </Popover>
    </>
  )
}

export default ActionBar
