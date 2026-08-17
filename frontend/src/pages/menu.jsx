import React from 'react';
import { useNavigate } from 'react-router-dom';

const foodItems = [
  { id: 1, name: 'Zesty Cheesy Burger', price: 199, desc: 'Loaded with melted cheddar & crisp veggies' },
  { id: 2, name: 'Woodfired Pizza', price: 299, desc: 'Crispy crust, rich sauce, and fresh mozzarella' },
  { id: 3, name: 'Peri Peri Fries', price: 149, desc: 'Crispy spiced fries with signature dip' },
  { id: 4, name: 'Steamed Momos', price: 129, desc: 'Hot dumplings served with garlic dip' }
];

export default function Menu({ cart, setCart }) {
  const navigate = useNavigate();

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold text-warning fs-4">RapidFeast</span>
          <button className="btn btn-warning fw-bold position-relative" onClick={() => navigate('/checkout')}>
            🛒 Cart
            {totalItemsCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="container">
        <h3 className="fw-bold mb-4 text-dark">Delicious Fast Food Menu</h3>
        <div className="row g-4">
          {foodItems.map(item => (
            <div key={item.id} className="col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border-0 p-3 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold text-primary">{item.name}</h5>
                  <p className="text-muted small">{item.desc}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                  <span className="fs-5 fw-bold text-success">₹{item.price}</span>
                  <button className="btn btn-sm btn-primary fw-bold" onClick={() => addToCart(item)}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}