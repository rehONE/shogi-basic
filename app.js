const content = document.getElementById("content");
let trainingQueue = [...shogiPieces];

function setContent(html) {
    // Удаляем класс, чтобы "сбросить" анимацию
    content.classList.remove("fade");
    // Маленький трюк для принудительного обновления DOM
    void content.offsetWidth; 
    // Добавляем класс снова
    content.classList.add("fade");
    content.innerHTML = html;
}

document.querySelector(".menu").addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;

    switch (action) {
        case "pieces": showPieces(); break;
        case "castles": showCastles(); break;
        case "rules": showRules(); break;
        case "cost": showCost(); break;
        case "trainer": 
            trainingQueue = [...shogiPieces]; 
            showTrainer(); 
            break;
        case "test": showTestMenu(); break;
    }
});

function showRules() {
    setContent(`
        <h2 style="text-align:center;">Основы Сёги</h2>
        <div class="rules-grid">
            <div class="rule-item">
                <h4>Король и мат</h4>
                <p>Ваша цель — поймать вражеского короля. Если королю некуда бежать — это победа.</p>
            </div>
            <div class="rule-item">
                <h4>Сброс фигур</h4>
                <p>Фигуры, которые вы съели, можно поставить обратно на доску за вас. Это ваш ход.</p>
            </div>
            <div class="rule-item">
                <h4>Превращение</h4>
                <p>Дойдя до территории врага, фигура переворачивается и становится намного сильнее.</p>
            </div>
            <div class="rule-item">
                <h4>Две пешки</h4>
                <p>Главный запрет: нельзя ставить две свои пешки на одну вертикальную линию.</p>
            </div>
        </div>
    `);
}

function showTrainer() {
    function nextRound() {
        if (trainingQueue.length === 0) {
            setContent(`
                <div class="card" style="text-align:center;">
                    <h2>🏆 Тренировка окончена!</h2>
                    <p>Ты отлично запомнил все фигуры.</p>
                    <button onclick="trainingQueue = [...shogiPieces]; showTrainer();">Начать сначала</button>
                </div>
            `);
            return;
        }

        const idx = Math.floor(Math.random() * trainingQueue.length);
        const correct = trainingQueue[idx];
        let opts = shuffleArray([...shogiPieces]).slice(0, 4);
        if (!opts.find(o => o.name === correct.name)) opts[0] = correct;
        opts = shuffleArray(opts);

        setContent(`
            <h2 style="text-align:center;">Угадай фигуру</h2>
            <p style="text-align:center; opacity:0.6;">Осталось: ${trainingQueue.length}</p>
            <img src="${correct.image}" class="test-image">
            <div class="menu">
                ${opts.map(o => `<button class="test-option" data-n="${o.name}">${o.name}</button>`).join('')}
            </div>
        `);

        document.querySelectorAll(".test-option").forEach(b => {
            b.onclick = () => {
                const isWin = b.dataset.n === correct.name;
                document.querySelectorAll(".test-option").forEach(btn => btn.disabled = true);
                
                if (isWin) {
                    b.style.background = "var(--green-main)";
                    b.style.boxShadow = "0 0 15px var(--green-main)";
                    trainingQueue.splice(idx, 1);
                } else {
                    b.style.background = "var(--red-main)";
                    trainingQueue.push(correct);
                }
                setTimeout(nextRound, 1000);
            };
        });
    }
    nextRound();
}

function showPieces() {
    let html = "<h2>Фигуры</h2>";
    shogiPieces.forEach(p => {
        html += `<div class="card"><h3>${p.name}</h3><p>${p.move}</p><img src="${p.image}" class="test-image"></div>`;
    });
    setContent(html);
}

function showCastles() {
    let html = "<h2>Крепости</h2>";
    shogiCastles.forEach(c => {
        html += `<div class="card"><h3>${c.name}</h3><p>${c.description}</p><img src="${c.image}" class="test-image" style="max-width:100%"></div>`;
    });
    setContent(html);
}

function showCost() {
    setContent(`<div class="card"><h2>Сила фигур</h2><ul>${shogiPieces.map(p=>`<li><strong>${p.name}:</strong> ${p.value}</li>`).join('')}</ul></div>`);
}

function showTestMenu() {
    setContent(`
        <h2 style="text-align:center;">Начать тест</h2>
        <div class="menu">
            <button onclick="startTest('Легкий')">Лёгкий</button>
            <button onclick="startTest('Средний')">Средний</button>
            <button onclick="startTest('Сложный')">Сложный</button>
        </div>
    `);
}

function startTest(level) {
    let qs = shuffleArray(shogiQuestions.filter(q => q.level === level)).slice(0, 10);
    let cur = 0, score = 0;
    function next() {
        if (cur >= qs.length) {
            setContent(`<div class="card" style="text-align:center;"><h2>Результат: ${score}/10</h2><button onclick="showTestMenu()">Назад</button></div>`);
            return;
        }
        const q = qs[cur];
        const prg = (cur / qs.length) * 100;
        setContent(`
            <div class="progress-bar"><div class="progress-bar-inner" style="width:${prg}%"></div></div>
            <p style="text-align:center; font-weight:bold;">${q.question}</p>
            ${q.image ? `<img src="${q.image}" class="test-image">` : ''}
            <div class="menu">
                ${shuffleArray([...q.options]).map(o => `<button class="test-option" onclick="processTest('${o}','${q.answer}')">${o}</button>`).join('')}
            </div>
        `);
    }
    window.processTest = (user, correct) => {
        if(user === correct) score++;
        cur++; next();
    };
    next();
}

function shuffleArray(a) { return a.sort(() => Math.random() - 0.5); }