import { LOGIN040_PROP_CHANGED, LOGIN040_PROP_CLEAR } from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    email: '',
    password: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN040_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case LOGIN040_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
