import { REGISTRATION051_PROP_CHANGED, REGISTRATION051_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    inputCode: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION051_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION051_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
