import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  Navbar,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { objectIsEmpty } from "../utils";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);

  async function handleLogout() {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getResume() {
    const resumeRef = collection(db, "resume");
    const q = query(resumeRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
    } else {
      querySnapshot.forEach((doc) => {
        setResume(doc.data());
      });
    }
    setLoadingResume(false);
  }

  useEffect(() => {
    if (!objectIsEmpty(user)) {
      getResume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Bienvenido {user?.email}</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button variant="primary" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="p-4 box mt-3 text-center"></div>
      <Modal show={loadingResume} size="sm" centered>
        <Modal.Body>
          <Row
            style={{ height: 150 }}
            className="d-flex align-items-center justify-content-center"
          >
            <Col md="auto">
              <div style={{ width: "100%"}} className="d-flex align-items-center justify-content-center">
                <Spinner animation="border" />
              </div>
              <h2>Cargando...</h2>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Home;
