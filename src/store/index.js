import thunk from "redux-thunk";
import reducers from "../reducers";
import storage from "redux-persist/lib/storage";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import { config } from "../config";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sideBar"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

const logger = createLogger({
  timestamps: true,
  duration: true
});

let middleware = [thunk];
if (config.REDUX_LOG_ENABLED) middleware = [...middleware, logger]; // Add middleware another here

const store = createStore(persistedReducer, applyMiddleware(...middleware));

const persist = persistStore(store);

export { persist, store };
