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
}