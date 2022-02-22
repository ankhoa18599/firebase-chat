import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase/config";
import { useRouter } from 'next/router';
import { AppContext, AuthContext } from ".";
import { addDocument, addDocumentWithId, getDocumentWithId, useFireStore } from "../firebase/services";
import { getCookie, setCookie } from "../common/functions";
import aes from "crypto-js/aes";
import { doc, setDoc } from "firebase/firestore";

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const router = useRouter()
    const ENCRYPT_KEY = "6LeJZ68UAAAAAJZ8jxdgylEXeWL8P9Ckv7CLtE6t";
    useEffect(() => {

        const unsubscribed = auth.onIdTokenChanged(async (user) => {
            if (!user) {
                if (getCookie("room_id")?.length > 0) {
                    const userData = await getDocumentWithId("users", getCookie("room_id"));
                    setCurrentUser(userData);
                    return;
                } else {
                    console.log('no user');
                    setCurrentUser(null);
                    // setLoading(false);
                    // router.push("/login");
                    return;
                }

            }


            // if (!(getCookie("room_id")?.length > 0)) {
            //     await addDocumentWithId("rooms", aes.encrypt(user.email, ENCRYPT_KEY).toString(), {
            //         name: user.email,
            //         author: user.displayName,
            //         counselors: []
            //     })
            //     setCookie("room_id", aes.encrypt(user.email, ENCRYPT_KEY), 30);
            //     console.log("setCookie")
            // } else {
            //     console.log("Website have cookie of room");
            // }
            // // setCurrentRoom(getDocumentWithId("rooms", aes.encrypt(user.email, ENCRYPT_KEY)));
            // setCurrentUser(user);
            // setLoading(false);
            // return;
        })
        return () => {
            unsubscribed();
        };
    }, [])
    return <AuthContext.Provider value={{ ENCRYPT_KEY, currentUser, setCurrentUser }}>
        {children}
    </AuthContext.Provider>
}

export const AppProvider = ({ children }) => {
    const [haveCookie, setHaveCookie] = useState(false);
    useEffect(() => {
        if (getCookie("room_id")?.length > 0) {
            setHaveCookie(true);
        } else {
            setHaveCookie(false);
        }
    }, [])
    return (
        <AppContext.Provider value={{ haveCookie }}>
            {children}
        </AppContext.Provider>
    )
}