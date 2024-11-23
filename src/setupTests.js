// src/setupTests.js
import "@testing-library/jest-dom";
import "jest-canvas-mock";

// Mock Firebase
jest.mock("../firebase/config", () => ({
  database: {
    collection: jest.fn(),
  },
  storage: {
    ref: jest.fn(),
  },
}));

// Example test file: src/components/pages/Gallery/Gallery.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Gallery from "./Gallery";

describe("Gallery Component", () => {
  test("renders gallery title", () => {
    render(<Gallery />);
    expect(screen.getByText(/gallery/i)).toBeInTheDocument();
  });

  test("handles image click", () => {
    render(<Gallery />);
    const image = screen.getByAltText(/gallery/i);
    fireEvent.click(image);
    // Add your assertions here
  });
});

// Example test file: src/components/pages/Contact/Contact.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact Form", () => {
  test("submits form data", async () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByText(/submit/i));

    // Add assertions for form submission
  });
});
