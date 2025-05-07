import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './table.css';

const SearchResult = () => {
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/alluser`);
        if (response.data.status === 'ok') {
          setVendors(response.data.data);
        } else {
          setMessage(response.data.message);
        }
      } catch (err) {
        setMessage('Error fetching vendors: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleView = (id) => {
    window.location.href = `/ViewEnquiry/${id}`;
  };

  return (
    <>
      <Sidebar />
      <div className="container-fluid p-4">
        <div className="card shadow-sm rounded">
          <div className="card-body">
            <h3 className="text-center text-primary mb-4">Searched Result</h3>
            {loading ? (
              <p>Loading vendors...</p>
            ) : message ? (
              <div className="alert alert-danger">{message}</div>
            ) : vendors.length ? (
              <table className="table table-striped table-hover text-center">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                   
                    <th>Number</th>
                    <th>Email</th>
                    <th>State</th>
                    <th>Pincode</th>
                    <th>Business Type</th>
                   
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v, i) => (
                    <tr key={v._id}>
                      <td>{i + 1}</td>
                      <td>{v.name}</td>
                      <td>{v.number}</td>
                      <td>{v.email}</td>
                      <td>{v.state}</td>
                      <td>{v.pincode}</td>
                      <td>{v.businessType}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => handleView(v._id)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No User found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
