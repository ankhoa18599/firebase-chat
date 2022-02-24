import { signInWithPopup } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { getCookie, setCookie } from "../common/functions";
import { AuthContext } from "../context";
import { auth, db, provider } from "../firebase/config";
import {
  addDocument,
  addDocumentWithId,
  updateDocument,
} from "../firebase/services";

export default function Login() {
  const router = useRouter();
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const { _tokenResponse: additionalUserInfo, user } = res;

        const userData = {
          uid: user.uid,
          providerId: user.providerId,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          type: 1,
        };
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const getFirstDocument =
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0] ||
          {};
        if (additionalUserInfo?.isNewUser || querySnapshot.empty) {
          const id = await addDocument("users", userData);
          await addDocumentWithId("rooms", id, {
            name: user.displayName,
            email: user.email,
            counselors: [user.email],
          });
          setCookie("room_id", id, 30);
          // addDocument("users", userData);
        } else {
          // get room info
          if (!getFirstDocument.update_account) {
            updateDocument("users", getFirstDocument?.id, {
              ...userData,
              update_account: true,
            });
          }
          setCookie("room_id", getFirstDocument?.id, 30);
          // set cookie room_id
        }
        return res;
      })
      .catch((er) => {
        return er;
      });
  };
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type === 2) {
        router.push("/admin");
      } else {
        router.push(`/room/${getCookie("room_id")}`);
      }
    } else {
      router.push("/");
    }
  }, [currentUser]);
  return (
    <div>
      <Button
        variant="success"
        className="ms-2"
        onClick={() => {
          loginWithGoogle();
        }}
      >
        Login With Google
      </Button>
    </div>
  );
}
