import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";

function UserProfileForm({ resume }) {
  const { user } = useUserAuth();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos al servidor o realizar otras acciones
    console.log("Datos enviados:", formData);
  };

  useEffect(() => {
    if (resume !== null) {
      setFormData({
        name: resume.name,
        profileImage: null,
        featuredImage: null,
        description: resume.description,
        phoneNumber: resume.phoneNumber,
        email: resume.email,
      });
    }
  }, [resume]);

  return (
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
          required
        />
        {formData.profileImage && (
          <img
            src={URL.createObjectURL(formData.profileImage)}
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
          required
        />
        {formData.featuredImage && (
          <img
            src={URL.createObjectURL(formData.featuredImage)}
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
  );
}

export default UserProfileForm;
