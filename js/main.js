const canvas = document.querySelector('#game'); // Получаем элемент canvas

// Получаем элементы для отображения статистики игры
const mappingFoot = document.querySelector('.header__foot');
const mappingRecord = document.querySelector('.header__record');
const mappingAttemps = document.querySelector('.header__attemps');

// Проверяем поддержку canvas в браузере
if (canvas.getContext) {
    const ctx   = canvas.getContext('2d'); // Получаем 2D контекст рисования


    // Инициализация переменных для настроек игры и состояния

    let mapWidth = canvas.width; // Ширина canvas
    let mapHeight = canvas.height; // Высота canvas
    let defaultSpeed = 5; // Скорость по умолчанию для змеи
    let speed = 5; // Текущая скорость змеи
    let interval = 1000 / speed; // Время между кадрами
    let then = performance.now(); // Время последнего кадра

   // *Функция для изменения скорости змеи

    function speedSnake(speed) {
        interval = 1000 / speed; // Рассчитываем интервал между кадрами на основе скорости
    }

    // Обьект представляющий змею
    let snake = {
        // Координата x головы змеи. Задается как центр карты по ширине.
        x: mapWidth / 2,
        // Координата y головы змеи. Задается как центр карты по высоте.
        y: mapHeight / 2,
        // Ширина головы змеи.
        w: 32,
        // Высота головы змеи.
        h: 32,
        // Длина шага, на которую змея перемещается за один шаг.
        step: 32,
        // Направление движения змеи по оси X. Может быть -1 (влево), 0 (стоять на месте) или 1 (вправо).
        moveX: 0,
        // Направление движения змеи по оси Y. Может быть -1 (вверх), 0 (стоять на месте) или 1 (вниз).
        moveY: 0,
        // Цвет заливки головы змеи.
        fill: '#56cefa',
        // Дополнительный цвет заливки (может использоваться для деталей или анимации).
        secFill: '#2092bb',
        // Количество шагов, которые змея уже прошла.
        foot: 0,
        // Наибольшее количество шагов, которое змея прошла за все время.
        recordFoot: 0,
        // Массив, содержащий координаты и состояние каждого сегмента тела змеи.
        body: [],
        // Текущий размер змеи (количество сегментов тела).
        size: 3,
        // Изначальный размер змеи.
        defaultSize: 3,
        // Количество попыток (попытки изменения направления движения).
        attemps: 0,
        // Количество шагов, которые нужно пройти, чтобы выиграть.
        win: 300,
        // Флаг, указывающий, активно ли управление змеей в данный момент.
        activeKey: true,
    }
    
    
     // Объект, представляющий еду
    let foot = {
        x :         0,
        y :         0,
        fill:       '#fa5656',
    }

    localStor();

    // *Функция сохраняющая рекорд игры в Localstorage
    function localStor() {
        if (localStorage.getItem('record')) {
            snake.recordFoot = localStorage.getItem('record');
            mappingRecord.innerHTML = snake.recordFoot;
            console.log(snake.recordFoot);
        } else {
            localStorage.setItem('record', snake.recordFoot)
        }
    }
    
    // *Функция анимации игры
    function animate(now) {
        requestAnimationFrame(animate);

        let delta = now - then; // время между кадрами
        if (delta > interval) {
            then = now - (delta % interval);
            ctx.clearRect(0, 0, mapWidth, mapHeight);

            drawSnake();
            drawFoot();
        }
    }

    // *Функция отслеживающая нажатия кнопок
    document.addEventListener('keydown', control);
    function control(event) {
        animate(performance.now());
        e = event.keyCode;

        if (e === 37 && snake.moveX !== +snake.step && snake.activeKey === true) { snake.moveX = -snake.step;  snake.moveY = 0; snake.activeKey = false }
        if (e === 39 && snake.moveX !== -snake.step && snake.activeKey === true) { snake.moveX = +snake.step;  snake.moveY = 0; snake.activeKey = false }
        if (e === 38 && snake.moveY !== +snake.step && snake.activeKey === true) { snake.moveY = -snake.step;  snake.moveX = 0; snake.activeKey = false }
        if (e === 40 && snake.moveY !== -snake.step && snake.activeKey === true) { snake.moveY = +snake.step;  snake.moveX = 0; snake.activeKey = false }

        if (e === 32) restartGame();
    }
    
    drawSnake();
    
    // *Функция рисующая змею в canvas элементе DOM
    function drawSnake() {
        ambit(); // не выйти за рамки поля
        
        ctx.fillStyle = snake.fill;
        ctx.fillRect(snake.x += snake.moveX, snake.y += snake.moveY, snake.w, snake.h);
        
        snake.body.unshift( { x: snake.x, y: snake.y } );
        if (snake.body.length > snake.size) { snake.body.splice( -(snake.body.length - snake.size)) } // убераем ненужный хвост

        if (snake.body[0].x === foot.x && snake.body[0].y === foot.y) {
            snake.size++;
            snake.foot++;


            refreshMeppingFoot();   // появление еды
            refreshRecordFoot();    // рекорд
            positionFoot();         // куда именно поставить еду
        }

        snake.activeKey = true;     // разрешаем изменить путь змейки

        snake.body.forEach( function(el, index) {
            crachedIntoTheTail(el, index);

            if (index === snake.win) youWin();

            if (index === 0) {
                ctx.fillStyle = snake.fill
            } else {
                ctx.fillStyle = snake.secFill
            }
            ctx.fillRect(el.x, el.y, snake.step, snake.step)
        })
    }

    // *Функция срабатывает если врезался в хвост
    function crachedIntoTheTail(el, index) {  
        if (snake.body.length > snake.defaultSize && snake.body[0].x === el.x && snake.body[0].y === el.y && index !== 0) restartGame();
    }

    // *Функция срабатывает если победил
    function youWin() {
        alert(`Вы выйграли, так как достигли длины - ${snake.win}см. Неплохо :)`)
        restartGame(true);
    }
    // *Функция проверки выхода за рамки
    function ambit() {
        if (snake.x + snake.moveX >= mapWidth) {
            snake.x = -snake.step;
            restartGame();
        } else if (snake.x + snake.moveX < 0) {
            snake.x = mapWidth;
            restartGame();
        }
    
        if (snake.y + snake.moveY >= mapHeight) {
            snake.y = -snake.step;
            restartGame();
        } else if (snake.y + snake.moveY < 0) {
            snake.y = mapHeight;
            restartGame();
        }
    }
    

    // *Функция удлинение хвоста змеи
    function drawFoot() {
        ctx.fillStyle = foot.fill;
        ctx.fillRect(foot.x, foot.y, snake.w, snake.h);
    }

    // *Функция для размещения еды
    function positionFoot() {
        let x = randomX();
        let y = randomY();
        let overlapping = false;
    
        // Проверяем, не перекрывается ли новое положение еды с какой-либо частью тела змеи
        snake.body.forEach(function(el) {
            if (el.x === x && el.y === y) {
                overlapping = true;
            }
        });
    
        if (overlapping) {
            positionFoot(); // Если есть перекрытие, генерируем новые координаты
        } else {
            foot.x = x;
            foot.y = y;
        }
    }    

    function randomX() { // рандомная позиция на карте кратная 32 (шагу) X
        return Math.floor(Math.random() * (mapWidth / snake.step)) * snake.step;
    }

    function randomY() { // рандомная позиция на карте кратная 32 (шагу) Y
        return Math.floor(Math.random() * (mapHeight / snake.step)) * snake.step;
    }

    // HEADER функции обновления длины змеи, рекорда и попыток

    function refreshMeppingFoot() { // длина змеи
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshRecordFoot() { // рекорд
        if (snake.recordFoot < snake.foot) {
            snake.recordFoot = snake.foot;
            mappingRecord.innerHTML = snake.recordFoot;
            localStorage.setItem('record', snake.recordFoot);
        }
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshAttempsFoot() { // попытки
        if (snake.attemps < 100) snake.attemps++;
        else snake.attemps = 0;
        mappingAttemps.innerHTML = snake.attemps;
    }

    // Функция перезапуска игры
    function restartGame(win) { 
        if (win){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Сбросить позицию змеи
            snake.x = mapWidth / 2;
            snake.y = mapHeight / 2;
            snake.moveX = 0;
            snake.moveY = 0;
            snakeBody = [];
            window.location.reload();
        }
        else{
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Сбросить позицию змеи
            snake.x = mapWidth / 2;
            snake.y = mapHeight / 2;
            snake.moveX = 0;
            snake.moveY = 0;
            snakeBody = [];
            window.location.reload();
            localStorage.setItem('lose', true);
            
        }

        

    }
}


// Localstorage - это место, где веб-сайты могут хранить небольшие кусочки информации на вашем компьютере. 
// Это позволяет сайтам запоминать ваши настройки или другие данные, даже если вы закрываете окно браузера или перезагружаете страницу.
