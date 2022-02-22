import React from 'react'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ChatWindow from '../../components/ChatWindow';
import { getCookie } from '../../common/functions';

export default function ChatRoom({ data, id }) {

    return (
        <div><ChatWindow data={data} chat_id={id} /></div>
    )
}
export async function getServerSideProps(context) {

    const docRef = doc(db, "rooms", context.query.id || getCookie("room_id"));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            data: JSON.stringify(docSnap.data()),
            id: context.query.id
        }
    }
}