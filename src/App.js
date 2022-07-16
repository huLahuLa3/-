import IndexRouter from "./router/IndexRouter"
import { Provider, provider } from 'react-redux'
import './App.css'
import './util/http'
import {store, persistor} from "./redux/staore"
import { PersistGate } from 'redux-persist/es/integration/react'
export default function App() {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <IndexRouter></IndexRouter>
    </PersistGate>
  </Provider>
}
