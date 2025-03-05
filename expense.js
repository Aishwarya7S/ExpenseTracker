// DOM Elements
const expenseForm = document.getElementById('expense-form');
const thresholdForm = document.getElementById('threshold-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const thresholdValueInput = document.getElementById('threshold-value');
const thresholdNotification = document.getElementById('threshold-notification');

// Initialize variables
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let thresholdValue = parseFloat(localStorage.getItem('thresholdValue')) || 0;

// Function to save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('thresholdValue', thresholdValue.toString());
}

// Function to add an expense
function addExpense(name, amount, date) {
  const expense = { id: Date.now(), name, amount: parseFloat(amount), date };
  expenses.push(expense);
  saveToLocalStorage();
  renderExpenses();
}

// Function to delete an expense
function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveToLocalStorage();
  renderExpenses();
}

// Function to calculate the total amount
function calculateTotal() {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// Function to check if total exceeds the threshold
function checkThreshold() {
  const total = calculateTotal();
  if (thresholdValue && total > thresholdValue) {
    thresholdNotification.textContent = `Warning: Total expenses exceed the threshold value of ₹${thresholdValue.toFixed(2)}!`;
  } else {
    thresholdNotification.textContent = '';
  }
}

// Function to render expenses in the table
function renderExpenses() {
  expenseList.innerHTML = '';

  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${expense.name}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>${expense.date}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    expenseList.appendChild(row);
  });

  // Update total amount
  const total = calculateTotal();
  totalAmount.textContent = total.toFixed(2);

  // Check threshold
  checkThreshold();
}

// Event listener for adding expenses
expenseForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('expense-name').value.trim();
  const amount = document.getElementById('expense-amount').value.trim();
  const date = document.getElementById('expense-date').value.trim();

  if (name && amount && date) {
    addExpense(name, parseFloat(amount), date);
    expenseForm.reset();
  } else {
    alert('Please fill in all fields.');
  }
});

// Event listener for setting the threshold value
thresholdForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = parseFloat(thresholdValueInput.value.trim());
  if (value >= 0) {
    thresholdValue = value;
    saveToLocalStorage();
    renderExpenses();
    thresholdValueInput.value = '';
  } else {
    alert('Please enter a valid threshold value.');
  }
});

// Initial rendering
renderExpenses();
