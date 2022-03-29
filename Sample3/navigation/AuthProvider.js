import React, {createContext, useEffect, useState} from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children, type}) => {
    const [user, setUser] = useState(null);

    // Normal Login using email/password
    const login = async (email, password) => {
        // Call Login Api
    }

    // Normal Registration using email/password
    const register = async (email, password) => {
        // Call Registration Api
    }

    // Default Logout
    const logout = () => {
        // Call Logout Api    
    }

    // Gets Master Data Values to be Used throughout the app
    const getMasterData = async () => {

    }

    // Other Global Methods Like ScheduleLocalNotification, SaveDeviceInfo, Social Logins, Password Reset

    useEffect(() => {
        getMasterData();
    },[])

    return(
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login, 
                register,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
}