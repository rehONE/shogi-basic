// =========================
// Глобальные переменные
// =========================
const content = document.getElementById("content");
const sndCorrect = document.getElementById('snd-correct');
const sndWrong = document.getElementById('snd-wrong');

let trainingQueue = [];

// =========================
// Утилиты
// =========================
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function playSound(sound) {
    if (!sound) return;
    try {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    } catch (e) {}
}

function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

function triggerFeedback(isCorrect) {
    if (isCorrect) {
        playSound(sndCorrect);
        vibrate(15);
    } else {
        playSound(sndWrong);
        vibrate([40, 40, 40]);
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
    }, 150);
}

function setButtonsDisabled(disabled) {
    const buttons = content.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = disabled);
}

// =========================
// Инициализация темы
// =========================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = "☀️ Свет";
    }
    
    themeToggle.addEventListener('click', () => {
        vibrate(5);
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? "☀️ Свет" : "🌙 Тема";
    });
}

// =========================
// Кнопка "Играть"
// =========================
function initPlayButton() {
    const playButton = document.getElementById('play-shogi');
    playButton.addEventListener('click', () => {
        vibrate(10);
        window.open('https://rehone.github.io/shogi-board/', '_blank');
    });
}

// =========================
// Раздел: Фигуры
// =========================
function showPieces() {
    let html = "<h2>Фигуры Сёги</h2>";
    
    shogiPieces.forEach(piece => {
        html += `
            <div class="card">
                <h3>${piece.name} (${piece.kanji})</h3>
                <p><strong>Чтение:</strong> ${piece.reading}</p>
                <p><strong>Ход:</strong> ${piece.move}</p>
                <p><strong>Ценность:</strong> ${piece.value}</p>
                <img src="${piece.image}" alt="${piece.name}" class="test-image">
            </div>
        `;
    });
    
    setContent(html);
}

// =========================
// Раздел: Крепости
// =========================
function showCastles() {
    let html = "<h2>Крепости Сёги</h2>";
    
    shogiCastles.forEach(castle => {
        html += `
            <div class="card">
                <h3>${castle.name}</h3>
                <img src="${castle.image}" alt="${castle.name}" class="test-image" style="max-width:100%">
                <p>${castle.description}</p>
            </div>
        `;
    });
    
    setContent(html);
}

// =========================
// Раздел: Принципы
// =========================
function showRules() {
    const html = `
        <div class="card">
            <h2>Основные принципы Сёги</h2>
            <ol style="line-height: 1.8;">
                <li><strong>Берегите Короля</strong> — главная цель защиты.</li>
                <li><strong>Используйте сбросы фигур</strong> — взятые фигуры можно вернуть на доску.</li>
                <li><strong>Превращайте фигуры</strong> — в лагере врага фигуры становятся сильнее.</li>
                <li><strong>Контролируйте центр</strong> — важные клетки дают преимущество.</li>
                <li><strong>Развивайте фигуры</strong> — не оставляйте их в начальной позиции.</li>
                <li><strong>Стройте крепость</strong> — защита короля критична.</li>
            </ol>
        </div>
    `;
    
    setContent(html);
}

// =========================
// Раздел: Стоимость
// =========================
function showCost() {
    let html = `
        <div class="card">
            <h2>Ценность фигур</h2>
            <p style="margin-bottom: 15px;">Относительная стоимость фигур в очках:</p>
            <ul style="line-height: 2;">
    `;
    
    shogiPieces.forEach(piece => {
        html += `<li><strong>${piece.name}</strong>: ${piece.value} ${piece.value === '∞' ? '' : 'очков'}</li>`;
    });
    
    html += `
            </ul>
            <p style="margin-top: 15px; opacity: 0.8; font-size: 0.9em;">
                * Ценность используется для оценки позиции и размена фигур
            </p>
        </div>
    `;
    
    setContent(html);
}

// =========================
// Тренажёр
// =========================
function showTrainer() {
    function nextRound() {
        if (trainingQueue.length === 0) {
            setContent(`
                <div class="card" style="text-align:center; padding:30px;">
                    <h2>🏆 Поздравляем!</h2>
                    <p>Вы успешно изучили все фигуры!</p>
                    <button onclick="trainingQueue = [...shogiPieces]; showTrainer();">Начать заново</button>
                </div>
            `);
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * trainingQueue.length);
        const correctPiece = trainingQueue[randomIndex];
        
        let options = shuffleArray([...shogiPieces]).slice(0, 4);
        if (!options.find(o => o.name === correctPiece.name)) {
            options[0] = correctPiece;
        }
        options = shuffleArray(options);
        
        setContent(`
            <h2 style="text-align:center;">Угадайте фигуру</h2>
            <p style="text-align:center; opacity:0.7;">Осталось: ${trainingQueue.length}</p>
            <img src="${correctPiece.image}" alt="Угадайте фигуру" class="test-image">
            <div class="menu">
                ${options.map(option => 
                    `<button class="trainer-option" data-name="${option.name}">${option.name}</button>`
                ).join('')}
            </div>
        `);
        
        setTimeout(() => {
            document.querySelectorAll('.trainer-option').forEach(button => {
                button.addEventListener('click', function() {
                    const selectedName = this.dataset.name;
                    const isCorrect = selectedName === correctPiece.name;
                    
                    setButtonsDisabled(true);
                    triggerFeedback(isCorrect);
                    
                    if (isCorrect) {
                        this.style.background = "var(--green-main)";
                        trainingQueue.splice(randomIndex, 1);
                        setTimeout(nextRound, 800);
                    } else {
                        this.style.background = "var(--red-main)";
                        setTimeout(() => setButtonsDisabled(false), 1000);
                    }
                });
            });
        }, 200);
    }
    
    nextRound();
}

// =========================
// Тест: Меню выбора сложности
// =========================
function showTestMenu() {
    setContent(`
        <div class="card" style="text-align:center;">
            <h2>Выберите уровень сложности</h2>
            <p style="opacity:0.7; margin-bottom:20px;">Проверьте свои знания</p>
        </div>
        <div class="menu">
            <button class="test-level-btn" data-level="Легкий" style="background: var(--green-main);">😊 Легкий</button>
            <button class="test-level-btn" data-level="Средний" style="background: var(--blue-main);">🤔 Средний</button>
            <button class="test-level-btn" data-level="Сложный" style="background: var(--red-main);">🔥 Сложный</button>
        </div>
    `);
    
    setTimeout(() => {
        document.querySelectorAll('.test-level-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                vibrate(10);
                startTest(this.dataset.level);
            });
        });
    }, 200);
}

// =========================
// Тест: Прохождение
// =========================
function startTest(level) {
    const questions = shuffleArray(
        shogiQuestions.filter(q => q.level === level)
    ).slice(0, 10);
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        if (currentQuestion >= questions.length) {
            showTestResult(score, questions.length);
            return;
        }
        
        const q = questions[currentQuestion];
        const progress = (currentQuestion / questions.length) * 100;
        
        setContent(`
            <div class="progress-bar">
                <div class="progress-bar-inner" style="width:${progress}%"></div>
            </div>
            <p style="text-align:center; font-weight:bold; font-size:1.1em; margin-bottom:20px;">
                Вопрос ${currentQuestion + 1} из ${questions.length}
            </p>
            <p style="text-align:center; font-size:1.05em; margin-bottom:15px;">
                ${q.question}
            </p>
            ${q.image ? `<img src="${q.image}" alt="Вопрос" class="test-image">` : ''}
            <div class="menu">
                ${shuffleArray([...q.options]).map(option => 
                    `<button class="test-option" data-answer="${option}">${option}</button>`
                ).join('')}
            </div>
        `);
        
        setTimeout(() => {
            document.querySelectorAll('.test-option').forEach(button => {
                button.addEventListener('click', function() {
                    const userAnswer = this.dataset.answer;
                    const isCorrect = userAnswer === q.answer;
                    
                    setButtonsDisabled(true);
                    triggerFeedback(isCorrect);
                    
                    if (isCorrect) {
                        this.style.background = "var(--green-main)";
                        score++;
                    } else {
                        this.style.background = "var(--red-main)";
                        document.querySelectorAll('.test-option').forEach(btn => {
                            if (btn.dataset.answer === q.answer) {
                                btn.style.background = "var(--green-main)";
                            }
                        });
                    }
                    
                    currentQuestion++;
                    setTimeout(showQuestion, 1500);
                });
            });
        }, 200);
    }
    
    showQuestion();
}

// =========================
// Тест: Результаты
// =========================
function showTestResult(score, total) {
    const percentage = Math.round((score / total) * 100);
    let emoji = "😢";
    let message = "Продолжайте практиковаться!";
    
    if (percentage >= 90) {
        emoji = "🏆";
        message = "Отличный результат!";
    } else if (percentage >= 70) {
        emoji = "👏";
        message = "Хорошая работа!";
    } else if (percentage >= 50) {
        emoji = "👍";
        message = "Неплохо, но есть куда расти!";
    }
    
    setContent(`
        <div class="card" style="text-align:center; padding:30px;">
            <h2>${emoji} ${message}</h2>
            <p style="font-size:2.5em; font-weight:bold; margin:20px 0;">
                ${score} / ${total}
            </p>
            <p style="font-size:1.3em; margin-bottom:30px;">
                ${percentage}% правильных ответов
            </p>
            <button onclick="showTestMenu();">Вернуться к выбору</button>
        </div>
    `);
}

// =========================
// Роутинг меню
// =========================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPlayButton();
    showPieces();
    
    document.querySelector(".menu").addEventListener("click", e => {
        const action = e.target.dataset.action;
        if (!action) return;
        
        vibrate(5);
        
        switch (action) {
            case "pieces":
                showPieces();
                break;
            case "castles":
                showCastles();
                break;
            case "rules":
                showRules();
                break;
            case "cost":
                showCost();
                break;
            case "trainer":
                trainingQueue = [...shogiPieces];
                showTrainer();
                break;
            case "test":
                showTestMenu();
                break;
        }
    });
});
