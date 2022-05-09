import React, { useState, useEffect, useMemo, useRef, useContext } from "react"
import { css, Global } from "@emotion/react"
import {
  Spinner,
  Stack,
  Flex,
  Box,
  Card,
  Set,
  Icon,
  Button,
  FieldStack,
  Group
} from "bumbag"
import AlertDialog from "../../dialog/Alert"
import { Tab as _Tab, TabPanel } from "../../tab"
import clone from "clone-deep"
import {
  useAgentDomainList,
  useAddAgentDomain,
  useDeleteAgentDomain
} from "./client"
import { InputField, Input } from "../../input/Input"
import { Trans, FormattedDateTime, FormattedNumber, useTrans } from "../../i18n"
import { last } from "lodash-es"
import DeleteButton from "../../button/DeleteButton"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import {
  AgentIngressApplyButton,
  AgentIngressDeleteButton
} from "./AgentIngress"
import {
  AgentDnsZoneCreateButton,
  AgentDnsZoneDeleteButton
} from "./AgentDnsZone"
import { UpdateIngress, UpdateDnsZone, UpdateDomain } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { LinkButton } from "../../button/LinkButton"

const Key = "AgentDomainList"

export const AgentDomainListTab = ({ brandId, agentId, ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="代理连结" en="Agent Links" />
    </_Tab>
  )
}

export const AgentDomainListPanel = ({
  brandId,
  agentId,
  readOnly,
  ...props
}) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  return (
    isActive && (
      <Body
        brandId={brandId}
        agentId={agentId}
        readOnly={readOnly}
        {...props}
      />
    )
  )
}

const Body = ({ brandId, agentId, readOnly, ...props }) => {
  let editIngress = useIsDisplayMenuByRoute([UpdateIngress])
  let editDnsZone = useIsDisplayMenuByRoute([UpdateDnsZone])
  let {
    isLoading,
    data: urls,
    error,
    mutate,
    deleteCache
  } = useAgentDomainList(brandId, agentId)

  if (isLoading) {
    return (
      <TabPanel tabId={Key} {...props}>
        <Box alignX="center">
          <Spinner />
        </Box>
      </TabPanel>
    )
  }

  let domains = urls?.map((url) => ({
    url,
    fromServer: true
  }))

  let editable = !readOnly
  return (
    <TabPanel tabId={Key} {...props}>
      <FieldStack>
        {editable && (
          <Set>
            {editDnsZone && <AgentDnsZoneCreateButton agentId={agentId} />}
            {editDnsZone && <AgentDnsZoneDeleteButton agentId={agentId} />}
            {editIngress && <AgentIngressApplyButton agentId={agentId} />}
            {editIngress && <AgentIngressDeleteButton agentId={agentId} />}
          </Set>
        )}
        <DomainList
          brandId={brandId}
          agentId={agentId}
          domains={domains}
          readOnly={readOnly}
          onSubmitted={() => {
            deleteCache()
            mutate(null)
          }}
        />
      </FieldStack>
      {error && <AlertDialog {...error} onClickClose={deleteCache} />}
    </TabPanel>
  )
}

const DomainList = ({
  brandId,
  agentId,
  domains = [],
  readOnly,
  onSubmitted
}) => {
  let editDomain = useIsDisplayMenuByRoute([UpdateDomain])
  let [items, setItems] = useState(domains)

  let showAddButton = items.length === 0 || last(items)?.fromServer
  return (
    <FieldStack>
      {items.map(({ url, fromServer }) => (
        <DomainInputField
          brandId={brandId}
          agentId={agentId}
          url={url}
          fromServer={fromServer}
          readOnly={readOnly}
          onSubmitted={onSubmitted}
        />
      ))}
      {readOnly && items.length === 0 && (
        <Trans zh="查无资料" en="No Search Result" />
      )}
      {editDomain && !readOnly && showAddButton && (
        <Button
          id="add-domain-input"
          onClick={() => {
            setItems([...items, { url: "", fromServer: false }])
          }}
        >
          <Icon icon={faPlus} type="font-awesome" />
        </Button>
      )}
    </FieldStack>
  )
}

const DomainInputField = ({ fromServer = false, ...props }) => {
  return fromServer ? (
    <DeleteDomainInputField {...props} />
  ) : (
    <AddDomainInputField {...props} />
  )
}

const AddDomainInputField = ({
  brandId,
  agentId,
  url,
  onSubmitted,
  ...props
}) => {
  let [domain, setDomain] = useState()
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useAddAgentDomain(
    brandId,
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate(null, false)
  }

  return (
    <>
      <InputField
        autoFocus
        value={domain}
        onChange={(event) => {
          let value = event.target.value
          setDomain(value)
        }}
        disabled={isLoading}
        addonAfter={
          <Button
            id="add-domain"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={(event) => {
              setSubmit(domain)
            }}
          >
            <Trans zh="新增" en="New" />
          </Button>
        }
        {...props}
      />
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const DeleteDomainInputField = ({
  brandId,
  agentId,
  url,
  readOnly,
  onSubmitted,
  ...props
}) => {
  let editDomain = useIsDisplayMenuByRoute([UpdateDomain])
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useDeleteAgentDomain(
    brandId,
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      reset()
      onSubmitted?.()
    }
  }, [result])

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate(null, false)
  }

  return (
    <Set orientation="horizontal" isFilled>
      <InputField value={url} readOnly flex="1" />
      <LinkButton url={`https://whois.domaintools.com/${url}`}>
        <Trans en="Lookup Domain" zh="检查域名" />
      </LinkButton>
      {editDomain && !readOnly && (
        <DeleteButton
          id="delete-domain"
          borderLeftWidth="1px"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            setSubmit(url)
          }}
        />
      )}
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </Set>
  )
}
