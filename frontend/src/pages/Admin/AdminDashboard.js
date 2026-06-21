import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { FaUsers, FaComments, FaChartBar, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalFeedbacks: 0, averageRating: 0 });
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats', getAuthHeader());
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [getAuthHeader]);

  return (
    <Container fluid className="mt-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <FaUserShield size={40} className="text-primary" style={{ filter: 'drop-shadow(0 0 5px #0d6efd)' }} />
        <h1 className="text-white">Admin Control Panel</h1>
      </div>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center bg-dark text-white border-primary shadow-lg">
            <Card.Body>
              <FaUsers size={45} className="text-primary mb-2" />
              <h2 className="fw-bold">{stats.totalUsers}</h2>
              <p className="text-white-50">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center bg-dark text-white border-primary shadow-lg">
            <Card.Body>
              <FaComments size={45} className="text-primary mb-2" />
              <h2 className="fw-bold">{stats.totalFeedbacks}</h2>
              <p className="text-white-50">Feedbacks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center bg-dark text-white border-primary shadow-lg">
            <Card.Body>
              <FaChartBar size={45} className="text-primary mb-2" />
              <h2 className="fw-bold">{stats.averageRating.toFixed(1)} / 5</h2>
              <p className="text-white-50">Average Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Nav variant="tabs" className="mb-3">
        <Nav.Item><Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'} className="text-white">📊 Overview</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link as={Link} to="/admin/users" active={location.pathname === '/admin/users'} className="text-white">👥 Users</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link as={Link} to="/admin/feedbacks" active={location.pathname === '/admin/feedbacks'} className="text-white">💬 All Feedbacks</Nav.Link></Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
};

export default AdminDashboard;