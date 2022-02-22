import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./config";

export function useFireStore(collectionName, conditions) {

    const [data, setData] = useState();

    useEffect(() => {
        console.log("Call api...");
        let q;
        if (conditions) {
            if (!conditions.compareValue || !conditions.compareValue.length) {
                // reset documents data
                setData([]);
                return;
            }
            q = query(collection(db, collectionName), where(conditions.fieldName, conditions.operator, conditions.compareValue), orderBy("createAt", "desc"));

        } else {
            q = query(collection(db, collectionName), orderBy("createAt", "desc"));
        }
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data_array = [];
            querySnapshot.forEach((doc) => {
                data_array.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            setData(data_array);
        });
        return unsubscribe;

    }, [collectionName, conditions])
    return data;
}

export async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createAt: serverTimestamp()
        })
        return docRef.id;
    } catch (error) {
        console.log(error)
    }

}
export async function addDocumentWithId(collectionName, id, data) {
    try {
        await setDoc(doc(db, collectionName, id), {
            ...data,
            createAt: serverTimestamp()
        });
    } catch (error) {
        console.log(error)
    }
    return;
}
export async function getDocumentWithId(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Get data success");
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}
export async function getDocumentWithCondition(collectionName, conditions) {
    const docRef = query(collection(db, collectionName), where(conditions.fieldName, conditions.operator, conditions.compareValue));
    const docSnap = await getDocs(docRef);

    if (docSnap.empty) {
        console.log("No such document!");
    } else {
        console.log("Get data success:");
        return docSnap.data();

    }
}
export async function updateDocument({ collectionName, docId, data }) {

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
        ...data,
        updateAt: serverTimestamp()
    })
    return;
}