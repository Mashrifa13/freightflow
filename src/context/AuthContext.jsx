
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Temporary demo credentials
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return (
            localStorage.getItem('ff_authenticated') === 'true' ||
            sessionStorage.getItem('ff_authenticated') === 'true'
        );
    });

    // Login function
    const login = (username, password, rememberMe) => {
        if (
            username.trim() !== DEMO_USERNAME ||
            password !== DEMO_PASSWORD
        ) {
            return false;
        }

        setIsAuthenticated(true);

        // Clear previous login information
        localStorage.removeItem('ff_authenticated');
        sessionStorage.removeItem('ff_authenticated');

        if (rememberMe) {
            localStorage.setItem('ff_authenticated', 'true');
        } else {
            sessionStorage.setItem('ff_authenticated', 'true');
        }

        return true;
    };

    // Logout function
    const logout = () => {
        setIsAuthenticated(false);

        localStorage.removeItem('ff_authenticated');
        sessionStorage.removeItem('ff_authenticated');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to access authentication
export function useAuth() {
    return useContext(AuthContext);
}
