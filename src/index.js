// react imports
import React from "react";
import ReactDOM from "react-dom/client";

// redux imports
import store from "./store/index";
import { Provider } from "react-redux";

// styles
import "./index.css";

// component imports
import App from "./App";

// library imports
import "./i18n";

// context imports
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthContextProvider>
      <ChatContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChatContextProvider>
    </AuthContextProvider>
  </Provider>
);
