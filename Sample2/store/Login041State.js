import { LOGIN041_PROP_CHANGED, LOGIN041_PROP_CLEAR } from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    email: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN041_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case LOGIN041_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
