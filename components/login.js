import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { getCookie } from '../common/functions'
import { AuthContext } from '../context'
import { auth, provider } from '../firebase/config'

export default function Login() {
    const router = useRouter()
    const loginWithGoogle = () => {
        signInWithPopup(auth, provider).then((res) => {
            const { _tokenResponse: additionalUserInfo, user } = res;
            if (additionalUserInfo?.isNewUser) {
                const userData = {
                    uid: user.uid,
                    providerId: user.providerId,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createAt: serverTimestamp(),
                }
                addDocument("users", userData);
            }
            return res;
        }).catch((er) => {
            return er;
        })
    }
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        if (currentUser) {
            if (currentUser.type === 2) {
                router.push("/admin");
            } else {
                router.push(`/room/${getCookie("room_id")}`);
            }
        }
    }, [currentUser])
    return (
        <div>
            <button onClick={() => {
                loginWithGoogle()
            }}>Login</button>
        </div>
    )
}
