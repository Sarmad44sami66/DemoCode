import { ACTIVITYSCREEN300_PROP_CHANGED, ACTIVITYSCREEN300_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    listActivityShiftsToday:[],
    listActivityShiftsYesterday:[],
    listActivityShiftsOlder:[],
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTIVITYSCREEN300_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case ACTIVITYSCREEN300_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
