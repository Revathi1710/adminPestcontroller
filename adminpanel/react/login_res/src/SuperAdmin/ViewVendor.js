import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../SuperAdmin/addcategory.css';
import '../Vendors/sidebar2.css';
import Sidebar from './sidebar';
import '../Vendors/UserProfile.css';
import './Vendorview.css';

const ViewVendor = () => {
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState({});
  const [error, setError] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [existingLogoImage, setExistingLogoImage] = useState(null);
  const [existingPropertyImages, setExistingPropertyImages] = useState([]);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/getvendorDetails`, { vendorId })
      .then((response) => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
          setExistingLogoImage(response.data.data.logo);
          setExistingPropertyImages(
            Array.isArray(response.data.data.image) ? response.data.data.image : []
          );
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/updateVendorDetails`, {
        ...vendorData,
        vendorId,
      });
      setIsEditable(false);
      alert('Vendor details updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Error updating vendor details');
    }
  };

  const renderField = (label, fieldName) => (
    <>
      <div className="vendor-label">{label}</div>
      <div className="vendor-value">
        {isEditable ? (
          <input
            type="text"
            className="form-control"
            name={fieldName}
            value={vendorData[fieldName] || ''}
            onChange={handleChange}
          />
        ) : (
          vendorData[fieldName] || '-'
        )}
      </div>
    </>
  );

  return (
    <div className="">
      <Sidebar />

      <div className="container containerDashboard mb-3 mt-2">
        <div className="mb-4 p-3 d-flex justify-content-between">
          <h3>View Vendor Details</h3>
         {/* <div>
            {isEditable ? (
              <>
                <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setIsEditable(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditable(true)}>Edit</button>
            )}
          </div>*/}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="vendor-details">
          {renderField('Company Name :', 'businessName')}
          {renderField('Contact Person :', 'contactPerson')}
          {renderField('Contact Number :', 'contactNumber')}
          {renderField('Address :', 'address')}
          {renderField('Pincode :', 'pincode')}
          {renderField('Since From :', 'sinceFrom')}
          {renderField('Specialist In :', 'specialistIn')}
          {renderField('Pesticide Licence :', 'pesticideLicence')}
          {renderField('GST Number :', 'gstNumber')}
          {renderField('Membership :', 'membership')}
          {renderField('Branch Details :', 'branchDetails')}
          {renderField('Technical Qualification :', 'technicalQualification')}

          <div className="vendor-label">About Us :</div>
          <div className="vendor-value">
            {isEditable ? (
              <textarea
                className="form-control"
                name="aboutUs"
                value={vendorData.aboutUs || ''}
                onChange={handleChange}
                rows="4"
              />
            ) : (
              vendorData.aboutUs || '-'
            )}
          </div>
    

        <div className="vendor-label">Logo:</div>
        <div className="vendor-value">
        
          <div className="upload-logo">
            {logoImage ? (
              <div className="image-thumbnail">
                <img src={logoImage.preview} width={100} alt="Uploaded Logo" />
              </div>
            ) : existingLogoImage ? (
              <div className="image-thumbnail">
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${existingLogoImage}`}
                  alt="Existing Logo" className='logoImage'
                  width={100}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            ) : (
              <p>No logo available</p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="vendor-label">Images:</div>
        <div className="vendor-value">
          <div className="d-flex  gap-3">
            {existingPropertyImages.length > 0 ? (
              existingPropertyImages.map((url, index) => (
                <div className="image-thumbnail2" key={index}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${url}`}
                    alt={`Gallery ${index}`}
                    width={200}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png"; // optional fallback image
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No gallery images found.</p>
            )}
          </div>
        </div>
      </div>    </div>
    </div>
  );
};

export default ViewVendor;
