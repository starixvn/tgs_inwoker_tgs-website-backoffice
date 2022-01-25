import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, DropdownMenu, Button, Group } from "bumbag"
import { useApplyAgentIngress, useDeleteAgentIngress } from "./client"
import AlertDialog from "../../dialog/Alert"

export const AgentIngressApplyButton = ({ agentId, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useApplyAgentIngress(formData)

  const reset = () => {
    setSubmit(undefined)
    mutate(null, false)
  }

  useEffect(() => {
    if (result) {
      reset()
    }
  }, [result])

  return (
    <>
      <Button
        onClick={(event) => {
          setSubmit(agentId)
        }}
        isLoading={isLoading}
        disabled={isLoading}
        {...props}
      >
        Apply Ingress
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

export const AgentIngressDeleteButton = ({ agentId, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useDeleteAgentIngress(formData)

  const reset = () => {
    setSubmit(undefined)
    mutate(null, false)
  }

  useEffect(() => {
    if (result) {
      reset()
    }
  }, [result])

  return (
    <>
      <Button
        palette="danger"
        variant="outlined"
        onClick={(event) => {
          setSubmit(agentId)
        }}
        isLoading={isLoading}
        disabled={isLoading}
        {...props}
      >
        Delete Ingress
      </Button>
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
