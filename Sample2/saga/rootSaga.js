import { all } from 'redux-saga/effects';
import * as mySagas from './sagas'

function* rootSaga() {
    yield all([
        mySagas.watchLogin0401(),
        mySagas.watchLogin0402(),
        mySagas.watchLogin0411(),
        mySagas.watchLogin0421(),
        mySagas.watchRegistration0501(),
        mySagas.watchRegistration0502(),
        mySagas.watchRegistration0511(),
        mySagas.watchRegistration0512(),
        mySagas.watchRegistration0521(),
        mySagas.watchRegistration0531(),
        mySagas.watchRegistration0532(),
        mySagas.watchRegistration0541(),
        mySagas.watchRegistration0561(),
        mySagas.watchRegistration0571(),
        mySagas.watchNewShift0701(),
        mySagas.watchNewShift0731(),
        mySagas.watchNewShift0732(),
        mySagas.watchShiftFeed0801(),
        mySagas.watchShiftDetails1001(),
        mySagas.watchShiftDetails1011(),
        mySagas.watchShiftDetails1012(),
        mySagas.watchShiftDetails1051(),
        mySagas.watchShiftDetails1081(),
        mySagas.watchShiftDetails1091(),
        mySagas.watchProfileScreen2001(),
        mySagas.watchProfileScreen2002(),
        mySagas.watchActivityScreen3001(),
        mySagas.watchPaymentScreen4001(),
    ])
}
export default rootSaga
