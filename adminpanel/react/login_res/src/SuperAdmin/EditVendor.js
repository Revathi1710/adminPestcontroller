import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

function EditVendor() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

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
    aboutUs: "",
  });

  const [logoImage, setLogoImage] = useState(null);
  const [existingLogoImage, setExistingLogoImage] = useState("");
  const [propertyImages, setPropertyImages] = useState([]);
  const [existingPropertyImages, setExistingPropertyImages] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/getVendor/${vendorId}`)
      .then(res => {
        const data = res.data.vendor;
        setFormData({
          businessName: data.businessName || "",
          address: data.address || "",
          pincode: data.pincode || "",
          sinceFrom: data.sinceFrom || "",
          specialistIn: data.specialistIn || "",
          contactPerson: data.contactPerson || "",
          contactNumber: data.contactNumber || "",
          email: data.email || "",
          pesticideLicence: data.pesticideLicence || "",
          gstNumber: data.gstNumber || "",
          membership: data.membership || "",
          branchDetails: data.branchDetails || "",
          technicalQualification: data.technicalQualification || "",
          password: "",
          aboutUs: data.aboutUs || "",
        });
        setExistingLogoImage(data.logo || "");
        setExistingPropertyImages(data.image || []);
      })
      .catch(err => {
        console.error("Error fetching vendor", err);
        alert("Failed to load vendor data");
      });
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoImage({ file, preview: URL.createObjectURL(file) });
      setExistingLogoImage(""); // remove existing logo preview
    }
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPropertyImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveGalleryImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingPropertyImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setPropertyImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedForm.append(key, value);
    });

    if (logoImage) {
      updatedForm.append("logoImage", logoImage.file);
    } else if (existingLogoImage) {
      updatedForm.append("existingLogo", existingLogoImage);
    }

    existingPropertyImages.forEach(img => {
      updatedForm.append("existingImages", img);
    });

    propertyImages.forEach(img => {
      updatedForm.append("propertyImages", img.file);
    });

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/editVendor/${vendorId}`, updatedForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Vendor updated successfully!");
      navigate("/AllVendor");
    } catch (error) {
      console.error("Error updating vendor", error);
      alert("Failed to update vendor");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="container mt-4">
        <h3>Edit Vendor</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {Object.keys(formData).map((key) =>
            key !== "aboutUs" && key !== "password" ? (
              <input
                key={key}
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, ' $1')}
                className="form-control mb-2"
              />
            ) : key === "aboutUs" ? (
              <textarea
                key={key}
                name="aboutUs"
                value={formData.aboutUs}
                onChange={handleChange}
                placeholder="About Us"
                className="form-control mb-2"
                rows={3}
              ></textarea>
            ) : (
              <input
                key={key}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
                className="form-control mb-2"
              />
            )
          )}

          <h4>Upload Logo</h4>
          <div className="upload-logo mb-3" style={{width:'150px'}}>
            <label className="upload-box"  style={{width:'150px'}}>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoImageChange}
                hidden
              />
              <div className="upload-content text-center">
                <span className="display-5">+</span>
                <p>Upload Logo</p>
              </div>
            </label>

            {logoImage ? (
              <div className="image-thumbnail">
                <img src={logoImage.preview} alt="Uploaded Logo" width={100} />
                <button
                  type="button"
                  className="remove-btn btn-close"
                  onClick={() => setLogoImage(null)}
                ></button>
              </div>
            ) : existingLogoImage && (
              <div className="image-thumbnail">
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${existingLogoImage}`}
                  alt="Existing Logo" width={100}
                />
              </div>
            )}
          </div>

          <h4>Upload Property Photos</h4>
          <div className="gallery-grid mt-3">
            <label className="upload-box"  style={{width:'150px'}}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImageChange}  
                hidden
              />
              <div className="upload-content text-center">
                <span className="display-5">+</span>
                <p>Upload Photos</p>
              </div>
            </label>

            {existingPropertyImages.map((img, index) => (
              <div className="image-thumbnail" key={`existing-${index}`}>
                <img src={`${process.env.REACT_APP_API_URL}/uploads/${img}`} width={200} alt={`existing-${index}`} />
                <button
                  type="button"
                  className="remove-btn btn-close"
                  onClick={() => handleRemoveGalleryImage(index, true)}
                ></button>
              </div>
            ))}

            {propertyImages.map((img, index) => (
              <div className="image-thumbnail" key={`new-${index}`}>
                <img src={img.preview} alt={`new-${index}`} />
                <button
                  type="button"
                  className="remove-btn btn-close"
                  onClick={() => handleRemoveGalleryImage(index)}
                ></button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary mt-4">Update Vendor</button>
        </form>
      </div>
    </>
  );
}

export default EditVendor;
