import { async } from '@firebase/util';
import { HmacMD5 } from 'crypto-js';
import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { setCookie } from '../common/functions';
import { AppContext, AuthContext } from '../context'
import { addDocumentWithId } from '../firebase/services';

export default function Info() {
    const { infoVisitor, setInfoVisitor } = useContext(AppContext);
    const { ENCRYPT_KEY } = useContext(AuthContext);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    return (
        <div>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Type your name here" onChange={(e) => {
                        setName(e.target.value);
                    }} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => {
                        setEmail(e.target.value);
                    }} />
                </Form.Group>
                <Button variant="primary" onClick={async () => {

                    setInfoVisitor({
                        name: name,
                        email: email
                    });
                    await addDocumentWithId("rooms", HmacMD5(email, ENCRYPT_KEY).toString(), {
                        name: name,
                        email: email,
                        counselors: []
                    })
                    setCookie("room_id", HmacMD5(email, ENCRYPT_KEY), 30);
                    console.log("setCookie")
                }}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}
