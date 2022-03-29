import { REGISTRATION050_PROP_CHANGED, REGISTRATION050_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    email: '',
    password: '',
    showPassword: true,
    repeatPassowrd: '',
    showRepeatPassword: true,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION050_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION050_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
