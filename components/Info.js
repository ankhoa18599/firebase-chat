import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getCookie, setCookie } from "../common/functions";
import { AppContext, AuthContext } from "../context";
import { db } from "../firebase/config";
import {
  addDocument,
  addDocumentWithId,
  updateDocument,
} from "../firebase/services";
import Login from "./login";

export default function Info() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { infoVisitor, setInfoVisitor } = useContext(AppContext);
  const { ENCRYPT_KEY } = useContext(AuthContext);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      simulateNetworkRequest().then(async () => {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let id;
        if (querySnapshot.empty) {
          id = await addDocument("users", {
            displayName: name,
            email: email,
            type: 1, //anonymous. 2 is user with email
          });
          await addDocumentWithId("rooms", id, {
            name: name,
            email: email,
            counselors: [email],
          });
        } else {
          id = querySnapshot.docs.map((item) => item.id)[0];
        }
        setCurrentUser((prev) => ({
          ...prev,
          displayName: name,
          email: email,
        }));
        setCookie("room_id", id, 30);
        setLoading(false);
        router.push(`room/${getCookie("room_id")}`);
      });
    }
    return simulateNetworkRequest;
  }, [isLoading, name, email]);

  const handleClick = () => setLoading(true);
  const router = useRouter();
  return (
    <div>
      <Form
        onKeyDown={(e) => {
          if (e.keyCode === 13 && name?.length > 0 && email?.length > 0) {
            handleClick();
          }
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type your name here"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>
        <div className="d-flex">
          <Button
            variant="primary"
            disabled={!(name?.length > 0 && email?.length) > 0}
            onClick={!isLoading ? handleClick : null}
          >
            {isLoading ? "Starting..." : "Submit"}
          </Button>
          <Login />
        </div>
      </Form>
    </div>
  );
}
