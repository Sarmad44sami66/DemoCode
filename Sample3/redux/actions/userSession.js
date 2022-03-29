//auth actions...
import {
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_RESPONSE,
  SET_USER,
  SET_PASSWORD,
  SET_PROFILEIMAGE,
  SET_PREFERENCE,
  GUEST_USER,
} from './types';

export const setUser = (currentUser) => ({
  type: SET_USER,
  payload: currentUser
})

export const setUserCredentials = (currentUser) => ({
  type: SET_PASSWORD,
  payload: currentUser
})

export const logoutUser = () => ({
  type: LOGOUT
})

export const signupRequest = (payload) => ({
  type: SIGNUP_REQUEST,
  payload,
});

export const signupResponse = (response) => ({
  type: SIGNUP_RESPONSE,
  response,
});

export const setUserProfileImage = (response) => ({
  type: SET_PROFILEIMAGE,
  response,
});

export const setUserPreference = (response) => ({
  type: SET_PREFERENCE,
  response,
});

export const setGUESTUSER = (response) =>({
  type : GUEST_USER,
  response
})

