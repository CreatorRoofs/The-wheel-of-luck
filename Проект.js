const wheel = document.getElementById("wheel");
const itemsList = document.getElementById("itemsList");
const resultDisplay = document.getElementById("result");
const input = document.getElementById("newItem");

let variants = [];

const colors = [
  "#ef4444", '#22c55e', "#06b6d4", "#f59e0b", "#eab308", "#84cc16",
  "#10b981", "#3b82f6", "#6366f1", "#8b5cf6",
  "#d946ef", "#ec4899", "#f43f5e", '#50c878'
];


// Отрисовка списка с цветными точками
function renderVariants() {
  itemsList.innerHTML = "";

  if (variants.length === 0) {
    itemsList.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">Пока ничего нет…</p>';
    return;
  }

  variants.forEach((text, index) => {
    const div = document.createElement("div");
    div.className = "item";

    // Цветной кружок
    const colorDot = document.createElement("div");
    colorDot.className = "color-dot";
    colorDot.style.backgroundColor = colors[index % colors.length];

    const span = document.createElement("span");
    span.textContent = text;

    const btn = document.createElement("button");
    btn.textContent = "× Удалить";
    btn.onclick = () => {
      variants.splice(index, 1);
      renderVariants();

      resultDisplay.textContent = "Нажми «Крутить колесо!»";
    };

    div.append(colorDot, span, btn);
    itemsList.appendChild(div);
  });
}


// Рисуем колесо (без изменений)
function drawWheel() {
  if (variants.length === 0) {
    wheel.style.background = "#e5e7eb";
    return;
  }

  const angleStep = 360 / variants.length;
  let gradientParts = [];

  variants.forEach((_, i) => {
    const color = colors[i % colors.length];
    const start = i * angleStep;
    const end   = (i + 1) * angleStep;
    gradientParts.push(`${color} ${start}deg ${end}deg`);
  });

  wheel.style.background = `conic-gradient(${gradientParts.join(", ")})`;
}


// Добавление варианта
function addVariant() {
  const value = input.value.trim();
  if (!value) return;

  variants.push(value);
  input.value = "";
  renderVariants();
  drawWheel();
}


// Вращение
function spin() {
  if (variants.length < 2) {
    resultDisplay.textContent = "Добавьте хотя бы 2 варианта!";
    return;
  }

  if (isSpinning) return;

  isSpinning = true;
  resultDisplay.textContent = "Крутим...";

  const winnerIndex = Math.floor(Math.random() * variants.length);
  const winnerText  = variants[winnerIndex];

  const sectorDeg = 360 / variants.length;
  const middleOfWinnerSector = winnerIndex * sectorDeg + sectorDeg / 2;

  let targetAngle = -middleOfWinnerSector;
  const extraTurns = 5 + Math.floor(Math.random() * 10);
  targetAngle += 360 * extraTurns;

  wheel.style.transform = `rotate(${targetAngle}deg)`;

  setTimeout(() => {
    resultDisplay.textContent = `Победил: ${winnerText} !`;
    isSpinning = false;
  }, 4300);
}


// События
document.getElementById("addBtn").onclick = addVariant;

input.addEventListener("keypress", e => {
  if (e.key === "Enter") addVariant();
});

document.getElementById("spinBtn").onclick = spin;

document.getElementById("clearBtn").onclick = () => {
  if (!confirm("Точно очистить всё?")) return;
  variants = [];
  renderVariants();
  drawWheel();
  resultDisplay.textContent = "Нажми «Крутить колесо!»";
};

// Инициализация
let isSpinning = false;
renderVariants();
drawWheel();

