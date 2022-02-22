import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { getCookie, setCookie } from '../common/functions'
import { AuthContext } from '../context'
import { auth, provider } from '../firebase/config'
import { addDocument, addDocumentWithId } from '../firebase/services'

export default function Login() {
    const router = useRouter()
    const loginWithGoogle = () => {
        signInWithPopup(auth, provider).then(async (res) => {
            const { _tokenResponse: additionalUserInfo, user } = res;
            if (additionalUserInfo?.isNewUser) {
                const userData = {
                    uid: user.uid,
                    providerId: user.providerId,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createAt: serverTimestamp(),
                    type: 1
                }
                const id = await addDocument("users", userData);
                await addDocumentWithId("rooms", id, {
                    name: user.displayName,
                    email: user.email,
                    counselors: [user.email]
                })
                setCookie("room_id", id, 30);
                // addDocument("users", userData);
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
        } else {
            router.push("/");
        }
    }, [currentUser])
    return (
        <div>
            <Button variant="success" className="ms-2" onClick={() => {
                loginWithGoogle()
            }}>
                Login With Google
            </Button>

        </div>
    )
}
