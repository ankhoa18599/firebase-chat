import { addDoc, collection, serverTimestamp, } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { AuthContext } from '../context';
import { db } from '../firebase/config';



let imgURL = "";
let docURL = "";
let videoURL = "";
var slugify = require("slugify");


export default function Uploader({ chat_id }) {
  const { currentUser } = useContext(AuthContext);

  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [doc, setDoc] = useState(null);
  const [video, setVideo] = useState(null);
  const [fileName, setFileName] = useState(null);


  const handleOnSubmit = async () => {
    let d = new Date();
    let n = d.getTime();
    const messageRef = collection(db, "rooms", chat_id, "messages");
    await addDoc(messageRef, {
      id: currentUser.uid + n || n,
      message: docURL.trim(),
      user: currentUser.email,
      name: currentUser.name || currentUser.displayName,
      photoURL: currentUser.photoURL || null,
      videoMessage: videoURL,
      imageMessage: imgURL,
      isDeleted: false,
      createAt: serverTimestamp()

    })
    removeIMG();
  };

  const removeIMG = () => {
    imgURL = "";
    docURL = "";
    videoURL = "";
    setImage(null);
    setDoc(null);
    setVideo(null);
    setFileName(null);
    document.getElementById("uploadIMG").value = "";
    // document.getElementById("uploadDoc").value = "";
    // document.getElementById("uploadVideo").value = "";
  };


  const handChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(
        slugify(file.name, {
          replacement: "-",
          remove: undefined,
          lower: false,
          strict: false,
          locale: "vi",
          trim: true,
        })
      );
      const fileType = file["type"];
      const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      const validDocTypes = [
        ".doc",
        ".docx",
        ".xml",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validVideoTypes = ["video/mp4", "video/avi"];
      if (type == "image") {
        if (validImageTypes.includes(fileType)) {
          if (file.size > 2097152) {
            alert("Image is too big!");
            e.target.value = "";
            return;
          } else {
            setImage(file);
            setDoc(null);
            setVideo(null);
          }
        } else {
          alert("Please select an image");
        }
      } else if (type == "doc") {
        if (validDocTypes.includes(fileType)) {
          if (file.size >= 10485760) {
            alert("Document is too big!");
            e.target.value = "";
            return;
          } else {
            setDoc(file);
            setImage(null);
            setVideo(null);
          }
        } else {
          alert("Please select a document");
        }
      } else if (type == "video") {
        if (validVideoTypes.includes(fileType)) {
          if (file.size >= 10485760 * 2) {
            alert("Video is too big!");
            e.target.value = "";
            return;
          } else {
            setDoc(null);
            setImage(null);
            setVideo(file);
          }
        } else {
          alert("Please select a video");
        }
      }
    }
  };


  const handleUpload = () => {
    let d = new Date();
    let n = d.getTime();
    const storage = getStorage();
    if (image) {
      const imgName = currentUser.uid + "_" + n + "_" + fileName;
      const storageRef = ref(storage, "images/" + imgName);
      // const uploadTask = storage.ref(`images/${imgName}`).put(image);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
          setProgress(progress);
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            imgURL = url;
            setProgress(0);
            setImage(null);
            handleOnSubmit();
            document.getElementById("uploadIMG").value = "";
          });
        }
      );
    }

    /* else if (doc) {
      const docName = uid + "_" + n + "_" + fileName;
      const uploadTask = storage.ref(`documents/${docName}`).put(doc);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          setError(error);
        },
        () => {
          storage
            .ref("documents")
            .child(docName)
            .getDownloadURL()
            .then((url) => {
              docURL = url;
              setProgress(0);
              setDoc(null);
              handleOnSubmit();
              updateSeen();
              document.getElementById("uploadDoc").value = "";
            });
        }
      );
    } else if (video) {
      const videoName = uid + "_" + n + "_" + fileName;
      const uploadTask = storage.ref(`videos/${videoName}`).put(video);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          setError(error);
        },
        () => {
          storage
            .ref("videos")
            .child(videoName)
            .getDownloadURL()
            .then((url) => {
              videoURL = url;
              setProgress(0);
              setVideo(null);
              handleOnSubmit();
              updateSeen();
              document.getElementById("uploadVideo").value = "";
            });
        }
      );
    } */
    else {
      alert("Error please choose an file to upload");
    }
  };
  return (
    <div>
      <label
        htmlFor="uploadIMG"
        className={image || video || doc ? "d-none" : "d-block"}
      >
        <Button disabled variant="warning" className="ms-2">Picture</Button>
      </label>
      <input
        id="uploadIMG"
        type="file"
        onChange={(e) => {
          handChange(e, "image");
        }}
        accept="image/png, image/jpeg, image/gif,image/jpg,"
        className="position-absolute d-none"

        title=" "
      />

      {(image || doc || video) && (
        <React.Fragment>
          <Button variant='danger' className="rounded-pill" onClick={removeIMG}>X</Button>

          <Button
            onClick={!progress >= 1 ? handleUpload : null}

            shape="round"
            type="primary"
            className="position-absolute  rounded-pill"
            style={{ zIndex: 1 }}
          >
            {progress >= 1 ? 'Uploading...' : `Up ^ ${fileName}`}
          </Button>
        </React.Fragment>
      )}
    </div>
  )
}
