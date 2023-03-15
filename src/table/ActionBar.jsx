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

const notEmpty = complement(isEmpty)

const Action = {
  ToggleColumnHidden: "toggleColumnHidden",
  ColumnOrder: "columnOrder"
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

  return (
    <Set
      orientation="horizontal"
      verticalBelow="tablet"
      css={css`
        width: max-content;
      `}
    >
      <ToggleHiddenDropdownMenu table={table} />
      <ColumnOrderPopover table={table} />
    </Set>
  )
}

const ToggleHiddenDropdownMenu = ({ table }) => {
  let { allColumns, toggleColumnHidden } = table

  if (!toggleColumnHidden) {
    return null
  }

  let availableColumns = allColumns.filter(
    ({ disableToggleHidden }) => !disableToggleHidden
  )

  return (
    <DropdownMenu
      menu={availableColumns.map((column) => {
        let { checked, onChange, ...props } = column.getToggleHiddenProps()
        return (
          <DropdownMenu.Item
            key={column.id}
            iconBefore={checked ? "solid-check" : <Box />}
            onClick={(event) => {
              column.toggleHidden(checked)
            }}
            disabled={column.disableToggleHidden}
          >
            {toColumnHeader(column)}
          </DropdownMenu.Item>
        )
      })}
    >
      <Button iconAfter="chevron-down">
        <Trans zh="筛选显示栏位" en="Filter" />
      </Button>
    </DropdownMenu>
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
