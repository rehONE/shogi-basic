const content = document.getElementById("content");

/* ===== Плавная смена контента ===== */
function setContent(html) {
    content.classList.remove("fade");
    void content.offsetWidth;
    content.classList.add("fade");
    content.innerHTML = html;
}

/* ===== Меню ===== */
document.querySelector(".menu").addEventListener("click", e => {
    if (!e.target.dataset.action) return;

    const action = e.target.dataset.action;

    switch (action) {
        case "pieces": showPieces(); break;
        case "castles": showCastles(); break;
        case "rules": showRules(); break;
        case "cost": showCost(); break;
        case "trainer": showTrainer(); break;
        case "test": showTestMenu(); break;
    }
});

/* ===== Фигуры ===== */
function showPieces() {
    let html = "<h2>Фигуры сёги</h2>";
    shogiPieces.forEach(p => {
        html += `
        <div class="card">
            <h3>${p.name} (${p.kanji})</h3>
            <p><strong>Чтение:</strong> ${p.reading}</p>
            <p><strong>Ход:</strong> ${p.move}</p>
            <img src="${p.image}">
            <p><strong>Стоимость:</strong> ${p.value}</p>
        </div>`;
    });
    setContent(html);
}

/* ===== Крепости ===== */
function showCastles() {
    let html = "<h2>Крепости</h2>";
    shogiCastles.forEach(c => {
        html += `
        <div class="card">
            <h3>${c.name}</h3>
            <p>${c.description}</p>
            <img src="${c.image}">
        </div>`;
    });
    setContent(html);
}

/* ===== Правила ===== */
function showRules() {
    setContent(`
    <div class="rules">
        <h2>Правила игры</h2>
        <ul>
            <li>Взятые фигуры можно сбрасывать обратно на доску.</li>
            <li>Цель игры — поставить мат королю.</li>
            <li>Фигуры могут превращаться при входе в зону противника.</li>
            <li>Материал и крепость решают исход партии.</li>
        </ul>
    </div>`);
}

/* ===== Стоимость ===== */
function showCost() {
    let html = "<h2>Стоимость фигур</h2><ul>";
    shogiPieces.forEach(p => html += `<li>${p.name}: ${p.value}</li>`);
    html += "</ul>";
    setContent(html);
}

/* ===== Тренажёр ===== */
function showTrainer() {
    const pieces = [...shogiPieces];
    let correctPiece;

    function nextRound() {
        correctPiece = pieces[Math.floor(Math.random() * pieces.length)];
        let options = shuffleArray([...pieces]).slice(0, 4);
        if (!options.includes(correctPiece)) options[0] = correctPiece;
        options = shuffleArray(options);

        let html = `<h2 style="text-align:center;">🧩 Угадай фигуру</h2>`;
        html += `<img src="${correctPiece.image}" class="test-image">`;
        html += `<div class="menu" style="justify-content:center;">`;
        options.forEach(p => html += `<button class="test-option">${p.name}</button>`);
        html += `</div>`;
        setContent(html);

        document.querySelectorAll(".test-option").forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll(".test-option").forEach(b => {
                    b.disabled = true;
                    if (b.textContent === correctPiece.name) b.classList.add("correct");
                    else if (b.textContent === btn.textContent) b.classList.add("wrong");
                });
                setTimeout(nextRound, 1200);
            };
        });
    }

    nextRound();
}

/* ===== Тест ===== */
function showTestMenu() {
    setContent(`
        <h2 style="text-align:center;">📝 Выбор сложности</h2>
        <div class="menu" style="justify-content:center;">
            <button class="test-option" data-level="Легкий">Лёгкий</button>
            <button class="test-option" data-level="Средний">Средний</button>
            <button class="test-option" data-level="Сложный">Сложный</button>
        </div>
    `);

    document.querySelectorAll(".test-option").forEach(btn => {
        btn.onclick = () => startTest(btn.dataset.level);
    });
}

function startTest(level) {
    let questions = shuffleArray(shogiQuestions.filter(q => q.level===level)).slice(0,10);
    let current = 0, score = 0;

    function nextQ() {
        if(current >= questions.length){
            setContent(`<h2 style="text-align:center;">Тест завершён!</h2>
            <p style="text-align:center;">Результат: <strong>${score} / ${questions.length}</strong></p>
            <div class="menu" style="justify-content:center;"><button data-action="test">Выбрать снова</button></div>`);
            document.querySelector('button[data-action="test"]').onclick = showTestMenu;
            return;
        }

        const q = questions[current];
        let html = `<h2 style="text-align:center;">Вопрос ${current+1}</h2>`;
        html += `<p style="text-align:center;">${q.question}</p>`;
        if(level==="Легкий" && q.image) html += `<img src="${q.image}" class="test-image">`;

        html += `<div class="menu" style="justify-content:center;">`;
        shuffleArray(q.options).forEach(opt => html += `<button class="test-option">${opt}</button>`);
        html += `</div>`;

        setContent(html);

        document.querySelectorAll(".test-option").forEach(btn => {
            btn.onclick = () => {
                if(btn.textContent===q.answer) score++;
                document.querySelectorAll(".test-option").forEach(b=>{
                    b.disabled=true;
                    if(b.textContent===q.answer) b.classList.add("correct");
                    else if(b.textContent===btn.textContent) b.classList.add("wrong");
                });
                setTimeout(()=>{current++; nextQ();},1200);
            };
        });
    }

    nextQ();
}

/* ===== Вспомогательные ===== */
function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}

