const canvas = document.querySelector('#game'); // Получаем элемент canvas

// Получаем элементы для отображения статистики игры
const mappingFoot = document.querySelector('.header__foot'); // Длина
const mappingRecord = document.querySelector('.header__record'); // Рекорд
const mappingAttemps = document.querySelector('.header__attemps'); // Попытки

if (canvas.getContext) { // Проверяем поддержку canvas в браузере
    const ctx   = canvas.getContext('2d'); // Получаем 2D контекст рисования

    // Инициализация переменных для настроек игры и состояния

    let mapWidth = canvas.width; // Ширина canvas
    let mapHeight = canvas.height; // Высота canvas
    let defaultSpeed = 5; // Скорость по умолчанию для змеи
    let speed = 5; // Текущая скорость змеи
    let interval = 1000 / speed; // Время между кадрами
    let then = performance.now(); // Время последнего кадра

       // *Функция для изменения скорости змеи

       function speedSnake(speed) { // Передаем в функцию переменную speed
        interval = 1000 / speed; // Рассчитываем интервал между кадрами на основе скорости

}
//*Параметры змеи
let snake = {
    x:          mapWidth / 2,    // Позиция по оси X змеи
    y:          mapHeight / 2,   // Позиция по оси Y змеи
    w:          32,              // Ширина змеи
    h:          32,              // Высота змеи
    step:       32,              // Шаг движения змеи
    moveX:      0,               // Смещение по оси X
    moveY:      0,               // Смещение по оси Y
    fill:       '#56cefa',       // Цвет змеи
    secFill:    '#2092bb',       // Вторичный цвет змеи
    foot:       0,               // Длина змеи
    recordFoot: 0,               // Рекордная длина змеи
    body:       [],              // Тело змеи (координаты сегментов)
    size:       3,               // Текущий размер змеи
    defaultSize:3,               // Размер змеи по умолчанию
    attemps:    0,               // Количество попыток (не используется в коде)
    win:        300,             // Длина для победы
    activeKey:  true,            // Флаг активности управления (true - активно, false - не активно)
}

  // Объект, представляющий еду
  let foot = {
    x :         0, // позиция по x
    y :         0, // позиция по y
    fill:       '#fa5656', // цвет еды
}

localStor(); // вызов функции localStor()

// *Функция сохраняющая рекорд игры в Localstorage
function localStor() {
    if (localStorage.getItem('record')) { // проверка есть ли рекорд
        snake.recordFoot = localStorage.getItem('record'); // запись рекорда в переменную
        mappingRecord.innerHTML = snake.recordFoot; // изменение надписи
    } else { // иначе
        localStorage.setItem('record', snake.recordFoot) //  установка рекорда по умолчанию
    }
}

// *Функция анимации игры
function animate(now) {
    requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации
    
    let delta = now - then; // время между кадрами
    if (delta > interval) { // Если прошло достаточно времени для следующего кадра
         then = now - (delta % interval); // Обновляем время последнего кадра
    
        // Очищаем canvas перед отрисовкой нового кадра
        ctx.clearRect(0, 0, mapWidth, mapHeight);
    
        // Отрисовываем змею
        drawSnake();
    
        // Отрисовываем еду
         drawFoot();
        }
    }

// *Функция отслеживающая нажатия кнопок
 document.addEventListener('keydown', control); // Добавляем обработчик события нажатия клавиши

 function control(event) { // Функция управления
    animate(performance.now()); // Запускаем анимацию при каждом событии управления
    e = event.keyCode; // Получаем код нажатой клавиши

    // Обработка нажатий клавиш для управления змеей
    if (e === 37 && snake.moveX !== +snake.step && snake.activeKey === true) { 
        snake.moveX = -snake.step;  // Движение влево по оси X
        snake.moveY = 0; // Сброс движения по оси Y
        snake.activeKey = false; // Отключаем активность клавиш
    }
    if (e === 39 && snake.moveX !== -snake.step && snake.activeKey === true) { 
        snake.moveX = +snake.step;  // Движение вправо по оси X
        snake.moveY = 0; // Сброс движения по оси Y
        snake.activeKey = false; // Отключаем активность клавиш
    }
    if (e === 38 && snake.moveY !== +snake.step && snake.activeKey === true) { 
        snake.moveY = -snake.step;  // Движение вверх по оси Y
        snake.moveX = 0; // Сброс движения по оси X
        snake.activeKey = false; // Отключаем активность клавиш
    }
    if (e === 40 && snake.moveY !== -snake.step && snake.activeKey === true) { 
        snake.moveY = +snake.step;  // Движение вниз по оси Y
        snake.moveX = 0; // Сброс движения по оси X
        snake.activeKey = false; // Отключаем активность клавиш
    }

    if (e === 32) restartGame(); // Если нажата клавиша "Пробел", перезапускаем игру
}

drawSnake(); // Вызываем функцию отрисовки змеи
    
    
// *Функция рисующая змею в canvas элементе DOM
function drawSnake() {
    ambit(); // Проверяем, не выходит ли змея за рамки поля

    ctx.fillStyle = snake.fill; // Задаем цвет для заполнения змеи
    ctx.fillRect(snake.x += snake.moveX, snake.y += snake.moveY, snake.w, snake.h); // Рисуем змею и смещаем ее позицию

    snake.body.unshift( { x: snake.x, y: snake.y } ); // Добавляем новую часть змеи в начало массива тела
    if (snake.body.length > snake.size) { 
        snake.body.splice( -(snake.body.length - snake.size)) 
    } // Убираем ненужный хвост змеи

    if (snake.body[0].x === foot.x && snake.body[0].y === foot.y) { // Если змея съела еду
        snake.size++; // Увеличиваем размер змеи
        snake.foot++; // Увеличиваем количество съеденной еды

        refreshMeppingFoot();   // Обновляем отображение съеденной еды
        refreshRecordFoot();    // Обновляем рекорд
        positionFoot();         // Перемещаем еду на новое место
    }

}

snake.activeKey = true; // Разрешаем изменять направление движения змеи
    
snake.body.forEach( function(el, index) { // Перебираем элементы тела змеи
    crachedIntoTheTail(el, index); // Проверяем, не врезалась ли змея в свой хвост

    if (index === snake.win) youWin(); // Проверяем, достигла ли змея выигрышной длины

    if (index === 0) {
        ctx.fillStyle = snake.fill; // Задаем цвет для заполнения головы змеи
    } else {
        ctx.fillStyle = snake.secFill; // Задаем цвет для заполнения остальных частей змеи
    }
    ctx.fillRect(el.x, el.y, snake.step, snake.step); // Рисуем каждый сегмент тела змеи
});

    // *Функция срабатывает если врезался в хвост
    function crachedIntoTheTail(el, index) {  
        // Функция проверяет, врезалась ли змея в свой хвост
        if (snake.body.length > snake.defaultSize && snake.body[0].x === el.x && snake.body[0].y === el.y && index !== 0) {
            restartGame(); // Перезапускаем игру, если змея врезалась в свой хвост
        }
    }

        // Функция, срабатывающая при победе
        function youWin() {
            alert(`Вы выиграли, так как достигли длины - ${snake.win} см. Неплохо :)`); // Выводим сообщение о победе
            restartGame(true); // Перезапускаем игру с флагом победы
        }
        
        // Функция проверки выхода за рамки игрового поля
        function ambit() {
            if (snake.x + snake.moveX >= mapWidth) {
                snake.x = -snake.step; // Смещаем змею на противоположную сторону по оси X
                restartGame(); // Перезапускаем игру
            } else if (snake.x + snake.moveX < 0) {
                snake.x = mapWidth; // Смещаем змею на противоположную сторону по оси X
                restartGame(); // Перезапускаем игру
            }
        
            if (snake.y + snake.moveY >= mapHeight) {
                snake.y = -snake.step; // Смещаем змею на противоположную сторону по оси Y
                restartGame(); // Перезапускаем игру
            } else if (snake.y + snake.moveY < 0) {
                snake.y = mapHeight; // Смещаем змею на противоположную сторону по оси Y
                restartGame(); // Перезапускаем игру
            }
        }
        
        // Функция для отрисовки еды (удлинение хвоста змеи)
        function drawFoot() {
            ctx.fillStyle = foot.fill; // Задаем цвет для отрисовки еды
            ctx.fillRect(foot.x, foot.y, snake.w, snake.h); // Рисуем еду
        }
    
        function control(event) { // Функция управления
            animate(performance.now()); // Запускаем анимацию при каждом событии управления
            e = event.keyCode; // Получаем код нажатой клавиши
        
            // Обработка нажатий клавиш для управления змеей
            if (e === 37 && snake.moveX !== +snake.step && snake.activeKey === true) { 
                snake.moveX = -snake.step;  // Движение влево по оси X
                snake.moveY = 0; // Сброс движения по оси Y
                snake.activeKey = false; // Отключаем активность клавиш
            }
            if (e === 39 && snake.moveX !== -snake.step && snake.activeKey === true) { 
                snake.moveX = +snake.step;  // Движение вправо по оси X
                snake.moveY = 0; // Сброс движения по оси Y
                snake.activeKey = false; // Отключаем активность клавиш
            }
            if (e === 38 && snake.moveY !== +snake.step && snake.activeKey === true) { 
                snake.moveY = -snake.step;  // Движение вверх по оси Y
                snake.moveX = 0; // Сброс движения по оси X
                snake.activeKey = false; // Отключаем активность клавиш
            }
            if (e === 40 && snake.moveY !== -snake.step && snake.activeKey === true) { 
                snake.moveY = +snake.step;  // Движение вниз по оси Y
                snake.moveX = 0; // Сброс движения по оси X
                snake.activeKey = false; // Отключаем активность клавиш
            }
        
            if (e === 32) restartGame(); // Если нажата клавиша "Пробел", перезапускаем игру
        }
        
        drawSnake(); // Вызываем функцию отрисовки змеи
        
        
        // *Функция рисующая змею в canvas элементе DOM
        function drawSnake() {
            ambit(); // Проверяем, не выходит ли змея за рамки поля
        
            ctx.fillStyle = snake.fill; // Задаем цвет для заполнения змеи
            ctx.fillRect(snake.x += snake.moveX, snake.y += snake.moveY, snake.w, snake.h); // Рисуем змею и смещаем ее позицию
        
            snake.body.unshift( { x: snake.x, y: snake.y } ); // Добавляем новую часть змеи в начало массива тела
            if (snake.body.length > snake.size) { 
                snake.body.splice( -(snake.body.length - snake.size)) 
            } // Убираем ненужный хвост змеи
        
            if (snake.body[0].x === foot.x && snake.body[0].y === foot.y) { // Если змея съела еду
                snake.size++; // Увеличиваем размер змеи
                snake.foot++; // Увеличиваем количество съеденной еды
        
                refreshMeppingFoot();   // Обновляем отображение съеденной еды
                refreshRecordFoot();    // Обновляем рекорд
                positionFoot();         // Перемещаем еду на новое место
            }
        
            snake.activeKey = true; // Разрешаем изменять направление движения змеи
        
            snake.body.forEach( function(el, index) { // Перебираем элементы тела змеи
                crachedIntoTheTail(el, index); // Проверяем, не врезалась ли змея в свой хвост
        
                if (index === snake.win) youWin(); // Проверяем, достигла ли змея выигрышной длины
        
                if (index === 0) {
                    ctx.fillStyle = snake.fill; // Задаем цвет для заполнения головы змеи
                } else {
                    ctx.fillStyle = snake.secFill; // Задаем цвет для заполнения остальных частей змеи
                }
                ctx.fillRect(el.x, el.y, snake.step, snake.step); // Рисуем каждый сегмент тела змеи
            });
        }
        
    
        // *Функция срабатывает если врезался в хвост
        function crachedIntoTheTail(el, index) {  
            // Функция проверяет, врезалась ли змея в свой хвост
            if (snake.body.length > snake.defaultSize && snake.body[0].x === el.x && snake.body[0].y === el.y && index !== 0) {
                restartGame(); // Перезапускаем игру, если змея врезалась в свой хвост
            }
        }
        
        // Функция, срабатывающая при победе
        function youWin() {
            alert(`Вы выиграли, так как достигли длины - ${snake.win} см. Неплохо :)`); // Выводим сообщение о победе
            restartGame(true); // Перезапускаем игру с флагом победы
        }
        
        // Функция проверки выхода за рамки игрового поля
        function ambit() {
            if (snake.x + snake.moveX >= mapWidth) {
                snake.x = -snake.step; // Смещаем змею на противоположную сторону по оси X
                restartGame(); // Перезапускаем игру
            } else if (snake.x + snake.moveX < 0) {
                snake.x = mapWidth; // Смещаем змею на противоположную сторону по оси X
                restartGame(); // Перезапускаем игру
            }
        
            if (snake.y + snake.moveY >= mapHeight) {
                snake.y = -snake.step; // Смещаем змею на противоположную сторону по оси Y
                restartGame(); // Перезапускаем игру
            } else if (snake.y + snake.moveY < 0) {
                snake.y = mapHeight; // Смещаем змею на противоположную сторону по оси Y
                restartGame(); // Перезапускаем игру
            }
        }
        
        // Функция для отрисовки еды (удлинение хвоста змеи)
        function drawFoot() {
            ctx.fillStyle = foot.fill; // Задаем цвет для отрисовки еды
            ctx.fillRect(foot.x, foot.y, snake.w, snake.h); // Рисуем еду
        }
        
    
        // *Функция для размещения еды
        function positionFoot() {
            let x = randomX(); // Генерируем случайную позицию по оси X для еды
            let y = randomY(); // Генерируем случайную позицию по оси Y для еды
            let overlapping = false; // Флаг для проверки перекрытия с телом змеи
        
            // Проверяем, не перекрывается ли новая позиция еды с какой-либо частью тела змеи
            snake.body.forEach(function(el) {
                if (el.x === x && el.y === y) { // Если координаты совпадают
                    overlapping = true; // Устанавливаем флаг перекрытия в true
                }
            });
        
            if (overlapping) {
                positionFoot(); // Если есть перекрытие, генерируем новые координаты для еды
            } else {
                foot.x = x; // Устанавливаем новую позицию по оси X для еды
                foot.y = y; // Устанавливаем новую позицию по оси Y для еды
            }
        }
        
        function randomX() { // Генерируем случайную позицию на карте, кратную 32 (шагу), по оси X
            return Math.floor(Math.random() * (mapWidth / snake.step)) * snake.step;
        }
        
        function randomY() { // Генерируем случайную позицию на карте, кратную 32 (шагу), по оси Y
            return Math.floor(Math.random() * (mapHeight / snake.step)) * snake.step;
        }
        
        // Функция обновления отображения длины змеи в заголовке
        function refreshMeppingFoot() {
            mappingFoot.innerHTML = snake.foot; // Обновляем текст в заголовке с длиной змеи
        }
        
        function refreshRecordFoot() { // Обновляет рекорд игры и отображает его на странице
            if (snake.recordFoot < snake.foot) { // Если текущий результат игры больше рекорда
                snake.recordFoot = snake.foot; // Обновляем рекорд
                mappingRecord.innerHTML = snake.recordFoot; // Обновляем отображение рекорда на странице
                localStorage.setItem('record', snake.recordFoot); // Сохраняем рекорд в локальном хранилище
            }
            mappingFoot.innerHTML = snake.foot; // Обновляем отображение длины змеи на странице
        }
        
        function refreshAttempsFoot() { // Обновляет количество попыток и отображает его на странице
            if (snake.attemps < 100) snake.attemps++; // Увеличиваем количество попыток, если оно меньше 100
            else snake.attemps = 0; // Если количество попыток достигло 100, сбрасываем его на 0
            mappingAttemps.innerHTML = snake.attemps; // Обновляем отображение количества попыток на странице
        }
        
        // Функция перезапуска игры
        function restartGame(win) { // Перезапускает игру
            if (win){ // Если игрок победил
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
        
                // Сбросить позицию змеи
                snake.x = mapWidth / 2;
                snake.y = mapHeight / 2;
                snake.moveX = 0;
                snake.moveY = 0;
                snakeBody = []; // Очищаем массив тела змеи
                window.location.reload(); // Перезагружаем страницу
            }
            else{ // Если игрок проиграл
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
        
                // Сбросить позицию змеи
                snake.x = mapWidth / 2;
                snake.y = mapHeight / 2;
                snake.moveX = 0;
                snake.moveY = 0;
                snakeBody = []; // Очищаем массив тела змеи
                window.location.reload(); // Перезагружаем страницу
                localStorage.setItem('lose', true); // Сохраняем информацию о проигрыше в локальном хранилище
            }
        }
        
    }
    // Localstorage - это место, где веб-сайты могут хранить небольшие кусочки информации на вашем компьютере. 
    // Это позволяет сайтам запоминать ваши настройки или другие данные, даже если вы закрываете окно браузера или перезагружаете страницу.

