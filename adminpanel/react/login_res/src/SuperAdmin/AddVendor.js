import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AddVendor() {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    pincode: "",
    sinceFrom: "",
    specialistIn: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    pesticideLicence: "",
    gstNumber: "",
    membership: "",
    branchDetails: "",
    technicalQualification: "",
    password: "",
    logo: "",
    image: [""],
    aboutUs: "",
    businessType: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Declare navigate for redirection

  const validate = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name.startsWith("image")) {
        const index = parseInt(name.split("-")[1]);
        const updatedImages = [...formData.image];
        updatedImages[index] = files[0];
        setFormData({ ...formData, image: updatedImages });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else if (name.startsWith("image")) {
      const index = parseInt(name.split("-")[1]);
      const updatedImages = [...formData.image];
      updatedImages[index] = value;
      setFormData({ ...formData, image: updatedImages });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, image: [...formData.image, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Trim all string fields
    const cleanedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        cleanedData[key] = formData[key].trim();
      } else {
        cleanedData[key] = formData[key];
      }
    });

    const form = new FormData();
    for (const key in cleanedData) {
      if (key === "image") {
        cleanedData.image.forEach((img) => {
          if (img) form.append("image", img);
        });
      } else {
        form.append(key, cleanedData[key]);
      }
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/addVendor`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vendor added successfully!");

      // Redirect to the AllVendor page
      navigate("/allVendor"); // Adjust the path to your actual AllVendor page
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add vendor");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="container mt-4">
        <div className="card p-4 shadow rounded-4">
          <h3 className="mb-4 text-primary">Add Vendor</h3>
          <form onSubmit={handleSubmit}>
            {[ // Form fields...
              "businessName", "address", "pincode", "sinceFrom", "specialistIn",
              "contactPerson", "contactNumber", "email", "pesticideLicence",
              "gstNumber", "membership", "branchDetails", "technicalQualification",
              "password", "aboutUs", "businessType"
            ].map((field) => (
              <div className="form-group mb-3" key={field}>
                <label className="form-label">{field}</label>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <small className="text-danger">{errors[field]}</small>
                )}
              </div>
            ))}

            {/* Logo upload */}
            <div className="form-group mb-3">
              <label className="form-label">Logo</label>
              <input
                type="file"
                name="logo"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Image upload */}
            <div className="form-group mb-3">
              <label className="form-label">Images</label>
              {formData.image.map((img, index) => (
                <input
                  key={index}
                  type="file"
                  name={`image-${index}`}
                  className="form-control mb-2"
                  onChange={handleChange}
                />
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={addImageField}
              >
                Add More Images
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100">
              Add Vendor
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddVendor;
