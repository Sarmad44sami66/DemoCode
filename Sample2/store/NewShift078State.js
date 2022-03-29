import { NEWSHIFT078_PROP_CHANGED, NEWSHIFT078_PROP_CLEAR} from '../actions/Actions';
import moment from 'moment';

const INITIAL_STATE = {
    shirtTabs: [
        {label: 'White T-Shirt', value: 0 },
        {label: 'Black T-Shirt', value: 1 },
        {label: 'Shirt will be provided', value: 2 },
    ],
    selectedShirtTabIndex: 0,
    pantTabs: [
        {label: 'Black Trousers', value: 0 },
        {label: 'White Trousers', value: 1 },
        {label: 'Trousers will be provided', value: 2 },
    ],
    selectedPantTabIndex: 0,
    shoesTabs: [
        {label: 'Black Sneakers', value: 0 },
        {label: 'Black Polished Shoes', value: 1 },
        {label: 'Shoes will be provided', value: 2 },
    ],
    selectedShoesTabIndex: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEWSHIFT078_PROP_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value};
        case NEWSHIFT078_PROP_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
};
