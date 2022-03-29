
import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthProvider'

import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

import AuthStack from './AuthStack'
import AppStack from './AppStack';


const Stack = createStackNavigator(); // Pop-ups

const Routes = ({route}) => {
  const params = route?.params?.user
  console.log("params===>>",params)
  const { isSignedIn, currentUser,userEmail,userPassword,IsBoardingVisited } = useSelector((state) => state.userSession);
  console.log('my user daata=====>',IsBoardingVisited)

  useEffect(() => {
  }, []);


  return (
    <NavigationContainer>
      
      {isSignedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Routes