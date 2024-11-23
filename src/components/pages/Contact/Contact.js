import React, { useState } from "react";
import { database } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "wedding",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save to Firebase
      await addDoc(collection(database, "contacts"), {
        ...formData,
        timestamp: new Date().toString(),
      });

      // Send email via EmailJS
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formData,
        "YOUR_PUBLIC_KEY"
      );

      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        eventType: "wedding",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Event Date:</label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Event Type:</label>
          <select
            value={formData.eventType}
            onChange={(e) =>
              setFormData({ ...formData, eventType: e.target.value })
            }
          >
            <option value="wedding">Wedding</option>
            <option value="baptism">Baptism</option>
            <option value="engagement">Engagement</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />
        </div>
        {status && (
          <div className={`alert ${status.type}`}>{status.message}</div>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Contact;
