import { REGISTRATION054_PROP_CHANGED, REGISTRATION054_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    isImageAttached: false,
    imageSource: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION054_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION054_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
