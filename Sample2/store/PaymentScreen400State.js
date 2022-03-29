import { PAYMENTSCREEN400_PROP_CHANGED, PAYMENTSCREEN400_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    payments: {
        last_shift_payments: 0,
        pending_payments: 0,
        successful_payments: 0,
        total_payments: 0,
        total_shifts_hired: 0,
        total_hours_hired: 0
    },
    radioOptions: [],
    selectedIndex: 0,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PAYMENTSCREEN400_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case PAYMENTSCREEN400_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
