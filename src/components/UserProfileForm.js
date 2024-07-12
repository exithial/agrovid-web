import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { isURL } from "../utils";

function UserProfileForm({ resume }) {
  const { user } = useUserAuth();
  const [firstTime, setFirstTime] = useState(true); // Variable de estado para saber si es la primera vez que se carga el formulario
  const [loadingResume, setLoadingResume] = useState(false);
  const [alert, setAlert] = useState({
    variant: "success",
    message: "",
    isVisible: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
    featuredImage: null,
    description: "",
    phoneNumber: "",
    email: user.email, // El email no será editable
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const uploadFile = async (file) => {
    try {
      const storageRef = ref(storage, "images/" + file.name);
      await uploadBytes(storageRef, file);
      console.log("Archivo cargado correctamente");
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
    }
  };

  const newResume = async (sendResume) => {
    await addDoc(collection(db, "resume"), { ...sendResume }).then(() => {
      setAlert({
        variant: "success",
        message: "Perfil creado correctamente",
        isVisible: true,
      });
      setFirstTime(false);
    });
  };

  const updateResume = async (sendResume) => {
    const userRef = query(
      collection(db, "resume"),
      where("email", "==", user.email)
    );
    const findUsers = await getDocs(userRef);

    findUsers.forEach(async (user) => {
      const getUser = doc(db, "resume", user.id);
      await updateDoc(getUser, { ...sendResume }).then(() => {
        setAlert({
          variant: "primary",
          message: "Perfil actualizado correctamente",
          isVisible: true,
        });
      });
    });
  };

  const handleSubmit = async (e) => {
    console.log("Submit", resume, formData);
    e.preventDefault();
    setLoadingResume(true);
    let sendData = { ...formData };

    if (formData.profileImage && !isURL(formData.profileImage)) {
      sendData.profileImage = await uploadFile(formData.profileImage);
    }
    if (formData.featuredImage && !isURL(formData.featuredImage)) {
      sendData.featuredImage = await uploadFile(formData.featuredImage);
    }
    if (firstTime) {
      await newResume(sendData);
    } else {
      await updateResume(sendData);
    }
    setLoadingResume(false);
  };

  useEffect(() => {
    if (resume !== null) {
      setFormData({
        name: resume.name,
        profileImage: resume.profileImage,
        featuredImage: resume.featuredImage,
        description: resume.description,
        phoneNumber: resume.phoneNumber,
        email: resume.email,
      });
      setFirstTime(false);
    }
  }, [resume]);

  useEffect(() => {
    if (alert.isVisible) {
      setTimeout(() => {
        setAlert({ ...alert, isVisible: false });
      }, 3000);
    }
  }, [alert]);

  return (
    <>
      <Alert show={alert.isVisible} variant={alert.variant}>
        {alert.message}
      </Alert>

      <Form onSubmit={handleSubmit} className="text-start">
        <Form.Group controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="profileImage" className="mt-3">
          <Form.Label>Imagen de perfil</Form.Label>
          <Form.Control
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            required={firstTime}
          />
          {formData.profileImage && (
            <img
              src={
                isURL(formData.profileImage)
                  ? resume.profileImage
                  : URL.createObjectURL(formData.profileImage)
              }
              alt="Preview"
              className="mt-2"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </Form.Group>

        <Form.Group controlId="featuredImage" className="mt-3">
          <Form.Label>Imagen destacada</Form.Label>
          <Form.Control
            type="file"
            name="featuredImage"
            accept="image/*"
            onChange={handleFileChange}
            required={firstTime}
          />
          {formData.featuredImage && (
            <img
              src={
                isURL(formData.featuredImage)
                  ? resume.featuredImage
                  : URL.createObjectURL(formData.featuredImage)
              }
              alt="Preview"
              className="mt-2"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </Form.Group>

        <Form.Group controlId="description" className="mt-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="phoneNumber" className="mt-3">
          <Form.Label>Número de teléfono</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            pattern="^\+569\d{8}$" // Expresión regular para +569 seguido de 8 dígitos
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            readOnly
            disabled
          />
        </Form.Group>

        <div className="text-center mt-3">
          <Button variant="primary" type="submit">
            Actualizar
          </Button>
        </div>
      </Form>
      <Modal show={loadingResume} size="sm" centered>
        <Modal.Body>
          <Row
            style={{ height: 150 }}
            className="d-flex align-items-center justify-content-center"
          >
            <Col md="auto">
              <div
                style={{ width: "100%" }}
                className="d-flex align-items-center justify-content-center"
              >
                <Spinner animation="border" />
              </div>
              <h2>Cargando...</h2>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserProfileForm;
