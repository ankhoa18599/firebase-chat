import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase/config";
import { useRouter } from "next/router";
import { AppContext, AuthContext } from ".";
import {
  addDocument,
  addDocumentWithId,
  getDocumentWithCondition,
  getDocumentWithId,
  useFireStore,
} from "../firebase/services";
import { getCookie, setCookie } from "../common/functions";
import aes from "crypto-js/aes";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const router = useRouter();
  const ENCRYPT_KEY = "6LeJZ68UAAAAAJZ8jxdgylEXeWL8P9Ckv7CLtE6t";
  useEffect(() => {
    const unsubscribed = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        if (getCookie("room_id")?.length > 0) {
          const userData = await getDocumentWithId(
            "users",
            getCookie("room_id")
          );
          setCookie("room_id", userData.id, 30);
          setCurrentUser(userData);
          return;
        } else {
          console.log("no user");
          setCurrentUser(null);
          // setLoading(false);
          router.push("/");
          return;
        }
      } else {
        if (!(getCookie("room_id").length > 0)) {
          const q = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          const userData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))[0];
          setCookie("room_id", userData.id, 30);
          setCurrentUser(userData);
        } else {
          setCurrentUser(user);
        }
        return;
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ ENCRYPT_KEY, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  const [haveCookie, setHaveCookie] = useState(false);
  useEffect(() => {
    if (getCookie("room_id")?.length > 0) {
      setHaveCookie(true);
    } else {
      setHaveCookie(false);
    }
  }, []);
  return (
    <AppContext.Provider value={{ haveCookie }}>{children}</AppContext.Provider>
  );
};
