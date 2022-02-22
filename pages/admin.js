import React from 'react'
import AdminWindow from '../components/AdminWindow'
import { useFireStore } from '../firebase/services';

export default function Admin() {
    const rooms = useFireStore("rooms");

    return <AdminWindow data={rooms} />
}
