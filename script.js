const slides = Array.from(document.querySelectorAll(".slide"));
let current = 0;

function showSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === current);
  });

  document.getElementById("counter").textContent =
    String(current + 1).padStart(2, "0") +
    " / " +
    String(slides.length).padStart(2, "0");

  document.getElementById("progress").style.width =
    ((current + 1) / slides.length * 100) + "%";

  document.getElementById("prev").disabled = current === 0;

  document.getElementById("next").textContent =
    current === slides.length - 1
      ? "Recomeçar ↻"
      : "Próximo →";

  document.getElementById("dots").textContent =
    String(current + 1).padStart(2, "0") +
    " · " +
    String(slides.length).padStart(2, "0");
}

function move(direction) {
  if (current === slides.length - 1 && direction === 1) {
    showSlide(0);
    return;
  }

  showSlide(current + direction);
}

// Também permite usar as setas do teclado.
document.addEventListener("keydown", function (event) {
  if (event.target.matches("input, textarea")) return;

  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    move(1);
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    move(-1);
  }

  if (event.key === "Home") showSlide(0);
  if (event.key === "End") showSlide(slides.length - 1);
});

// Formata os valores como moeda brasileira.
function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Calculadora de resultado e margem.
function calculate() {
  const getValue = id => {
    const field = document.getElementById(id);
    return Math.max(0, Number(field.value) || 0);
  };

  const revenue = getValue("revenue");
  const variable = getValue("variable");
  const fixed = getValue("fixed");
  const other = getValue("other");

  const employees = Math.floor(getValue("employees"));
  const salary = getValue("salary");
  const chargesRate = getValue("charges") / 100;

  const salaryTotal = employees * salary;
  const chargesTotal = salaryTotal * chargesRate;
  const teamTotal = salaryTotal + chargesTotal;

  // O custo da equipe é acrescentado às despesas fixas
  // para evitar contar o mesmo gasto duas vezes.
  const profit = revenue - variable - fixed - other - teamTotal;
  const margin = revenue > 0 ? (profit / revenue) * 100 : null;

  document.getElementById("salaryTotal").textContent =
    money(salaryTotal);

  document.getElementById("chargesTotal").textContent =
    money(chargesTotal);

  document.getElementById("teamTotal").textContent =
    money(teamTotal);

  const profitElement = document.getElementById("profit");
  profitElement.textContent = money(profit);
  profitElement.style.color =
    profit >= 0 ? "var(--green)" : "var(--red)";

  document.getElementById("margin").textContent =
    margin === null
      ? "N/A — informe a receita"
      : margin.toLocaleString("pt-BR", {
          maximumFractionDigits: 1
        }) + "%";

  const bar = document.getElementById("marginbar");
  bar.style.width =
    Math.min(100, Math.max(0, margin || 0)) + "%";
  bar.style.background =
    profit >= 0 ? "var(--green)" : "var(--red)";

  const message = document.getElementById("message");

  if (profit > 0) {
    message.textContent =
      "A empresa apresenta lucro neste cenário.";
  } else if (profit === 0) {
    message.textContent =
      "A empresa está no ponto de equilíbrio neste cenário.";
  } else {
    message.textContent =
      "Atenção: os gastos superam a receita. Há prejuízo neste cenário.";
  }
}

["revenue", "variable", "fixed", "other",
 "employees", "salary", "charges"].forEach(id => {
  document.getElementById(id).addEventListener("input", calculate);
});

// Atualiza o resultado sempre que um campo muda.
["revenue", "variable", "fixed", "other"].forEach(id => {
  document.getElementById(id).addEventListener("input", calculate);
});

// Quiz de conhecimentos financeiros.
function quiz(button, correct) {
  const buttons = document.querySelectorAll(".quiz button");

  buttons.forEach(item => {
    item.disabled = true;
  });

  button.style.borderColor =
    correct ? "var(--green)" : "var(--red)";

  const answer = document.getElementById("answer");

  answer.textContent = correct
    ? "Muito bem! R$ 10.000 − R$ 7.000 = R$ 3.000. Resposta correta!"
    : "Quase! A resposta correta é B: R$ 3.000. Basta subtrair os gastos da receita.";

  answer.style.color =
    correct ? "var(--green)" : "var(--red)";
}

// Inicializa a apresentação.
showSlide(0);
calculate();