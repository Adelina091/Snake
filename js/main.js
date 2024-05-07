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


}