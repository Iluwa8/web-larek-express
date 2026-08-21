### Web-ларёк — Backend API

Бэкенд для сервиса «Web-ларёк» — учебного проекта Яндекс.Практикум (спринт 13).
Реализует REST API для работы с товарами и оформления заказов.
Описание

### API позволяет:
- получать список товаров из базы данных MongoDB;
- создавать новые товары с валидацией данных;
- оформлять заказы с проверкой существования товаров, их доступности для продажи и корректности итоговой суммы.


### Стек технологий:

- Node.js — среда выполнения
- TypeScript — типизация (strict: true)
- Express — веб-фреймворк
- MongoDB + Mongoose — база данных и ODM
- Celebrate + Joi — валидация входящих запросов
- Winston + express-winston — логирование запросов и ошибок
- CORS — кросс-доменные запросы


### Структура проекта:

backend/
├── src/
│   ├── app.ts              # Точка входа, подключение к БД, middleware
│   ├── controllers/        # Бизнес-логика
│   │   ├── order.ts        # Контроллер заказов
│   │   └── products.ts     # Контроллер товаров
│   ├── errors/             # Кастомные классы ошибок
│   │   ├── api-error.ts
│   │   ├── bad-request-error.ts
│   │   ├── conflict-error.ts
│   │   ├── internal-server-error.ts
│   │   └── not-found-error.ts
│   ├── middlewares/        # Middleware
│   │   ├── error-handler.ts    # Централизованный обработчик ошибок
│   │   ├── logger.ts           # Логгеры winston
│   │   └── validations.ts      # Валидация celebrate/joi
│   ├── models/             # Mongoose-схемы
│   │   └── product.ts
│   ├── routes/             # Роуты
│   │   ├── order.ts
│   │   └── product.ts
│   └── public/             # Статические файлы (изображения)
│       └── images/
├── package.json
├── tsconfig.json
└── .env                    # Переменные окружения (не в репозитории)


### Установка и запуск:

## Локальный запуск (без Docker)

- Убедитесь, что запущен MongoDB (mongod или MongoDB Compass).
- Склонируйте репозиторий и перейдите в папку backend:
bash:
cd backend

- Установите зависимости:
bash:
npm install

- Создайте файл .env (пример ниже) и поместите его в папку backend.
- Запустите сервер:
    - Продакшн-режим:
      bash:
      npm run start
    - Режим разработки (hot-reload):
      bash:
      npm run dev
- Соберите проект:
bash:
npm run build

- Запуск через Docker Compose

    - В корне репозитория:
    bash:
    docker-compose up --build
Поднимутся сервисы: frontend, backend, mongo, nginx.

- Переменные окружения

Создайте файл backend/.env:
DB_ADDRESS=mongodb://127.0.0.1:27017/weblarek
Важно: имя переменной DB_ADDRESS изменять нельзя — оно используется автотестами.


### API

### Товары

  GET /product

  Возвращает список всех товаров.
  Ответ (200):
  JSON

  {
    "items": [
      {
        "_id": "66601a8c57ecac94459696d6",
        "title": "Мамка-таймер",
        "image": {
          "fileName": "/images/Asterisk_2.png",
          "originalName": "Asterisk_2.png"
        },
        "category": "софт-скил",
        "description": "Будет стоять над душой и не давать прокрастинировать.",
        "price": null
      }
    ],
    "total": 1
  }
  POST /product

  Создаёт новый товар.
  Тело запроса:
  JSON

  {
    "title": "Мамка-таймер",
    "image": {
      "fileName": "/images/Asterisk_2.png",
      "originalName": "Asterisk_2.png"
    },
    "category": "софт-скил",
    "description": "Будет стоять над душой и не давать прокрастинировать.",
    "price": null
  }
  Ответ (201): созданный товар.
  Возможные ошибки:
  400 — переданы некорректные данные (валидация celebrate или mongoose).
  409 — товар с таким title уже существует (дубликат).
  500 — внутренняя ошибка сервера.


### Заказы

  POST /order

  Оформляет заказ.
  Тело запроса:
  JSON

  {
    "payment": "card",
    "email": "admin@ya.ru",
    "phone": "+7999999999",
    "address": "test",
    "total": 4200,
    "items": [
      "662e97d0c2fed29cab5bf3db",
      "662e97dec2fed29cab5bf3dd"
    ]
  }
  Ответ (200):
  JSON

  {
    "id": "c1f83572-e756-4f82-809b-4c710fe51087",
    "total": 4200
  }
  Возможные ошибки:
  400 — переданы некорректные данные, товар не найден, товар не продаётся (price: null), неверная сумма заказа.
  500 — внутренняя ошибка сервера.

### Обработка ошибок

Все ошибки возвращаются в единообразном формате:
JSON

{
  "message": "Описание ошибки"
}
Централизованный обработчик перехватывает:
ошибки валидации celebrate → 400;
Mongoose.ValidationError → 400;
дубликат уникального поля title (E11000) → 409;
кастомные ошибки (ApiError) → соответствующий статус-код;
непредвиденные ошибки → 500.
Логирование

Все входящие запросы записываются в файл request.log (JSON-формат).
Все ошибки записываются в файл error.log (JSON-формат).
Файлы логов не добавляются в репозиторий (должны быть в .gitignore).
Валидация

На уровне запроса: celebrate + joi проверяет тело, параметры и query перед передачей в контроллер.
На уровне схемы: mongoose валидирует длину полей, обязательность, уникальность и типы данных.
Тестирование

Для тестирования API используйте коллекцию Postman: WebLarek.postman_collection.json в корне репозитория.
Также доступны автотесты Яндекс.Практикума, запускаемые через GitHub Actions (.github/workflows/tests.yml).
Автор

Илья Соколов
