# NeuroFit

Платформа для поиска тренеров и партнёров по спорту в России.

## Запуск локально

```bash
docker-compose up --build
```

- Frontend: http://localhost
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Структура

- `backend/` — FastAPI + PostgreSQL
- `frontend/` — HTML/CSS/JS
- `docker-compose.yml` — оркестрация

## Деплой

1. Купить VPS (Beget, Selectel, Яндекс Облако)
2. Установить Docker
3. Склонировать репозиторий
4. `docker-compose up -d`
