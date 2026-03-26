const leadForm = document.getElementById('lead-form');
const calcForm = document.getElementById('calc-form');
const successMsg = document.getElementById('success');
const calculateBtn = document.getElementById('calculate-btn');
const resultEl = document.getElementById('result');
const dealsList = document.getElementById('deals-list');

// Show calculator after lead form
leadForm.addEventListener('submit', function (e) {
  e.preventDefault();
  leadForm.style.display = 'none';
  calcForm.style.display = 'block';

  loadDeals(); // load existing deals when entering calculator
});

// Attach event listener
calculateBtn.addEventListener('click', calculateMAO);

function calculateMAO() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const arv = parseFloat(document.getElementById('arv').value);
  const repairs = parseFloat(document.getElementById('repairs').value);
  const profit = parseFloat(document.getElementById('profit').value);
  const assignment = parseFloat(document.getElementById('assignment').value);
  const closing = parseFloat(document.getElementById('closing').value);

  // Validation
  if (!name || !email) {
    alert('Please enter your name and email.');
    return;
  }

  if (
    isNaN(arv) ||
    isNaN(repairs) ||
    isNaN(profit) ||
    isNaN(assignment) ||
    isNaN(closing)
  ) {
    alert('Please fill out all calculation fields.');
    return;
  }

  const buyerProfit = arv * (profit / 100);
  const mao = arv - repairs - buyerProfit - assignment - closing;

  resultEl.innerText = `Maximum Allowable Offer (MAO): $${mao.toFixed(2)}`;

  const deal = {
    name,
    email,
    arv,
    repairs,
    profit,
    assignment,
    closing,
    mao: mao.toFixed(2),
    date: new Date().toISOString()
  };

  const existingDeals = JSON.parse(localStorage.getItem(email)) || [];
  existingDeals.push(deal);
  localStorage.setItem(email, JSON.stringify(existingDeals));

  successMsg.style.display = 'block';
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);

  // Reset inputs
  document.getElementById('arv').value = '';
  document.getElementById('repairs').value = '';
  document.getElementById('assignment').value = '';
  document.getElementById('closing').value = '';

  loadDeals(); // refresh dashboard
}

// 🔥 Load and display deals
function loadDeals() {
  const email = document.getElementById('email').value.trim();
  const deals = JSON.parse(localStorage.getItem(email)) || [];

  dealsList.innerHTML = '';

  if (deals.length === 0) {
    dealsList.innerHTML = '<p>No deals saved yet.</p>';
    return;
  }

  deals.reverse().forEach(deal => {
    const div = document.createElement('div');
    div.classList.add('deal-card');

    div.innerHTML = `
      <p><strong>ARV:</strong> $${deal.arv}</p>
      <p><strong>MAO:</strong> $${deal.mao}</p>
      <p><strong>Profit:</strong> ${deal.profit}%</p>
      <p><strong>Date:</strong> ${new Date(deal.date).toLocaleDateString()}</p>
    `;

    dealsList.appendChild(div);
  });
}