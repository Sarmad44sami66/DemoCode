import { REGISTRATION056_PROP_CHANGED, REGISTRATION056_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    EIN: '',
    radioOptions: [
        {label: 'Cradit card', value: 0 },
        {label: 'ACH', value: 1 },
    ],
    icon: '',
    selectedIndex: 0,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION056_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION056_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
