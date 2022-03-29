import { SHIFTFEED080_PROP_CHANGED, SHIFTFEED080_PROP_CLEAR} from '../actions/Actions';


const INITIAL_STATE = {
    loading: false,
    currentDate: new Date(),
    show: false,
    toggleHeaderTabs: [
        {label: 'Posted shifts', value: 0 },
        {label: 'In progress shifts', value: 1 },
    ],
    headerSelectTab: 0,
    toggleTabs: [
        {label: '1-day shift', value: 0 },
        {label: 'Multi day shift', value: 1 },
    ],
    selectedTab: 0,
    listDataPostedShifts: [],
    listDataInProgressShifts: [],
    selectedShiftItemID: '',//100
    selectedShiftItem: {
        company_name: '',
        of_staff: '',
        manager: false,
        position: {},
    },//100
    selectedShiftAppliedEmployees: [],//101
    selectedShiftAppliedEmployee: {},//101
    manualClockInAccountID: '',//105
    selectedStarIndex: 0,//108
    startlist: [
        {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}
    ],//108
    extensionLimitArray: [],
    shiftExtensionLimit: "1",//109
    workingPositionsTariff: '',//109
    isConnected: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHIFTFEED080_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case SHIFTFEED080_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
