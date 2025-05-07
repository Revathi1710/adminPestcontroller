import React from 'react';
import './sidebar.css';

const Sidebar = ({ currentPage }) => {
  const navLinks = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Add Vendor", path: "/AddVendor" },
    { name: "All Vendor", path: "/AllVendor" },
    { name: "Onboarded Vendors", path: "/OnboardedVendors" },
    { name: "Expired Vendors", path: "/ExpiredVendors" },
    { name: "Searched Result", path: "/SearchResult" },
    { name: "Logout", path: "/logout" },
  ];

  return (
    <div>
      {/* Optional: logout banner at top */}
      <div className="logout-container"></div>

      {/* Navbar section */}
      <div className='fullboxsidebar p-3'>
        <div className="logoimagesection">
          <h2 className='logo-name'>Pest Controller</h2>
        </div>
      

      {/* Navigation links */}
      <div className="container1 mt-2 headerallList">
        {navLinks.map(link => (
          <a
            key={link.path}
            href={link.path.startsWith('/') ? link.path : `/${link.path}`}
            className={`headerlist ${currentPage === link.path ? 'active' : ''}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div></div>
  );
};

export default Sidebar;
