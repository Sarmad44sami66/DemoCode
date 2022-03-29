import { REGISTRATION052_PROP_CHANGED, REGISTRATION052_PROP_CLEAR } from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    radioOptions: [
        {label: 'Event organizer', value: 0 },
        {label: 'Venue', value: 1 },
        {label: 'Restaurant/bar', value: 2 },
        {label: 'Hotel', value: 3 },
        {label: 'Catering', value: 4 },
        {label: 'Other', value: 5 },
    ],
    selectedIndex: 0,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION052_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case REGISTRATION052_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
