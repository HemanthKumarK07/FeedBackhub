import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    const result = await signup(name, email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow-lg neon-border">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <FaUserPlus size={50} className="text-primary mb-3" style={{ filter: 'drop-shadow(0 0 8px #0d6efd)' }} />
            <Card.Title className="h3 text-white">Create Account</Card.Title>
            <p className="text-white-50">Join the feedback community</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50"><FaUser className="me-1" /> Full Name</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50"><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50"><FaLock className="me-1" /> Password (min 6)</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="text-white-50"><FaLock className="me-1" /> Confirm Password</Form.Label>
              <Form.Control type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 rounded-pill py-2 fw-bold">Sign Up</Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Sign in</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;