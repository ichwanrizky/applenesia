"use client";
import React, { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";

const CreateServicePage = () => {
  // State to keep track of current step and form data
  const [step, setStep] = useState(1);
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
            <h5>Step 1: Informasi Customer</h5>
            <div className="form-group mb-3">
              <label htmlFor="list_customer">List Customer</label>
              <Select
                placeholder="Pilih Customer"
                isClearable
                required
                // options={optionsProduct}
                // onChange={(e: any) => setProduct(e ? e.value : "")}
                // value={
                //   product
                //     ? optionsProduct.find(
                //         (option: any) => option.value === product
                //       )
                //     : null
                // }
              />
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-6">
                  <label htmlFor="list_customer">Nama</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="list_customer">Telp</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-sm-3">
                  <label htmlFor="list_customer">Email</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-2">
                  <label htmlFor="list_customer">Tipe Device</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="list_customer">Device</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="list_customer">IMEI</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="list_customer">Deskripsi Kerusakan</label>
              <textarea className="form-control" rows={4} />
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
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Tambah Service</h4>
            <p className="card-subtitle mb-4">Silahkan isi data di bawah.</p>
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <a
                  className={`nav-link ${step === 1 ? "active" : ""}`}
                  href="#"
                >
                  Step 1
                </a>
              </li>
            </ul>
            <div className="tab-content p-2">{renderStepContent()}</div>
          </div>{" "}
          {/* end card-body*/}
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
