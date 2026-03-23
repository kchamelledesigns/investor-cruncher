const leadForm = document.getElementById('lead-form');
const calcForm = document.getElementById('calc-form');
const successMsg = document.getElementById('success');
const calculateBtn = document.getElementById('calculate-btn');

// Show calculator after lead form
leadForm.addEventListener('submit', function (e) {
  e.preventDefault();
  leadForm.style.display = 'none';
  calcForm.style.display = 'block';
});

// Attach event listener instead of inline onclick
calculateBtn.addEventListener('click', calculateMAO);

async function calculateMAO() {
  const arv = parseFloat(document.getElementById('arv').value);
  const repairs = parseFloat(document.getElementById('repairs').value);
  const profit = parseFloat(document.getElementById('profit').value);
  const assignment = parseFloat(document.getElementById('assignment').value);
  const closing = parseFloat(document.getElementById('closing').value);
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const buyerProfit = arv * (profit / 100);
  const mao = arv - repairs - buyerProfit - assignment - closing;

  document.getElementById('result').innerText =
    `Maximum Allowable Offer (MAO): $${mao.toFixed(2)}`;

  const payload = {
    name,
    email,
    arv,
    repairs,
    profit,
    assignment,
    closing,
    mao: mao.toFixed(2)
  };

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycby7GZI6bNcGNLoqf8e_Z1ZDLlGTBx_TFn-8Uuf8PQFQxLin34iD0Q_0zjRgX6mLoLQ/exec', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log(result);

    if (result.result === 'success') {
      successMsg.style.display = 'block';

      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    }

  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
  }
}
