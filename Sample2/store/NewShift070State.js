import { NEWSHIFT070_PROP_CHANGED, NEWSHIFT070_PROP_CLEAR} from '../actions/Actions';
import moment from 'moment';

const INITIAL_STATE = {
    loading: false,
    toggleTabs: [
        {label: 'Single day shift', value: 0 },
        {label: 'Multi day shift', value: 1 },
    ],
    selectedTab: 0,
    startShiftDate: new Date(moment().add(1, 'days')),
    endShiftDate: new Date(moment().add(30,  'hours')),
    minimumDate: new Date(moment().add(1, 'days')),
    maximumDate: new Date(moment().add(15, 'days')),
    showdatepicker: false,
    showtimepicker: false,
    dresscodeShirts: 0,
    dresscodePants: 0,
    dresscodeShoes: 0,
    index: 2,
    noOfStaffInShift: '1',
    managerAssigned: '1',
    shiftDuration: 6,
    positionID: 0,
    workingPositionsData: {
        positions: [],
    },
    isDarkModeEnabled: false,
    // hours: 6,
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEWSHIFT070_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case NEWSHIFT070_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
