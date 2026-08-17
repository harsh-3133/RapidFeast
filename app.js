// LocalStorage Based Central Cart Manager
const Cart = {
  get: () => JSON.parse(localStorage.getItem('rapid_cart')) || [],

  save: (cart) => {
    localStorage.setItem('rapid_cart', JSON.stringify(cart));
    Cart.updateBadge();
  },

  add: (item) => {
    let cart = Cart.get();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    Cart.save(cart);
    Cart.showToast(`${item.name} added to cart!`);
  },

  remove: (id) => {
    let cart = Cart.get().filter(i => i.id !== id);
    Cart.save(cart);
  },

  updateQty: (id, change) => {
    let cart = Cart.get();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += change;
      if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    Cart.save(cart);
  },

  clear: () => {
    localStorage.removeItem('rapid_cart');
    Cart.updateBadge();
  },

  total: () => {
    return Cart.get().reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  },

  updateBadge: () => {
    const totalCount = Cart.get().reduce((sum, item) => sum + (item.qty || 1), 0);

    // Support both ID formats across all HTML pages
    const badges = document.querySelectorAll('#cartBadge, #cartCountBadge');
    badges.forEach(badge => {
      if (badge) {
        badge.innerText = totalCount;
        badge.style.display = 'inline-block';
      }
    });
  },

  showToast: (msg) => {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastMsg';
      toast.style = 'position:fixed;bottom:20px;right:20px;background:#28a745;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-weight:bold;display:none;';
      document.body.appendChild(toast);
    }
    toast.innerText = `✅ ${msg}`;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }
};

// Auto update on every page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});