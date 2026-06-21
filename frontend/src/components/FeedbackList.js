import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import { FaStar, FaTrash, FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const FeedbackList = ({ refresh }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeader } = useAuth();

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/api/feedback');
      setFeedbacks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback?')) {
      try {
        await axios.delete(`/api/feedback/${id}`, getAuthHeader());
        fetchFeedbacks();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [refresh]);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Card className="shadow-lg">
      <Card.Body>
        <Card.Title className="mb-3 text-white">📋 Recent Feedback ({feedbacks.length})</Card.Title>
        {feedbacks.length === 0 ? (
          <Alert variant="info">No feedback yet. Be the first to share!</Alert>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="pe-2">
            {feedbacks.map(fb => (
              <Card key={fb._id} className="mb-3 bg-dark text-white border-secondary shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex gap-3 mb-2 flex-wrap">
                        <span className="text-primary"><FaUser className="me-1" /> {fb.userName}</span>
                        <span className="text-info"><FaEnvelope className="me-1" /> {fb.userEmail}</span>
                        <span className="text-secondary"><FaCalendarAlt className="me-1" /> {new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < fb.rating ? 'text-warning' : 'text-secondary'} style={{ filter: i < fb.rating ? 'drop-shadow(0 0 2px gold)' : 'none' }} />
                        ))}
                      </div>
                      <p className="mb-0">{fb.comment}</p>
                    </div>
                    {(user && (fb.user === user.id || user.role === 'admin')) && (
                      <Button variant="link" className="text-danger p-0 ms-3" onClick={() => handleDelete(fb._id)}>
                        <FaTrash size={18} />
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FeedbackList;