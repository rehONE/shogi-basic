const content = document.getElementById("content");
let trainingQueue = [...shogiPieces];

const sndCorrect = document.getElementById('snd-correct');
const sndWrong = document.getElementById('snd-wrong');

function triggerFeedback(isCorrect) {
    if (isCorrect) {
        if(sndCorrect) { sndCorrect.currentTime = 0; sndCorrect.play(); }
        if (navigator.vibrate) navigator.vibrate(15); 
    } else {
        if(sndWrong) { sndWrong.currentTime = 0; sndWrong.play(); }
        if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
    }
}

function setContent(html) {
    content.style.opacity = "0";
    content.style.transform = "translateY(10px)";
    setTimeout(() => {
        content.innerHTML = html;
        content.style.transition = "all 0.3s ease-out";
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
    }, 50);
}

document.querySelector(".menu").addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;
    if (navigator.vibrate) navigator.vibrate(5); 

    switch (action) {
        case "pieces": showPieces(); break;
        case "castles": showCastles(); break;
        case "rules": showRules(); break;
        case "cost": showCost(); break;
        case "trainer": trainingQueue = [...shogiPieces]; showTrainer(); break;
        case "test": showTestMenu(); break;
    }
});

function showPieces() {
    let html = "<h2>Фигуры</h2>";
    shogiPieces.forEach(p => {
        html += `<div class="card"><h3>${p.name} (${p.kanji})</h3><p>${p.move}</p><img src="${p.image}" class="test-image"></div>`;
    });
    setContent(html);
}

function showTrainer() {
    function nextRound() {
        if (trainingQueue.length === 0) {
            setContent(`<div class="card" style="text-align:center;"><h2>🏆 Готово!</h2><button onclick="trainingQueue = [...shogiPieces]; showTrainer();">Заново</button></div>`);
            return;
        }
        const idx = Math.floor(Math.random() * trainingQueue.length);
        const correct = trainingQueue[idx];
        let opts = shuffleArray([...shogiPieces]).slice(0, 4);
        if (!opts.find(o => o.name === correct.name)) opts[0] = correct;
        opts = shuffleArray(opts);

        setContent(`
            <h2 style="text-align:center;">Угадай фигуру</h2>
            <img src="${correct.image}" class="test-image">
            <div class="menu">
                ${opts.map(o => `<button class="test-option" data-n="${o.name}">${o.name}</button>`).join('')}
            </div>
        `);

        document.querySelectorAll(".test-option").forEach(b => {
            b.onclick = () => {
                const isWin = b.dataset.n === correct.name;
                triggerFeedback(isWin);
                if (isWin) {
                    b.style.background = "var(--green-main)";
                    trainingQueue.splice(idx, 1);
                    setTimeout(nextRound, 600);
                } else {
                    b.style.background = "var(--red-main)";
                    if (navigator.vibrate) navigator.vibrate(100);
                }
            };
        });
    }
    nextRound();
}

function showTestMenu() {
    setContent(`
        <h2 style="text-align:center;">Выберите сложность</h2>
        <div class="menu">
            <button onclick="startTest('Легкий')">Легкий</button>
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
            setContent(`<div class="card" style="text-align:center;"><h2>Ваш результат: ${score}/10</h2><button onclick="showTestMenu()">Назад</button></div>`);
            return;
        }
        const q = qs[cur];
        setContent(`
            <div class="progress-bar"><div class="progress-bar-inner" style="width:${(cur/qs.length)*100}%"></div></div>
            <p style="text-align:center; font-weight:bold;">${q.question}</p>
            ${q.image ? `<img src="${q.image}" class="test-image">` : ''}
            <div class="menu">
                ${shuffleArray([...q.options]).map(o => `<button onclick="processTest('${o}','${q.answer}')">${o}</button>`).join('')}
            </div>
        `);
    }
    window.processTest = (user, correct) => {
        const isRight = user === correct;
        triggerFeedback(isRight);
        if(isRight) score++;
        cur++; next();
    };
    next();
}

function showCastles() {
    let html = "<h2>Крепости</h2>";
    shogiCastles.forEach(c => {
        html += `<div class="card"><h3>${c.name}</h3><p>${c.description}</p><img src="${c.image}" class="test-image" style="max-width:100%"></div>`;
    });
    setContent(html);
}

function showRules() {
    setContent(`<div class="card"><h2>Принципы</h2><p>1. Берегите Короля.<br>2. Используйте сбросы фигур.<br>3. Не забывайте про превращение в лагере врага.</p></div>`);
}

function showCost() {
    setContent(`<div class="card"><h2>Ценность</h2><ul>${shogiPieces.map(p=>`<li>${p.name}: ${p.value}</li>`).join('')}</ul></div>`);
}

function shuffleArray(a) { return a.sort(() => Math.random() - 0.5); }