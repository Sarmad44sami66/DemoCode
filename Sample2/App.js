import React from 'react';
import {StatusBar} from 'react-native';
import Routing from './Routing';
import { AppearanceProvider } from 'react-native-appearance';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import store from './store';
import rootSaga from './saga/rootSaga'

StatusBar.setHidden(false);
StatusBar.setTranslucent(false);
console.disableYellowBox = true

const sagaMiddleware = createSagaMiddleware()

configureStore = () => {
    return {
        ...createStore(store, applyMiddleware(sagaMiddleware)),
        runSaga: sagaMiddleware.run(rootSaga)
    }
}

const mystore = configureStore();

const App = () =>
    <AppearanceProvider>
        <Provider store={mystore}>
            <Routing/>
        </Provider>
    </AppearanceProvider>

export default App;
