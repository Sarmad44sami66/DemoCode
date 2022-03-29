import { NEWSHIFT073_PROP_CHANGED, NEWSHIFT073_PROPS_CHANGED, NEWSHIFT073_PROP_CLEAR} from '../actions/Actions';
import moment from 'moment';

const INITIAL_STATE = {
    loading: false,
    checked: true,
    list: [],
    managerHourlyBill: 0,
    workerHourlyBill: 0,
    totalPayout: 1,
    totalBill: 1,
    estimatedCostFirst: 0,
    estimatedCostSecond: 0,
    count: 0,
    selectedPositionTitle: '',
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEWSHIFT073_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case NEWSHIFT073_PROPS_CHANGED:
            return { ...state, ...action.payload.props};
        case NEWSHIFT073_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
