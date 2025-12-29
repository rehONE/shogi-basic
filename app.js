const content = document.getElementById("content");

// =========================
// Функция плавной смены контента
// =========================
function setContent(html) {
    content.classList.remove("fade");
    void content.offsetWidth;
    content.classList.add("fade");
    content.innerHTML = html;
}

// =====================================
//  ФУНКЦИИ ДЛЯ КНОПОК МЕНЮ
// =====================================

// Фигуры
function showPieces() {
    let html = "<h2>Фигуры сёги</h2>";
    shogiPieces.forEach(piece => {
        html += `
            <div class="piece">
                <h3>${piece.name} (${piece.kanji})</h3>
                <p><strong>Чтение:</strong> ${piece.reading}</p>
                <p><strong>Ход:</strong> ${piece.move}</p>
                <img src="${piece.image}" alt="${piece.name}">
                <p><strong>Стоимость:</strong> ${piece.value}</p>
            </div>
        `;
    });
    setContent(html);
}

// Крепости
function showCastles() {
    let html = "<h2>Крепости</h2>";
    shogiCastles.forEach(castle => {
        html += `
            <div class="piece">
                <h3>${castle.name}</h3>
                <p>${castle.description}</p>
                <img src="${castle.image}" alt="${castle.name}">
            </div>
        `;
    });
    setContent(html);
}

// Правила
function showRules() {
    setContent(`
        <div class="rules">
            <h2>Правила игры</h2>
            <ul>
                <li>Каждый игрок имеет 20 фигур: король, ладья, слон, два золотых генерала, два серебряных генерала, два коня, два копья, девять пешек.</li>
                <li>Взятие – ход на поле, занятое фигурой противника. Взятая фигура идёт в ваш резерв и может быть сброшена на доску в любой момент.</li>
                <li>Цель: поставить мат королю противника.</li>
                <li>Игра разделена на три фазы: дебют, миттельшпиль и эндшпиль.</li>
                <li>В дебюте расставляйте фигуры так, чтобы они были полезны и защищали друг друга.</li>
                <li>В миттельшпиле развивайте позиции и берите фигуры противника.</li>
                <li>В эндшпиле оценивайте, сколько ходов потребуется для мата и атакуйте быстрее.</li>
                <li>Оценка позиции включает четыре аспекта: материал, очередность ходов, крепость, эффективность фигур.</li>
                <li>Материал: Король > Ладья > Слон > Золотой генерал > Серебряный генерал > Конь > Копьё > Пешка.</li>
                <li>Превращенные фигуры: токин (превращенная пешка) ценнее золота.</li>
            </ul>
        </div>
    `);
}


// =========================
// Стоимость
// =========================
function showCost() {
    let html = "<h2>Стоимость фигур</h2><ul>";
    shogiPieces.forEach(piece => {
        html += `<li>${piece.name} (${piece.kanji}): ${piece.value}</li>`;
    });
    html += "</ul>";
    setContent(html);
}

// =========================
// Мини-тренажёр
// =========================
function showTrainer() {
    const pieces = [...shogiPieces];
    let correct;

    function nextRound() {
        correct = pieces[Math.floor(Math.random() * pieces.length)];
        let options = shuffleArray([...pieces]).slice(0, 4);
        if (!options.includes(correct)) options[0] = correct;
        options = shuffleArray(options);

        let html = `<h2 style="text-align:center;">🧩 Угадай фигуру</h2>`;
        html += `<img src="${correct.image}" class="test-image">`;
        html += `<div style="text-align:center; margin-top:15px;">`;
        options.forEach(p => { html += `<button class="test-option">${p.name}</button>`; });
        html += `</div>`;
        setContent(html);

        document.querySelectorAll(".test-option").forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll(".test-option").forEach(b => {
                    b.disabled = true;
                    if (b.textContent === correct.name) b.style.backgroundColor = "#4CAF50";
                    else if (b.textContent === btn.textContent) b.style.backgroundColor = "#f44336";
                });
                setTimeout(nextRound, 1200);
            };
        });
    }

    nextRound();
}

// =========================
// Тест
// =========================
function showTestMenu() {
    setContent(`
        <h2 style="text-align:center;">📝 Выбор сложности</h2>
        <div style="text-align:center;">
            <button onclick="startTest('Легкий')" class="test-option">Лёгкий</button>
            <button onclick="startTest('Средний')" class="test-option">Средний</button>
            <button onclick="startTest('Сложный')" class="test-option">Сложный</button>
        </div>
    `);
}

function startTest(level) {
    let questions = shuffleArray(shogiQuestions.filter(q => q.level===level));
    let count = (level==="Легкий" || level==="Средний") ? 10 : 10;
    questions = questions.slice(0, count);
    let current = 0, score = 0;

    function nextQ() {
        if(current >= questions.length){
            setContent(`<h2>Тест завершён!</h2><p style="text-align:center;">Результат: <strong>${score} из ${questions.length}</strong></p>
            <div style="text-align:center; margin-top:15px;"><button onclick="showTestMenu()">Выбрать сложность снова</button></div>`);
            return;
        }

        const q = questions[current];
        let html = `<h2 style="text-align:center;">Вопрос ${current+1}</h2><p style="text-align:center;">${q.question}</p>`;
        if(level==="Легкий" && q.image) html += `<img src="${q.image}" class="test-image">`;
        html += `<div style="text-align:center; margin-top:10px;">`;
        shuffleArray(q.options).forEach(opt => { html += `<button class="test-option">${opt}</button>`; });
        html += `</div>`;
        setContent(html);

        document.querySelectorAll(".test-option").forEach(btn => {
            btn.onclick = () => {
                if(btn.textContent===q.answer) score++;
                document.querySelectorAll(".test-option").forEach(b=>{
                    b.disabled=true;
                    if(b.textContent===q.answer) b.style.backgroundColor="#4CAF50";
                    else if(b.textContent===btn.textContent) b.style.backgroundColor="#f44336";
                });
                setTimeout(()=>{current++; nextQ();},1200);
            };
        });
    }

    nextQ();
}

// =========================
// Вспомогательные
// =========================
function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}
