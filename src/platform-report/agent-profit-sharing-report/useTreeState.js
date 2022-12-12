import React, { useState, useEffect, useMemo } from "react"

export const useTreeState = (data = []) => {
  let initialState = initState(data)
  let [state, setState] = useState(initialState)

  //TODO: how to update node state?
  //TODO: how to fetch children nodes?
  return {
    items: useFlatTreeList(state),
    initTreeState: (data) => setState(initState(data))
  }
}

const useFlatTreeList = (state = {}) => {
  let items = flatten([], state.rootIds, state)
  return items
}

const flatten = (list = [], ids = [], record = {}) => {
  return ids.reduce((list, id) => {
    let node = record[id]
    list.push(record[id])
    list.concat(flatten(list, node.childrenIds, record))
    return list
  }, list)
}

const initState = (data = []) => {
  let rootIds = toIds(data)
  let result = {
    rootIds,
    ...toIdNodeRecord({}, data)
  }
  return result
}

const toIdNodeRecord = (record = {}, nodes = [], depth = 0) => {
  return nodes.reduce((record, node) => {
    //TODO: clone item?
    record[node.id] = {
      node,
      depth,
      isLeaf: !(node?.children?.length > 0),
      isExpended: false,
      childrenIds: toIds(node.children)
    }
    return toIdNodeRecord(record, node.children, depth++)
  }, record)
}

const toIds = (items = []) => items.map((item) => item.id)
