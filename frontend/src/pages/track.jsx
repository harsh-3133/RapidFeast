import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Track() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://YOUR-RENDER-URL.onrender.com/api/orders/${orderId}`)
      .then(res => {
        setOrder(res.data.order);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-5">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Order Not Found</h4>
        <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate('/')}>
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: '650px' }}>
      <div className="card shadow border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-primary mb-0">Order Placed! 🚀</h4>
          <span className="badge bg-success py-2 px-3">{order.status}</span>
        </div>
        <p className="text-muted small">Tracking ID: <strong>{order.order_id}</strong></p>
        <hr />

        <h6 className="fw-bold text-secondary">Customer Info</h6>
        <p className="mb-1 small"><strong>Name:</strong> {order.customer_name}</p>
        <p className="mb-1 small"><strong>Phone:</strong> {order.phone}</p>
        <p className="mb-3 small"><strong>Address:</strong> {order.address}</p>

        <h6 className="fw-bold text-secondary">Order Summary</h6>
        <div className="bg-light p-3 rounded mb-3">
          {Array.isArray(order.items) ? (
            order.items.map((item, idx) => (
              <div key={idx} className="d-flex justify-content-between small mb-1">
                <span>{item.name} (x{item.qty})</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))
          ) : (
            <p className="small text-muted mb-0">Items stored in cloud record.</p>
          )}
          <hr className="my-2" />
          <div className="d-flex justify-content-between fw-bold text-success">
            <span>Total Paid:</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>

        <button className="btn btn-outline-primary w-100 fw-bold" onClick={() => navigate('/')}>
          Order More Items
        </button>
      </div>
    </div>
  );
}