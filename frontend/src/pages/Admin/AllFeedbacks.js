import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaTrash, FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeader } = useAuth();

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/feedbacks', getAuthHeader());
      setFeedbacks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback?')) {
      await axios.delete(`/api/admin/feedbacks/${id}`, getAuthHeader());
      fetchFeedbacks();
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  if (loading) return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div>
      <h4 className="mb-3 text-white">📝 All User Feedbacks</h4>
      {feedbacks.length === 0 && <Alert variant="info">No feedbacks yet.</Alert>}
      {feedbacks.map(fb => (
        <Card key={fb._id} className="mb-3 shadow bg-dark text-white border-secondary">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <div className="d-flex gap-3 mb-2 flex-wrap">
                  <span><FaUser className="me-1 text-primary" /> {fb.userName}</span>
                  <span><FaEnvelope className="me-1 text-primary" /> {fb.userEmail}</span>
                  <span><FaCalendarAlt className="me-1 text-primary" /> {new Date(fb.createdAt).toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className={i < fb.rating ? 'text-warning' : 'text-secondary'} style={{ filter: i < fb.rating ? 'drop-shadow(0 0 2px gold)' : 'none' }} />)}
                </div>
                <p className="mb-0">{fb.comment}</p>
              </div>
              <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(fb._id)}><FaTrash size={20} /></Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AllFeedbacks;