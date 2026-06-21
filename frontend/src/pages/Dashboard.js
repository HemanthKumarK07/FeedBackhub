import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const handleFeedbackSubmitted = () => setRefresh(prev => !prev);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-white">Loading your dashboard...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          Unable to load user data. Please <a href="/login">log in again</a>.
        </Alert>
      </Container>
    );
  }

  // Fallback display name
  const displayName = user.name || user.email || 'User';

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-white">
          Welcome back, <span className="text-primary">{displayName}</span>!
        </h1>
        <p className="text-white-50">Share your thoughts or see what others are saying.</p>
      </div>
      <Row>
        <Col lg={6} className="mb-4">
          <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
        </Col>
        <Col lg={6}>
          <FeedbackList refresh={refresh} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;