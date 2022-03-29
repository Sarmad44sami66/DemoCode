import {
  LOGOUT,
  SET_USER,
  SIGNUP_RESPONSE,
  SET_PASSWORD,
  SET_PROFILEIMAGE,
  SET_PREFERENCE,
  GUEST_USER
} from '../actions/types';

const INITIAL_STATE = {
  currentUser: null,
  isSignedIn: false,
  userType:'',
  authenticationToken: '',
  userEmail: '',
  userPassword: '',
  profileImage: '',
  marketingPreference:'',
  IsBoardingVisited: false
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...INITIAL_STATE,
        userEmail: state.userEmail,
        userPassword: state.userPassword,
        IsBoardingVisited: state.IsBoardingVisited
      };
    case SIGNUP_RESPONSE:
      return {
        ...state,
        currentUser: action.payload,
        isSignedIn: true,
        IsBoardingVisited: true,
      };
    case SET_PASSWORD:
      return {
        ...state,
        userEmail: action.payload.email,
        userPassword: action.payload.password,
      };
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isSignedIn: true,
        authenticationToken: action.payload.access_token,
        IsBoardingVisited: true
      };
    case SET_PROFILEIMAGE:
      return {
        ...state,
        profileImage: action.response,
      };
    case SET_PREFERENCE:
      return {
        ...state,
        marketingPreference: action.response,
      };
      case GUEST_USER:
      return{
        ...state,
        isSignedIn:true,
        userType:'guest'
      }
    default:
      return state;
  }
}
