import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../context';
import { getCookie } from '../common/functions';
import aes from 'crypto-js/aes';
import { addDocument, useFireStore } from '../firebase/services';

export default function ChatWindow() {
    const router = useRouter();
    const messagesCondition = useMemo(() => {
        return {
            fieldName: "room",
            operator: "==",
            compareValue: getCookie("room_id")
        }
    }, [getCookie("room_id"), message]);
    const [message, setMessage] = useState(null);
    const messages = useFireStore("messages", messagesCondition);
    console.log(messages);
    return (
        <div className='d-flex justify-content-between flex-column w-100 '>
            <div style={{ height: `60vh` }} className="overflow-auto d-flex flex-column-reverse ">
                {messages?.length > 0 && messages.map(message => {
                    return <p key={message.id}>{message.text}</p>
                })}
            </div>
            <div className="flex-1">
                <div className="d-flex">
                    <input className="form-control" placeholder='Type your message here...' onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                            if (e.target.value?.length > 0) {
                                setMessage(e.target.value);
                                addDocument("messages", {
                                    text: e.target.value,
                                    room: getCookie("room_id")
                                }
                                )
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
