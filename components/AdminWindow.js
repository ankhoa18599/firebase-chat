import { useRouter } from 'next/router';
import React from 'react'
import { Button, ListGroup } from 'react-bootstrap';

const Room = ({ room }) => {
    const router = useRouter();
    return (
        <ListGroup.Item as="li" className='d-flex justify-content-between align-items-center mt-2'>
            <span>{room.name}</span>
            <Button onClick={() => {
                router.push(`/room/${room.id}`)
            }}>Join</Button>
        </ListGroup.Item>
    )
}
export default function AdminWindow({ data }) {
    console.log(data)
    return (
        <section className='container mt-4'>
            <ListGroup as="ul">
                {Array.isArray(data) && data.map((room) => <Room room={room} key={room.id} />)}

            </ListGroup>
        </section>
    )
}
