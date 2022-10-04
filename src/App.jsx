import React, { useState, useEffect } from "react"
import { Global, css } from "@emotion/react"
import { Switch, Route, useLocation } from "react-router-dom"
import {
  Container,
  PageContent,
  PageWithHeader,
  PageWithSidebar,
  TopNav,
  SideNav,
  Stack,
  Box,
  DropdownMenu,
  Button,
  Text,
  Alert,
  Modal,
  Icon,
  Flex,
  useModalState,
  Image,
  usePage,
  Hide
} from "bumbag"
import {
  useIsAuthed as useUserIsAuthed,
  useMenuCodes,
  useUserId
} from "./user/context"
import { Form as Login, Path as LoginPath } from "./user/login"
import { Route as AuthRouter } from "./user/auth"
import { AllMenus } from "./menu"
import { AllContents } from "./content"
import { useUsername, useDeauth } from "./user/context"
import { SWRConfig } from "swr"
import { Trans, useLocale, Locales, useEnglish, useChinese } from "./i18n"
import { AdminUserChangePasswordDialog } from "./system/admins/edit"
import {
  getHeaderBackground,
  getHeaderButtonBackground,
  getHeaderButtonColor,
  getHeaderTitle,
  getHeaderTitleColor,
  getHeaderTitleFontSize,
  getHeaderTitleFontWeight,
  getHeaderImageUrl,
  isDev,
  Features,
  isFeatureEnabled
} from "./env"
import FundDepositTopNavItem from "./fund/deposit/FundDepositTopNavItem"
import FundWithdrawTopNavItem from "./fund/withdraw/FundWithdrawTopNavItem"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { init as initConnection } from "./connection"

//TODO: wait for PH's fix
if (isDev()) {
  initConnection()
}

function App() {
  let isUserAuthed = useUserIsAuthed()

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false
      }}
    >
      <Switch>
        <Route path={LoginPath}>
          <Login />
        </Route>
        <AuthRouter path="*">
          <Layout>
            <AllContents />
          </Layout>
        </AuthRouter>
      </Switch>
    </SWRConfig>
  )
}

const HeaderHeight = "60px"
const sidebarWidth = 250
const FooterHeight = "0px" //"30px"

const Layout = ({ children }) => {
  return (
    <PageWithHeader
      sticky
      header={<Header />}
      headerHeight={HeaderHeight}
      overflow="hidden"
    >
      <PageWithSidebar
        id="pageWithSidebar"
        sidebar={<Sidebar />}
        sidebarPlacement="left"
        sidebarWidth={`${sidebarWidth}px`}
        minHeight={`calc(100vh - ${HeaderHeight})`}
        maxHeight={`calc(100vh - ${HeaderHeight})`}
        overflow="hidden"
        css={css`
          & .bb-PageWithSidebarSidebarExpandedWrapper {
            width: ${getSidebarWidth()}px;
          }

          & .bb-PageWithSidebarContent {
            min-height: calc(100vh - ${HeaderHeight});
          }
        `}
      >
        <Box
          height={`calc(100vh - ${HeaderHeight})`}
          maxHeight={`calc(100vh - ${HeaderHeight})`}
          position="relative"
          overflow="auto"
        >
          <SidebarToggleButton />
          {children}
        </Box>
        {/* <Footer /> */}
      </PageWithSidebar>
    </PageWithHeader>
  )
}

const SidebarToggleButton = () => {
  let { sidebar, isCollapsed } = usePage()
  //if (!isDev()) {
  return null
  //}

  return (
    <Button
      onClick={sidebar.toggle}
      css={css`
        position: absolute;
        top: 1rem;
        left: -6px;
        padding: 0 1px;
      `}
    >
      <Icon
        icon={sidebar.isOpen ? faAngleRight : faAngleLeft}
        type="font-awesome"
      />
    </Button>
  )
}

export const getSidebarWidth = () => {
  let sidebarWrapper = document.querySelector(
    "#pageWithSidebar .bb-PageWithSidebarSidebarExpandedWrapper"
  )
  return sidebarWrapper?.offsetWidth ?? sidebarWidth
}

const Header = () => {
  let userId = useUserId()
  let usename = useUsername()
  let deauth = useDeauth()
  let { collapseBelow, ...page } = usePage()

  let changePasswordDialog = useModalState()

  const logout = () => {
    deauth()
    location.replace(LoginPath)
  }

  let imgUrl = getHeaderImageUrl()
  // let title = getHeaderTitle()
  return (
    <>
      <TopNav id="app-header" background={getHeaderBackground()}>
        <TopNav.Section>
          <TopNav.Item marginRight="0">
            <Button
              paddingLeft="0.65rem"
              paddingRight="0.65rem"
              color={getHeaderButtonColor()}
              onClick={page.sidebar.toggle}
              variant="ghost"
              boxShadow="none"
            >
              <Icon icon="solid-bars" />
            </Button>
          </TopNav.Item>
          <TopNav.Item marginLeft="-0.15rem">
            {imgUrl && <Image src={imgUrl} height="30px" filter="none" />}
            {/* {title && (
              <Text.Block
                lineHeight="normal"
                color={getHeaderTitleColor()}
                fontSize={getHeaderTitleFontSize()}
                fontWeight={getHeaderTitleFontWeight()}
                marginLeft="0.8rem"
              >
                {title}
              </Text.Block>
            )} */}
          </TopNav.Item>
        </TopNav.Section>
        <TopNav.Section marginRight="major-2">
          <FundDepositTopNavItem
            id="fund-deposit-notify"
            color={getHeaderButtonColor()}
            background={getHeaderButtonBackground()}
          />
          <FundWithdrawTopNavItem
            id="fund-withdraw-notify"
            color={getHeaderButtonColor()}
            background={getHeaderButtonBackground()}
          />
          <TopNav.Item>
            <DropdownMenu
              id="user-menu"
              menu={
                <>
                  <DropdownMenu.Item
                    id="change-password"
                    onClick={changePasswordDialog.show}
                  >
                    <Trans zh="修改密码" en="Change Password" />
                  </DropdownMenu.Item>
                  <DropdownMenu.Item id="logout" onClick={logout}>
                    <Trans zh="登出" en="Logout" />
                  </DropdownMenu.Item>
                </>
              }
            >
              <Button
                variant="ghost"
                iconAfter="chevron-down"
                color={getHeaderButtonColor()}
                background={getHeaderButtonBackground()}
              >
                <Hide above={collapseBelow}>
                  <Icon icon="solid-user" />
                </Hide>
                <Hide below={collapseBelow}>
                  <span id="username">{usename}</span>
                </Hide>
              </Button>
            </DropdownMenu>
          </TopNav.Item>
          <LangItem />
        </TopNav.Section>
      </TopNav>
      {changePasswordDialog.visible && (
        <AdminUserChangePasswordDialog
          userId={userId}
          dialog={changePasswordDialog}
        />
      )}
    </>
  )
}

const LangItem = ({ ...props }) => {
  let { collapseBelow, ...page } = usePage()

  let locale = useLocale()
  let chinese = "中文"
  let english = "English"

  let useEn = useEnglish()
  let useZh = useChinese()
  return (
    <TopNav.Item {...props}>
      <DropdownMenu
        menu={
          <>
            <DropdownMenu.Item onClick={useZh}>{chinese}</DropdownMenu.Item>
            <DropdownMenu.Item onClick={useEn}>{english}</DropdownMenu.Item>
          </>
        }
      >
        <Button
          variant="ghost"
          iconAfter="chevron-down"
          color={getHeaderButtonColor()}
          background={getHeaderButtonBackground()}
        >
          <Hide above={collapseBelow}>
            <Icon icon="solid-language" fontSize="500" />
          </Hide>
          <Hide below={collapseBelow}>
            {locale === Locales.zh && chinese}
            {locale === Locales.en && english}
          </Hide>
        </Button>
      </DropdownMenu>
    </TopNav.Item>
  )
}

const Sidebar = () => {
  let { pathname: selectedId } = useLocation()
  let { isCollapsed, sidebar } = usePage()

  //TODO: report bug to bumbag?
  useEffect(() => {
    if (!isCollapsed) {
      sidebar.drawer.hide()
    }
  }, [isCollapsed])

  return (
    <SideNav id="sidebar" selectedId={selectedId}>
      <AllMenus />
    </SideNav>
  )
}

const Footer = () => {
  return (
    <Box textAlign="center" height={FooterHeight}>
      <Text fontWeight="500" fontSize="150">
        version {import.meta.env.SNOWPACK_PUBLIC_VERSION}
      </Text>
    </Box>
  )
}

export default App
