import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, DropdownMenu, Group, Button } from "bumbag"
import { useCreateAgentDnsZone, useDeleteAgentDnsZone } from "./client"
import AlertDialog from "../../dialog/Alert"

export const AgentDnsZoneCreateButton = ({ agentId, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useCreateAgentDnsZone(formData)

  const reset = () => {
    setSubmit(undefined)
    mutate(null)
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
        Create DNS Zone
      </Button>
      {error && <AlertDialog onClickClose={reset} />}
    </>
  )
}

export const AgentDnsZoneDeleteButton = ({ agentId, ...props }) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate } = useDeleteAgentDnsZone(formData)

  const reset = () => {
    setSubmit(undefined)
    mutate(null)
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
        Delete DNS Zone
      </Button>
      {error && <AlertDialog onClickClose={reset} />}
    </>
  )
}
