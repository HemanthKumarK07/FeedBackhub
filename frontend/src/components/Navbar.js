import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FaCommentDots, FaSignOutAlt, FaUser, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BSNavbar expand="lg" className="shadow-sm mb-4">
      <Container>
        <BSNavbar.Brand as={Link} to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="fw-bold">
          <FaCommentDots className="text-primary me-2" style={{ filter: 'drop-shadow(0 0 3px #0d6efd)' }} />
          FeedbackHub
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {user && (
              <>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="d-flex align-items-center gap-1 text-primary">
                    <FaShieldAlt /> Admin
                  </Nav.Link>
                )}
                <Nav.Link disabled className="d-flex align-items-center gap-2 text-white-50">
                  <FaUser /> {user.name}
                  <span className="badge bg-primary ms-1">{user.role}</span>
                </Nav.Link>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-1 rounded-pill">
                  <FaSignOutAlt /> Logout
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;