"use client";
import React, { useState } from "react";

const CreateServicePage = () => {
  // State to keep track of current step and form data
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
  });

  // Function to go to the next step
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  // Function to go to the previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to handle form input changes
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to display content based on the step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-1">
            <h5>Step 1: Personal Information</h5>
            <div className="form-group mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-2">
            <h5>Step 2: Address Information</h5>
            <div className="form-group mb-3">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-3">
            <h5>Step 3: Confirmation</h5>
            <p>Review your details before submitting:</p>
            <ul className="list-group">
              <li className="list-group-item">Name: {formData.name}</li>
              <li className="list-group-item">Email: {formData.email}</li>
              <li className="list-group-item">Address: {formData.address}</li>
              <li className="list-group-item">City: {formData.city}</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h4 className="text-center">Multi-Step Wizard</h4>
            </div>
            <div className="card-body">
              {/* Step indicator */}
              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <a
                    className={`nav-link ${step === 1 ? "active" : ""}`}
                    href="#"
                  >
                    Step 1
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${step === 2 ? "active" : ""}`}
                    href="#"
                  >
                    Step 2
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${step === 3 ? "active" : ""}`}
                    href="#"
                  >
                    Step 3
                  </a>
                </li>
              </ul>

              {/* Step Content */}
              <div className="step-content">{renderStepContent()}</div>
            </div>

            {/* Navigation buttons */}
            <div className="card-footer text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={nextStep}
                disabled={step === 3}
              >
                {step === 3 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
