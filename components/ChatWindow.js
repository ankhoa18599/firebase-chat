import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { AppContext, AuthContext } from '../context';
import { eraseCookie, getCookie } from '../common/functions';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Uploader from './uploader';
import Image from 'next/image';

export default function ChatWindow({ data, chat_id }) {
    const router = useRouter();

    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState(null);
    const [uploading, setUploading] = useState(false);

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
    const handleSendMessage = async (message) => {
        if (message?.length > 0) {
            const messageRef = collection(db, "rooms", chat_id, "messages");
            await addDoc(messageRef, {
                message: message,
                user: currentUser.email,
                createAt: serverTimestamp()

            })
            // addDocument("messages", {
            //     text: e.target.value,
            //     room: getCookie("room_id")
            // }
            // )

        }
    }
    return (
        <div className='container d-flex justify-content-between flex-column w-100 '>
            <div style={{ height: `60vh` }} className="overflow-auto d-flex flex-column-reverse my-4 p-4 ">
                {messages?.length > 0 && messages.map(message => {
                    const align_text_class = message.user === currentUser?.email ? "float-end" : "float-start";
                    return (
                        <div key={message.id} className={` ${message.user === currentUser?.email ? "message-author text-end" : "message-customer text-start"}  `}>
                            {message.imageMessage?.length > 0 ? (
                                <Image
                                    src={message.imageMessage}
                                    alt={`photo by ${message.user}`}
                                    width={200}
                                    height={200}
                                />
                            ) :
                                message.documentMessage?.length > 0 ?
                                    <>
                                        <a href={message.documentMessage} className={` message text-decoration-none text-dark d-block  ${align_text_class} my-2`}>{message.message} <Button variant='outline-success' className="rounded-pill ms-1"><span >&#x25BC;</span></Button></a>

                                    </>
                                    :
                                    <p className={` message ${align_text_class} `}>{message.message}</p>}


                        </div>

                    )
                })}
            </div>
            <div className="flex-1">
                <div className="d-flex">
                    <input
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}

                        className="form-control" placeholder='Type your message here...'
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                handleSendMessage(e.target.value);
                                setMessage("");
                                e.target.value = null;
                            }

                        }} />
                    <Uploader chat_id={chat_id} setUploading={setUploading} />
                    {!uploading && (
                        <Button className="ms-2" onClick={(e) => {
                            handleSendMessage(message)
                            setMessage("")

                        }} >Send</Button>
                    )}

                </div>
                <div className='mt-4'>
                    <Button onClick={() => {
                        setCurrentUser(null);
                        eraseCookie("room_id")
                        auth.signOut();
                    }}>signOut</Button>
                </div>
            </div>
        </div >
    )
}
