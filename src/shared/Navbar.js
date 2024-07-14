import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaNewspaper, FaExclamationCircle, FaUser, FaBed, FaIdCard, FaUsers, FaMoneyCheck, FaFileAlt, FaQuestionCircle, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import company_logo from "../Asset/images/company logo.png";
import '../styles/components/Navbar.scss';
import Logout from './../Pages/Dashboard/Logout';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    
    <div className="navbar">
      <div className="top-row">
        <div className="logo-container">
          <div className="logo">
            <img src={company_logo} alt="Logo" />
            <span>PG Manager</span>
          </div>
        </div>
        <div className="right-side">
          <div className="search">
            <input type="text" placeholder="Search everything" />
            <button><i className="fas fa-search"></i></button>
          </div>
          <div className="icons">
            <i className="fas fa-bell"></i>
            <i className="fas fa-user-circle"></i>
          </div>
        </div>
        <div className='logout-nav'>
        <div className="logout-button" data-tooltip="Log out">
          <Logout />
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        </div>
      </div>
      <div className={`bottom-row separate-background ${isMenuOpen ? 'show' : ''}`}>
        <div className={`menu ${isMenuOpen ? 'show' : ''}`}>
          <Link className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">
            <FaHome className="nav-icon" />
            <span className="link_text">Dashboard</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/enquiry' ? 'active' : ''}`} to="/enquiry">
            <FaQuestionCircle className="nav-icon" />
            <span className="link_text">Enquiry</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/tenants' ? 'active' : ''}`} to="/tenants">
            <FaUsers className="nav-icon" />
            <span className="link_text">Tenants</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/aadhar' ? 'active' : ''}`} to="/aadhar">
            <FaIdCard className="nav-icon" />
            <span className="link_text">Aadhar</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`} to="/rooms">
            <FaBed className="nav-icon" />
            <span className="link_text">Rooms</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/complaints' ? 'active' : ''}`} to="/complaints">
            <FaExclamationCircle className="nav-icon" />
            <span className="link_text">Complaints</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} to="/news">
            <FaNewspaper className="nav-icon" />
            <span className="link_text">News</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/meals' ? 'active' : ''}`} to="/meals">
            <FaUtensils className="nav-icon" />
            <span className="link_text">Meals</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/accounts' ? 'active' : ''}`} to="/accounts">
            <FaMoneyCheck className="nav-icon" />
            <span className="link_text">Accounts</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`} to="/reports">
            <FaFileAlt className="nav-icon" />
            <span className="link_text">Reports</span>
          </Link>
          <Link className={`nav-link ${location.pathname === '/setup' ? 'active' : ''}`} to="/setup">
            <FaCog className="nav-icon" />
            <span className="link_text">Set Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
