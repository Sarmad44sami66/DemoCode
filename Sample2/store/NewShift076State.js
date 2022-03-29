import { NEWSHIFT076_PROP_CHANGED, NEWSHIFT076_PROP_CLEAR} from '../actions/Actions';

const INITIAL_STATE = {
    loading: false,
    addressCur: '',
    region: {
        longitude: -122.4324,
        latitude: 41.40338,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
    },
    address: "",
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEWSHIFT076_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case NEWSHIFT076_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
