import { REGISTRATION053_PROP_CHANGED, REGISTRATION053_PROP_CLEAR } from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    businessName: '',
    address: '',
    customAddress: '',
    city: '',
    zip: '',
    state: '',
    checked: true,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION053_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION053_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
