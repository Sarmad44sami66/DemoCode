import { put, call, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/Actions';
import * as APIs from '../api/APIs';
import * as mystorage from '../Utils/constants'
import Preference from 'react-native-preference';

//Login040
export function* Login0401(action) {
    try {
        const response = yield call(APIs.Login0401, action.params)
        if(response.data){
            Preference.set(mystorage.USER_TOKEN, response.data.key || '');
            Preference.set(mystorage.USER_ID, response.data.user || '');
            Preference.set(mystorage.PROFILE_ID, response.data.profile.id || '')
            Preference.set(mystorage.COMPANY_ID, response.data.company.id || '')
            Preference.set(mystorage.DATA_OBJECT, response.data || '')
            action.onSuccess(response.data);
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchLogin0401() {
    yield takeLatest(types.LOGIN0401_API, Login0401)
}

export function* Login0402(action) {
    try {
        const response = yield call(APIs.Login0402, action.params)
        if(response.data){
            action.onSuccess(response.data);
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchLogin0402() {
    yield takeLatest(types.LOGIN0402_API, Login0402)
}

//Login041
export function* Login0411(action) {
    try {
        const response = yield call(APIs.Login0411, action.params)
        if(response.data){
            action.onSuccess(response.data);
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchLogin0411() {
    yield takeLatest(types.LOGIN0411_API, Login0411)
}

//Login042
export function* Login0421(action) {
    try {
        const response = yield call(APIs.Login0421, action.params)
        if(response.data){
            action.onSuccess(response.data);
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchLogin0421() {
    yield takeLatest(types.LOGIN0421_API, Login0421)
}

//Registration050
export function* Registration0501(action) {
    try {
        const response = yield call(APIs.Registration0501, action.params)
        if(response.data){
            Preference.set(mystorage.USER_TOKEN, response.data.key || '');
            Preference.set(mystorage.USER_ID, response.data.user || '');
            Preference.set(mystorage.PROFILE_ID, response.data.profile.id || '')
            Preference.set(mystorage.COMPANY_ID, response.data.company.id || '')
            Preference.set(mystorage.DATA_OBJECT, response.data || '')
            action.onSuccess(response.data);
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0501() {
    yield takeLatest(types.REGISTRATION0501_API, Registration0501)
}

export function* Registration0502(action) {
    try {
        const response = yield call(APIs.Registration0502, action.params)
        if(response.data){    
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0502() {
    yield takeLatest(types.REGISTRATION0502_API, Registration0502)
}

//Registration051
export function* Registration0511(action) {
    try {
        const response = yield call(APIs.Registration0511, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0511() {
    yield takeLatest(types.REGISTRATION0511_API, Registration0511)
}

export function* Registration0512(action) {
    try {
        const response = yield call(APIs.Registration0512, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0512() {
    yield takeLatest(types.REGISTRATION0512_API, Registration0512)
}

//Registration052
export function* Registration0521(action) {
    try {
        const response = yield call(APIs.Registration0521, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0521() {
    yield takeLatest(types.REGISTRATION0521_API, Registration0521)
}

//Registration053
export function* Registration0531(action) {
    try {
        const response = yield call(APIs.Registration0531, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0531() {
    yield takeLatest(types.REGISTRATION0531_API, Registration0531)
}

export function* Registration0532(action) {
    try {
        const response = yield call(APIs.Registration0532, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0532() {
    yield takeLatest(types.REGISTRATION0532_API, Registration0532)
}

//Registration054
export function* Registration0541(action) {
    try {
        const response = yield call(APIs.Registration0541, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0541() {
    yield takeLatest(types.REGISTRATION0541_API, Registration0541)
}

//Registration056
export function* Registration0561(action) {
    try {
        const response = yield call(APIs.Registration0561, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0561() {
    yield takeLatest(types.REGISTRATION0561_API, Registration0561)
}

//Registration057
export function* Registration0571(action) {
    try {
        const response = yield call(APIs.Registration0571, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchRegistration0571() {
    yield takeLatest(types.REGISTRATION0571_API, Registration0571)
}

//NewShift070
export function* NewShift0701(action) {
    try {
        const response = yield call(APIs.NewShift0701)
        if(response.data){
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchNewShift0701() {
    yield takeLatest(types.NEWSHIFT0701_API, NewShift0701)
}

//NewShift073
export function* NewShift0731(action) {
    try {
        const response = yield call(APIs.NewShift0731, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchNewShift0731() {
    yield takeLatest(types.NEWSHIFT0731_API, NewShift0731)
}

export function* NewShift0732(action) {
    try {
        const response = yield call(APIs.NewShift0732, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {   
            action.onError(error.response.data)
        }
    }
}
export function* watchNewShift0732() {
    yield takeLatest(types.NEWSHIFT0732_API, NewShift0732)
}

//ShiftFeed080
export function* ShiftFeed0801(action) {
    try {
        const response = yield call(APIs.ShiftFeed0801, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftFeed0801() {
    yield takeLatest(types.SHIFTFEED0801_API, ShiftFeed0801)
}

//ShiftDetails100
export function* ShiftDetails1001(action) {
    try {
        const response = yield call(APIs.ShiftDetails1001, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1001() {
    yield takeLatest(types.SHIFTDETAILS1001_API, ShiftDetails1001)
}

//ShiftDetails101
export function* ShiftDetails1011(action) {
    try {
        const response = yield call(APIs.ShiftDetails1011, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1011() {
    yield takeLatest(types.SHIFTDETAILS1011_API, ShiftDetails1011)
}

export function* ShiftDetails1012(action) {
    try {
        const response = yield call(APIs.ShiftDetails1012, action.data, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1012() {
    yield takeLatest(types.SHIFTDETAILS1012_API, ShiftDetails1012)
}

//ShiftDetails105
export function* ShiftDetails1051(action) {
    try {
        const response = yield call(APIs.ShiftDetails1051, action.data, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1051() {
    yield takeLatest(types.SHIFTDETAILS1051_API, ShiftDetails1051)
}

//ShiftDetails108
export function* ShiftDetails1081(action) {
    try {
        const response = yield call(APIs.ShiftDetails1081, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1081() {
    yield takeLatest(types.SHIFTDETAILS1081_API, ShiftDetails1081)
}

//ShiftDetails109
export function* ShiftDetails1091(action) {
    try {
        const response = yield call(APIs.ShiftDetails1091, action.data, action.params)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchShiftDetails1091() {
    yield takeLatest(types.SHIFTDETAILS1091_API, ShiftDetails1091)
}

//ProfileScreen200
export function* ProfileScreen2001(action) {
    try {
        const response = yield call(APIs.ProfileScreen2001)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchProfileScreen2001() {
    yield takeLatest(types.RPOFILESCREEN2001_API, ProfileScreen2001)
}

export function* ProfileScreen2002(action) {
    try {
        const response = yield call(APIs.ProfileScreen2002)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchProfileScreen2002() {
    yield takeLatest(types.RPOFILESCREEN2002_API, ProfileScreen2002)
}

//ActivityScreen300
export function* ActivityScreen3001(action) {
    try {
        const response = yield call(APIs.ActivityScreen3001)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchActivityScreen3001() {
    yield takeLatest(types.ACTIVITYSCREEN3001_API, ActivityScreen3001)
}

//PaymentScreen400
export function* PaymentScreen4001(action) {
    try {
        const response = yield call(APIs.PaymentScreen4001)
        if(response.data){      
            action.onSuccess(response.data)
        }
    } catch (error) {
        if (error.response) {
            action.onError(error.response.data)
        }
    }
}
export function* watchPaymentScreen4001() {
    yield takeLatest(types.PAYMENTSCREEN4001_API, PaymentScreen4001)
}