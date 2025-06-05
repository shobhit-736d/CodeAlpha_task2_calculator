const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const toggleModeBtn = document.getElementById("toggleMode");
const body = document.body;
const historyEl = document.getElementById("history");

function addToHistory(expression, result) {
  const entry = document.createElement("div");
  entry.textContent = `${expression} = ${result}`;
  historyEl.prepend(entry);
}


let currentInput = "";
let justEvaluated = false;

function updateDisplay() {
  display.value = currentInput || "0";
}

function sanitizeInput(input) {
  return input.replace(/×/g, '*').replace(/÷/g, '/');
}

function isOperator(char) {
  return ['+', '-', '*', '/', '.'].includes(char);
}

function evaluateExpression() {
  try {
    const expression = currentInput;
    const result = eval(sanitizeInput(expression));
    addToHistory(expression, result);
    currentInput = result.toString();
    justEvaluated = true;
  } catch {
    currentInput = "Error";
  }
  updateDisplay();
}


function handleButton(value) {
  const lastChar = currentInput.slice(-1);

  if (justEvaluated && !isOperator(value)) {
    currentInput = "";
  }

  justEvaluated = false;

  if (isOperator(value) && isOperator(lastChar) && value !== ".") {
    currentInput = currentInput.slice(0, -1) + value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (value !== undefined) {
      handleButton(value);
    } else if (button.id === "clear") {
      currentInput = "";
      updateDisplay();
    } else if (button.id === "equals") {
      evaluateExpression();
    } else if (button.id === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (/[\d+\-*/.]/.test(key)) {
    handleButton(key);
  } else if (key === "Enter") {
    evaluateExpression();
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (key.toLowerCase() === "c") {
    currentInput = "";
    updateDisplay();
  }
});

toggleModeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
  toggleModeBtn.textContent = body.classList.contains("dark-mode")
    ? "🌙"
    : "🌞";
});

const clearHistoryBtn = document.getElementById("clearHistory");

clearHistoryBtn.addEventListener("click", () => {
  historyEl.innerHTML = "";
});
