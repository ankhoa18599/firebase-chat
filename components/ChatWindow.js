import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { AppContext, AuthContext } from '../context';
import { getCookie } from '../common/functions';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ChatWindow({ data, chat_id }) {
    const router = useRouter();

    const { currentUser } = useContext(AuthContext);
    const [messages, setMessages] = useState(null)

    useEffect(() => {
        if (!(getCookie("room_id"))) {
            router.push("/");
        } else {

            const messagesRef = collection(db, "rooms", chat_id, "messages");
            const q = query(messagesRef, orderBy("createAt", "desc"))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setMessages(querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    createAt: doc.data().createAt?.toDate().getTime()
                })))
            })
            return unsubscribe;
        }
    }, [chat_id])
    return (
        <div className='container d-flex justify-content-between flex-column w-100 '>
            <div style={{ height: `60vh` }} className="overflow-auto d-flex flex-column-reverse ">
                {messages?.length > 0 && messages.map(message => {
                    return (
                        <div key={message.id} className={``}>
                            <p className={` message ${message.user === currentUser.email ? "float-end message-author" : "float-start message-customer"} `}>{message.message}</p>

                        </div>

                    )
                })}
            </div>
            <div className="flex-1">
                <div className="d-flex">
                    <input className="form-control" placeholder='Type your message here...' onKeyUp={async (e) => {
                        if (e.keyCode === 13) {
                            if (e.target.value?.length > 0) {
                                const messageRef = collection(db, "rooms", chat_id, "messages");
                                await addDoc(messageRef, {
                                    message: e.target.value,
                                    user: currentUser.email,
                                    createAt: serverTimestamp()

                                })
                                // addDocument("messages", {
                                //     text: e.target.value,
                                //     room: getCookie("room_id")
                                // }
                                // )
                                e.target.value = null;
                            }
                        }

                    }} />
                    <Button className="ms-2" >Send</Button>
                </div>
                <div className='mt-4'>

                    <Button className="mx-3" disabled onClick={() => {
                        router.push("/login")
                    }}>Login</Button>
                    <Button disabled onClick={() => {
                        auth.signOut()
                    }}>signOut</Button>
                </div>
            </div>
        </div >
    )
}
