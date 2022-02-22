import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { getCookie } from '../common/functions';
import AdminWindow from '../components/AdminWindow'
import { AuthContext } from '../context';
import { useFireStore } from '../firebase/services';

export default function Admin() {
    const router = useRouter();
    const rooms = useFireStore("rooms");
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
    return <AdminWindow data={rooms} />
}
