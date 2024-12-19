// LandingPage.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function LandingPage() {
  const features = [
    {
      title: "User Management",
      description:
        "Secure role-based access for students, faculty, and event managers. Efficiently manage user roles and permissions to maintain a structured environment.",
    },
    {
      title: "Event Handling",
      description:
        "Create, promote, and manage events effortlessly. Gain control over scheduling, resources, and promotion strategies.",
    },
    {
      title: "Real-Time Notifications",
      description:
        "Stay updated with instant notifications for all events. Ensure participants and organizers are always informed.",
    },
    {
      title: "Volunteer Management",
      description:
        "Organize and manage volunteer registrations with ease. Track availability and contributions seamlessly.",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Visualize event trends and participation data with interactive graphs and reports.",
    },
    {
      title: "Feedback Collection",
      description:
        "Collect and review feedback from participants to improve future events.",
    },
    {
      title: "Resource Allocation",
      description:
        "Efficiently allocate and manage resources needed for events.",
    },
    {
      title: "Secure Authentication",
      description:
        "Ensure secure access with OTP-based email verification and encrypted passwords.",
    },
  ];

  return (
    <div>
  {/* Carousel Section */}
  <div
    id="carouselExample"
    className="carousel slide d-none d-md-block" // Hide on small screens
    data-bs-ride="carousel"
    style={{ padding: "20px", position: "relative" }}
  >
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img
          src="https://i.pinimg.com/736x/fc/80/16/fc8016fd1b0e044d2708b5420c4d4b4a.jpg"
          className="d-block w-100"
          alt="Image Placeholder 1"
          style={{ height: "600px", objectFit: "cover" }}
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://i.pinimg.com/736x/6d/ca/fb/6dcafb8fcaf60c99b0f699e272725dac.jpg"
          className="d-block w-100"
          alt="Image Placeholder 2"
          style={{ height: "600px", objectFit: "cover" }}
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://i.pinimg.com/736x/94/af/8a/94af8aa8150a67a2eb55a08312cbc44f.jpg"
          className="d-block w-100"
          alt="Image Placeholder 3"
          style={{ height: "600px", objectFit: "cover" }}
        />
      </div>
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>

  {/* Features Section */}
  <div
    className="features-section"
    style={{
      padding: "60px 20px",
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      color: "#333",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <h2 style={{ marginBottom: "30px", color: "#007bff", fontSize: "36px", fontWeight: "bold" }}>
      Event Management System
    </h2>
    <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "18px", lineHeight: "1.6", color: "#555" }}>
      Our Event Management System simplifies campus event planning by offering secure registration, efficient event handling, real-time notifications, and insightful analytics. Enhance participation, streamline resource management, and gather valuable feedback seamlessly—all in one platform.
    </p>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="feature-card"
          style={{
            margin: "15px",
            padding: "25px",
            width: "300px",
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            textAlign: "left",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <h4 style={{ color: "#007bff", fontSize: "20px", marginBottom: "10px" }}>{feature.title}</h4>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.5" }}>{feature.description}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Additional Styles */}
  <style>
    {`
      .feature-card:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      }
    `}
  </style>
</div>

  );
}

export default LandingPage;
