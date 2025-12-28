// Данные фигур берём из data.js
// shogiPieces уже определён в data.js

// Находим элементы кнопок и блока контента
const figuresBtn = document.getElementById("figuresBtn");
const rulesBtn = document.getElementById("rulesBtn");
const costBtn = document.getElementById("costBtn");
const testBtn = document.getElementById("testBtn");
const content = document.getElementById("content");

// Функция для отображения всех фигур с изображениями
function showFigures() {
    let html = "<h2>Фигуры сёги</h2>";
    shogiPieces.forEach(piece => {
        html += `
            <div class="piece">
                <h3>${piece.name} (${piece.kanji})</h3>
                <p><strong>Чтение:</strong> ${piece.reading}</p>
                <p><strong>Ход:</strong> ${piece.move}</p>
                <img src="${piece.image}" alt="${piece.name} ход">
                <p><strong>Стоимость:</strong> ${piece.value}</p>
            </div>
        `;
    });
    content.innerHTML = html;
}

// Функция для отображения правил (обновлено)
function showRules() {
    content.innerHTML = `
        <div class="rules">
            <h2>Правила игры</h2>
            <ul>
                <li>Игроки ходят по очереди.</li>
                <li>Цель: поставить мат королю противника.</li>
                <li>Взятые фигуры можно возвращать на доску.</li>
                <li>Пешка не может быть две в одном столбце.</li>
                <li>Пешка не может сразу поставить мат при сбросе.</li>
                <li>Фигуры могут превращаться при достижении последней трети доски (зона продвижения противника).</li>
                <li>Превращение меняет ход фигуры на более сильный (например, пешка → золотой генерал).</li>
                <li>Не все фигуры могут превращаться: король и золотой генерал не превращаются.</li>
                <li>Игрок выбирает, превращать фигуру или нет при входе в зону продвижения.</li>
            </ul>
            <p><strong>Ценность фигур:</strong> Король > Ладья > Слон > Золотой генерал > Серебряный генерал > Конь > Копьё > Пешка.</p>
            <p><em>Превращённые фигуры считаются сильнее, особенно токин (превращённая пешка).</em></p>
            <p><strong>Фазы игры:</strong> Дебют → Миттельшпиль → Эндшпиль. В дебюте разворачиваем фигуры, в миттельшпиле принимаем решения и оцениваем позиции, в эндшпиле важна скорость атаки и защита короля.</p>
        </div>
    `;
}


// Функция для отображения стоимости фигур
function showCost() {
    let html = "<h2>Стоимость фигур</h2><ul>";
    shogiPieces.forEach(piece => {
        html += `<li>${piece.name} (${piece.kanji}): ${piece.value}</li>`;
    });
    html += "</ul>";
    content.innerHTML = html;
}

// Мини-тест
function showTest() {
    const questions = [
        {
            question: "Какая фигура ходит как золотой генерал?",
            options: ["Конь", "Золотой генерал", "Слон", "Пешка"],
            answer: "Золотой генерал",
            image: "images/gold_general_move.png"
        },
        {
            question: "Как ходит конь?",
            options: ["Прямо на 1 клетку", "По диагонали", "Буквой Г вперёд", "В любую сторону на 1 клетку"],
            answer: "Буквой Г вперёд",
            image: "images/knight_move.png"
        },
        {
            question: "Какая фигура стоит 10 очков?",
            options: ["Ладья", "Слон", "Пешка", "Золотой генерал"],
            answer: "Ладья",
            image: "images/rook_move.png"
        },
        {
            question: "Можно ли поставить пешку в один столбец сразу после сброса?",
            options: ["Да", "Нет"],
            answer: "Нет",
            image: "images/pawn_move.png"
        },
        {
            question: "Какая фигура становится золотым генералом при превращении?",
            options: ["Пешка", "Конь", "Слон", "Король"],
            answer: "Пешка",
            image: "images/pawn_move.png"
        }
    ];

    shuffleArray(questions);

    let currentQuestion = 0;
    let score = 0;

    function showNextQuestion() {
        if (currentQuestion >= questions.length) {
            content.innerHTML = `
                <h2>Тест завершён!</h2>
                <p style="text-align:center; font-size:18px;">Ваш результат: <strong>${score} из ${questions.length}</strong></p>
            `;
            return;
        }

        const q = questions[currentQuestion];
        const options = [...q.options];
        shuffleArray(options);

        let html = `<h2 style="text-align:center;">Мини-тест</h2>`;
        html += `<p style="text-align:center; font-size:18px;"><strong>Вопрос ${currentQuestion + 1}:</strong> ${q.question}</p>`;
        if (q.image) {
            html += `<img src="${q.image}" alt="Ход фигуры" class="test-image">`;
        }
        html += `<div style="text-align:center;">`;
        options.forEach(option => {
            html += `<button class="test-option">${option}</button>`;
        });
        html += `</div>`;
        content.innerHTML = html;

        const buttons = document.querySelectorAll(".test-option");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.textContent === q.answer) {
                    score++;
                    btn.style.backgroundColor = "#4CAF50";
                } else {
                    btn.style.backgroundColor = "#f44336";
                }
                buttons.forEach(b => {
                    if (b.textContent === q.answer) b.style.backgroundColor = "#4CAF50";
                    b.disabled = true;
                });
                setTimeout(() => {
                    currentQuestion++;
                    showNextQuestion();
                }, 1500);
            });
        });
    }

    showNextQuestion();
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Навешиваем обработчики на кнопки
figuresBtn.addEventListener("click", showFigures);
rulesBtn.addEventListener("click", showRules);
costBtn.addEventListener("click", showCost);
testBtn.addEventListener("click", showTest);



