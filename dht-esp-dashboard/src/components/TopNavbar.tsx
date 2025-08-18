import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router";
import {useState} from "react";


function TopNavbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand>
          🌐 IOT Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/dashboard"
              onClick={() => setExpanded(false)} // close after click
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/setting"
              onClick={() => setExpanded(false)} // close after click
            >
              Device Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;