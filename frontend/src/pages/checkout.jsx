import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cart, setCart }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (showQR && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showQR, timeLeft]);

  const handleGenerateQR = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty! Please select items first.');
      return;
    }
    setShowQR(true);
    setTimeLeft(300);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // POST request to FastAPI Backend
      const res = await axios.post('https://YOUR-RENDER-URL.onrender.com/api/orders', {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: cart,
        totalAmount: totalAmount
      });

      if (res.data.success) {
        const orderId = res.data.order.order_id;
        setCart([]);
        navigate(`/track/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Order placement failed. Check if FastAPI backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Secure Checkout</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/')}>
          &larr; Back to Menu
        </button>
      </div>

      <div className="row g-4">
        {/* Left: Summary & Form */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-bold mb-3">Cart Summary</h5>
            {cart.length === 0 ? (
              <p className="text-muted small mb-0">Cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between py-2 border-bottom small">
                  <span>{item.name} (x{item.qty})</span>
                  <span className="fw-bold">₹{item.price * item.qty}</span>
                </div>
              ))
            )}
            <div className="d-flex justify-content-between mt-3 fw-bold fs-5 text-success">
              <span>Grand Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Delivery Information</h5>
            <form onSubmit={handleGenerateQR}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="Enter contact number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Delivery Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  required
                  placeholder="Street, City, Pin Code"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={cart.length === 0}>
                Proceed to Pay & Generate QR
              </button>
            </form>
          </div>
        </div>

        {/* Right: Payment Box */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center">
            {showQR ? (
              <div>
                <h5 className="fw-bold">Scan & Pay via UPI</h5>
                <p className="text-muted small">
                  Session expires in: <strong className="text-danger">{minutes}:{seconds}</strong>
                </p>
                <div className="my-3 p-2 bg-white border rounded d-inline-block shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=rapidfeast@upi&pn=RapidFeast&am=${totalAmount}`}
                    alt="Payment QR"
                    style={{ width: '180px', height: '180px' }}
                  />
                </div>
                <div className="alert alert-info py-2 small mb-3">GPay / PhonePe / Paytm Supported</div>
                <button
                  className="btn btn-success w-100 fw-bold py-2"
                  onClick={handleConfirmPayment}
                  disabled={loading}
                >
                  {loading ? 'Saving Order...' : 'Simulate Payment Done ✅'}
                </button>
              </div>
            ) : (
              <div>
                <div className="fs-1 text-muted mb-2">🔒</div>
                <h5 className="fw-bold text-muted">QR Code Locked</h5>
                <p className="text-muted small px-3">
                  Please fill out the delivery details on the left and click proceed to unlock dynamic QR.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}