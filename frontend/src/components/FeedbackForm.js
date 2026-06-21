import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const { getAuthHeader } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/feedback', { rating, comment }, getAuthHeader());
      setSuccess('🎉 Thank you! Your feedback has been submitted.');
      setRating(5);
      setComment('');
      onFeedbackSubmitted();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <Card.Body>
        <Card.Title className="mb-4 text-white fw-bold">✨ Share Your Feedback</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white-50">Rating</Form.Label>
            <div className="d-flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="btn btn-link p-0 text-decoration-none"
                >
                  {star <= rating ? (
                    <FaStar className="text-warning fs-2" style={{ filter: 'drop-shadow(0 0 2px gold)' }} />
                  ) : (
                    <FaRegStar className="text-secondary fs-2" />
                  )}
                </button>
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="text-white-50">Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              placeholder="Tell us about your experience..."
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading} className="w-100 rounded-pill fw-semibold">
            {loading ? 'Submitting...' : '💬 Submit Feedback'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;