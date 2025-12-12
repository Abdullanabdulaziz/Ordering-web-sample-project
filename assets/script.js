// Simple script to handle login modal, localStorage and order logic

(function () {
  // Helpers
  const q = (s) => document.querySelector(s);
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch(e){ return null; }
  };
  const setUser = (u) => localStorage.setItem('user', JSON.stringify(u));

  // Index page: login modal
  const loginBtn = q('#loginBtn');
  const loginModal = q('#loginModal');
  const closeLogin = q('#closeLogin');
  const loginForm = q('#loginForm');
  const clearLogin = q('#clearLogin');

  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
      const user = getUser();
      if (user) {
        // prefill
        q('#loginName').value = user.name || '';
        q('#loginPhone').value = user.phone || '';
        q('#loginEmail').value = user.email || '';
      } else {
        q('#loginName').value = '';
        q('#loginPhone').value = '';
        q('#loginEmail').value = '';
      }
      loginModal.setAttribute('aria-hidden','false');
    });
    closeLogin.addEventListener('click', () => loginModal.setAttribute('aria-hidden','true'));
    loginModal.addEventListener('click', (e) => { if (e.target === loginModal) loginModal.setAttribute('aria-hidden','true'); });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = q('#loginName').value.trim();
      const phone = q('#loginPhone').value.trim();
      const email = q('#loginEmail').value.trim();
      if (!name) { alert('Please provide a name'); return; }
      setUser({name, phone, email});
      loginModal.setAttribute('aria-hidden','true');
      alert('Login info saved in localStorage');
    });

    clearLogin.addEventListener('click', () => {
      localStorage.removeItem('user');
      q('#loginName').value = '';
      q('#loginPhone').value = '';
      q('#loginEmail').value = '';
      alert('Saved user cleared');
      location.reload();
    });
  }

  // Order page logic
  const orderForm = q('#orderForm');
  if (orderForm) {
    const nameInput = q('#name');
    const phoneInput = q('#phone');
    const emailInput = q('#email');
    const billOther = q('#billOther');
    const clearOrder = q('#clearOrder');
    const userSummary = q('#userSummary');
    const homeTitle = q('#homeTitle');

    // Prefill from user localStorage (after logging in)
    const user = getUser();
    if (user) {
      nameInput.value = user.name || '';
      phoneInput.value = user.phone || '';
      emailInput.value = user.email || '';
      userSummary.innerHTML = `<strong>Saved from login:</strong><br>Name: ${user.name || '-'}<br>Phone: ${user.phone || '-'}<br>Email: ${user.email || '-'}`;
      homeTitle.textContent = 'Home (user info)';
    } else {
      // If any previously saved order exists, prefill
      const savedOrder = JSON.parse(localStorage.getItem('order') || 'null');
      if (savedOrder) {
        nameInput.value = savedOrder.name || '';
        phoneInput.value = savedOrder.phone || '';
        emailInput.value = savedOrder.email || '';
        userSummary.innerHTML = `<strong>Saved order:</strong><br>Name: ${savedOrder.name || '-'}<br>Phone: ${savedOrder.phone || '-'}<br>Email: ${savedOrder.email || '-'}`;
      }
    }

    // Validation rules:
    // - If "Bill made by someone else" is unchecked: email is mandatory
    // - If checked: email optional, but phone is required
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const billByOther = billOther.checked;

      if (!name) { alert('Please enter your name'); return; }

      if (!billByOther) {
        // email mandatory
        if (!email) { alert('Email is required unless the bill is made by someone else'); return; }
      } else {
        // bill by someone else: phone required
        if (!phone) { alert('Phone number is required when the bill is made by someone else'); return; }
      }

      // Save to localStorage
      const order = { name, phone, email, billByOther, savedAt: new Date().toISOString() };
      localStorage.setItem('order', JSON.stringify(order));

      // Show popup message "Submit Success"
      alert('Submit Success');

      // Update summary on page
      userSummary.innerHTML = `<strong>Saved order:</strong><br>Name: ${name || '-'}<br>Phone: ${phone || '-'}<br>Email: ${email || '-'}`;
    });

    clearOrder && clearOrder.addEventListener('click', () => {
      localStorage.removeItem('order');
      nameInput.value = '';
      phoneInput.value = '';
      emailInput.value = '';
      billOther.checked = false;
      userSummary.textContent = 'No user info saved. Please login from the main page or fill the form below.';
      alert('Order data cleared from localStorage');
    });
  }

  // Small: if logo image is missing, use a colored placeholder
  const logo = q('#logoImg') || q('.logo');
  if (logo) {
    logo.addEventListener('error', () => {
      // create a basic SVG data URL placeholder
      const name = 'AB';
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='#0b72ff'/><text x='50%' y='55%' font-size='42' fill='white' text-anchor='middle' font-family='Arial' dy='.3em'>${name}</text></svg>`;
      logo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
})();
