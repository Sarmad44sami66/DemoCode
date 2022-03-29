import { NEWSHIFT072_PROP_CHANGED, NEWSHIFT072_PROP_CLEAR} from '../actions/Actions';

const INITIAL_STATE = {
    shiftInfoTabs: [
        {label: 'No parking', active: false, value: 0 },
        {label: 'Free parking', active: false, value: 1 },
        {label: 'Paid parking', active: false, value: 2 },
        {label: 'Meal provided', active: false, value: 3 },
        {label: 'Staff entrance', active: false, value: 4 },
        {label: 'Main entrance', active: false, value: 5 },
    ],
    address: '',
    shiftLocation: '',
    checkInLocation: '',
    additionalShiftInfo: '',
    name: '',
    phoneNumber: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEWSHIFT072_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case NEWSHIFT072_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
