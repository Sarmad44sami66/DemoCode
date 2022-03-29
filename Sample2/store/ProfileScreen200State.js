import { RPOFILESCREEN200_PROP_CHANGED, RPOFILESCREEN200_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    businessLogo: '',
    businessName: '',
    accountID: '',
    status: '',
    address: '',
    city: '',
    zip: '',
    state: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RPOFILESCREEN200_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case RPOFILESCREEN200_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
