// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// // src/context/AuthContext.js
// import { createContext, useContext, useEffect, useState } from "react";
// import {
//     getAuth,
//     onAuthStateChanged,
//     GoogleAuthProvider,
//     signInWithRedirect,
//     getRedirectResult,
//     // setPersistence,
//     // browserLocalPersistence,
//     signOut,
// } from "firebase/auth";
// import { app } from "../lib/firebase"; // ⬅️ make sure this path is correct

// const AuthContext = createContext(null);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// provider.setCustomParameters({ prompt: "select_account" });

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Catch redirect result after login
//         getRedirectResult(auth)
//             .then((result) => {
//                 if (result?.user) {
//                     console.log("[Auth] getRedirectResult user:", result.user);
//                     setUser(result.user);
//                 } else {
//                     console.log("[Auth] getRedirectResult: no user (not a redirect return)");
//                 }
//             })
//             .catch((error) => {
//                 console.error("[Auth] Redirect error:", error);
//             });

//         // Listen for auth state changes
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             console.log("[Auth] onAuthStateChanged:", currentUser);
//             setUser(currentUser);
//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);

//     const loginWithGoogle = async () => {
//         console.log("[Auth] signInWithRedirect…");
//         await signInWithRedirect(auth, provider);
//     };

//     const logout = () => signOut(auth);

//     return (
//         <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);