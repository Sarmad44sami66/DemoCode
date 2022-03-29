import { REGISTRATION057_PROP_CHANGED, REGISTRATION057_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    creditCardNumber: '',
    expiryDate: '',
    CVVOrCVC: '',
    nameOnCard: '',
    isFrom72: false,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION057_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION057_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
