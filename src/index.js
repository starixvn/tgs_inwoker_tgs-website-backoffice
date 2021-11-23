import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./reset.css"
import "./index.css"
import { Provider as BumbagProvider, ToastManager } from "bumbag"
import { Provider as UserProvider } from "./user/context"
import { BrowserRouter } from "react-router-dom"
import { Provider as I18nProvider } from "./i18n"
import {
  faTrash,
  faTrashAlt,
  faMinus,
  faEdit,
  faCog,
  faBell,
  faBars,
  faUser,
  faLanguage,
  faChevronCircleDown,
  faChevronCircleUp
} from "@fortawesome/free-solid-svg-icons"

const theme = {
  PageContent: {
    defaultProps: {
      breakpoint: "widescreen"
    }
  },
  icons: {
    iconSets: [
      {
        icons: [
          faTrash,
          faTrashAlt,
          faMinus,
          faEdit,
          faCog,
          faBell,
          faBars,
          faUser,
          faLanguage,
          faChevronCircleUp,
          faChevronCircleDown
        ],
        prefix: "solid-",
        type: "font-awesome"
      }
    ]
  }
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <BumbagProvider theme={theme}>
        <UserProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </UserProvider>
        <ToastManager />
      </BumbagProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
