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
}