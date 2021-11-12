import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import { Spinner, Stack, Flex, Box, Card, Set } from "bumbag"
import AlertDialog from "../../dialog/Alert"
import { Tab as _Tab, TabPanel } from "../../tab"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import clone from "clone-deep"
import { useUpdateAgent } from "./client"
import { DomainListFormBody } from "../../dialog/DomainListDialog"

const Key = "AgentDomainList"

export const AgentDomainListTab = ({ ...props }) => {
    return (
        <_Tab tabId={Key} {...props}>
          <Trans zh="域名" en="Domain" />
        </_Tab>
      )
}

export const AgentDomainListPanel = ({ agentId, record, ...props }) => {
    let { selectedId } = props
    let isActive = selectedId === Key

    //TODO: load agent domain list data?
    return isActive && <Body />
}

const Body = ({ agentId, domains = [], readOnly, ...props }) => {
    let formMethods = useForm({
        defaultValues: { domains: clone(domains) }
    })

    let [formData, setSubmit] = useState()
    let { isLoading, result, error, mutate, deleteCache } = useUpdateAgent(
        agentId,
        formData
    )

    return <DomainListFormBody />
}