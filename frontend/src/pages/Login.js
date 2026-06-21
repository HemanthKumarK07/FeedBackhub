import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '450px' }}>
      <Card className="shadow-lg neon-border">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <FaSignInAlt size={50} className="text-primary mb-3" style={{ filter: 'drop-shadow(0 0 8px #0d6efd)' }} />
            <Card.Title className="h3 text-white">Welcome Back</Card.Title>
            <p className="text-white-50">Sign in to your account</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50"><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="text-white-50"><FaLock className="me-1" /> Password</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold">Login</Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/signup">Don't have an account? Sign up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;