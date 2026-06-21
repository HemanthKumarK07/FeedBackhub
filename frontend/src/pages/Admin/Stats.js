import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const Stats = () => {
  const [stats, setStats] = useState({ ratingDistribution: [] });
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get('/api/admin/stats', getAuthHeader());
      setStats(res.data.data);
    };
    fetchStats();
  }, [getAuthHeader]);

  const distribution = [1,2,3,4,5].map(rating => {
    const found = stats.ratingDistribution.find(d => d._id === rating);
    return { rating, count: found ? found.count : 0 };
  });
  const total = distribution.reduce((s, d) => s + d.count, 0);

  return (
    <Card className="shadow bg-dark text-white border-primary">
      <Card.Body>
        <Card.Title className="mb-4">⭐ Rating Distribution</Card.Title>
        {distribution.map(item => (
          <div key={item.rating} className="mb-3">
            <div className="d-flex align-items-center gap-3 mb-1">
              <div className="d-flex gap-1" style={{ width: '100px' }}>
                {[...Array(5)].map((_, i) => <FaStar key={i} className={i < item.rating ? 'text-warning' : 'text-secondary'} size={14} />)}
              </div>
              <span style={{ width: '70px' }} className="text-white-50">{item.count} votes</span>
              <div className="flex-grow-1">
                <ProgressBar now={total ? (item.count / total) * 100 : 0} label={`${total ? Math.round((item.count / total) * 100) : 0}%`} />
              </div>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default Stats;