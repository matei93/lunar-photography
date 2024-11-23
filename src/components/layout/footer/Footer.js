import React from "react";
import { Container, Row } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer text-center">
      <Container>
        <hr className="footer-line" />
        <Row className="align-items-center">
          <div className="col">
            <a href="/" className="logo">
              <img
                className="logoFooter"
                src="/images/LOGO ALB.png"
                alt="Lunar Photography"
              />
            </a>
          </div>
          <div className="col">
            <p>&copy; {new Date().getFullYear()} LUNAR</p>
          </div>
          <div className="col">
            <a
              className="icon-link"
              href="https://www.facebook.com/lunar.mateiflorin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              className="icon-link"
              href="https://www.instagram.com/lunar_matei/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </Row>
      </Container>
    </footer>
  );
};