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
  FieldStack
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

const Key = "AgentDomainList"

export const AgentDomainListTab = ({ brandId, agentId, ...props }) => {
  return (
    <_Tab tabId={Key} {...props}>
      <Trans zh="代理连结" en="Agent Links" />
    </_Tab>
  )
}

export const AgentDomainListPanel = ({ brandId, agentId, ...props }) => {
  let { selectedId } = props
  let isActive = selectedId === Key

  return isActive && <Body brandId={brandId} agentId={agentId} {...props} />
}

const Body = ({ brandId, agentId, ...props }) => {
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

  return (
    <TabPanel tabId={Key} {...props}>
      <DomainList
        brandId={brandId}
        agentId={agentId}
        isLoading={isLoading}
        domains={domains}
        onSubmitted={() => {
          deleteCache()
          mutate(null)
        }}
      />
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
          onSubmitted={onSubmitted}
        />
      ))}
      {showAddButton && (
        <Button
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
      onSubmitted?.()
    }
  }, [result])

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate()
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
            isLoading={isLoading}
            disabled={isLoading}
            onClick={(event) => {
              setSubmit(domain)
            }}
          >
            <Trans zh="新增" en="New" />
          </Button>
        }
      />
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}

const DeleteDomainInputField = ({
  brandId,
  agentId,
  url,
  onSubmitted,
  ...props
}) => {
  let [formData, setSubmit] = useState()
  let { isLoading, result, error, mutate, deleteCache } = useDeleteAgentDomain(
    brandId,
    agentId,
    formData
  )

  useEffect(() => {
    if (result && !error) {
      onSubmitted?.()
    }
  }, [result])

  const reset = () => {
    setSubmit(undefined)

    deleteCache()
    mutate()
  }

  return (
    <>
      <InputField
        value={url}
        readOnly
        addonAfter={
          <DeleteButton
            borderLeftWidth="1px"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => {
              setSubmit(url)
            }}
          />
        }
      />
      {error && <AlertDialog {...error} onClickClose={reset} />}
    </>
  )
}
