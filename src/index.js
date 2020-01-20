import React from "react";
import { render } from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persist } from "./store";
import { Provider } from "react-redux";
import Route from "./pages/route";
import { clientUtil } from "../src/utils/client.util"
import "./styles/default.scss"
import "./styles/buttons.scss"
import "./styles/spinner.scss"

clientUtil.setErrorHandler()
clientUtil.setDefaultInterceptors()

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persist}>
            <BrowserRouter>
                <Route />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
