const toggleButton = document.getElementById("eye");
const textBalance = document.getElementById("textBalance");
const depositText = document.getElementById("deposit");
let balanceValue = 0;
let isHidden = true;

toggleButton.addEventListener("click", () => {
  if (isHidden) {
    textBalance.textContent = `R$${balanceValue.toFixed(2)}`;
  } else {
    textBalance.textContent = "*".repeat(balanceValue.toString().length);
  }
  isHidden = !isHidden;
});

function addDeposit(balance) {
  const transactionsSection = document.querySelector("#transactions");

  const article = document.createElement("article");
  article.classList.add("balance");
  article.id = `balance-${balance.id}`;

  const h2 = document.createElement("h2");
  h2.classList.add("deposit-title");
  h2.innerHTML = "Depósito";

  const deposit = document.createElement("h3");
  deposit.classList.add("deposit-value");
  deposit.innerHTML = `R$${balance.deposit}`;

  article.append(h2, deposit);
  transactionsSection.appendChild(article);

  balanceValue += parseFloat(balance.deposit);
  textBalance.textContent = `R$${balanceValue.toFixed(2)}`;
}

async function fetchArticles() {
  const articles = await fetch("http://localhost:3000/balance").then((res) =>
    res.json()
  );
  articles.forEach(addDeposit);

  // Calcula o saldo total no início e exibe
  balanceValue = articles.reduce(
    (total, article) => total + parseFloat(article.deposit),
    0
  );
  textBalance.textContent = `R$${balanceValue.toFixed(2)}`;
  textBalance.textContent = "*".repeat(balanceValue.toString().length);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchArticles();
});

const form = document.querySelector("form");

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const depositValue = parseFloat(document.querySelector("#deposit").value);

  // Verifica se o depositValue é um número válido ou se é NaN (não é um número)
  const isValidDeposit = !isNaN(depositValue) && depositValue !== "";

  const articlesData = {
    deposit: isValidDeposit ? depositValue : 0, // Define o valor do depósito como 0 se não for válido
  };

  const response = await fetch("http://localhost:3000/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articlesData),
  });

  const savedArticle = await response.json();
  form.reset();
  addDeposit(savedArticle);
});

depositText.focus();
