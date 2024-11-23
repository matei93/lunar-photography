import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./NavBar.css";

function NavBar() {
  return (
    <Navbar
      expand="lg"
      className="navbar navbar-expand-lg fixed-top navbar-scr navbar-scrolled bg-body-tertiary bg-dark"
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            className="logoLunar d-block w-100 ms-auto"
            src="/images/LOGO NEGRU.png"
            alt="Lunar Photography"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="about">About</Nav.Link>
            <NavDropdown title="Galleries" id="basic-nav-dropdown">
              <Nav.Link className="dropdown" href="Nunta">
                Wedding
              </Nav.Link>
              <Nav.Link className="dropdown" href="LoveStories">
                Love Stories
              </Nav.Link>
              <Nav.Link className="dropdown" href="Botez">
                Baptism
              </Nav.Link>
            </NavDropdown>
            <Nav.Link href="Contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;