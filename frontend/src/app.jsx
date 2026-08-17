import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Track from './pages/Track';

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        <Route path="/track/:orderId" element={<Track />} />
      </Routes>
    </BrowserRouter>
  );
}