import { LOGIN042_PROP_CHANGED, LOGIN042_PROP_CLEAR } from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    password: '',
    showPassword: true,
    repeatPassowrd: '',
    showRepeatPassword: true,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN042_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case LOGIN042_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
