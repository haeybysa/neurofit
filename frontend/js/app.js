const API_URL = 'http://localhost:8000';

const sportEmojis = {
    'Теннис': '🎾', 'Настольный теннис': '🏓', 'Падел': '🥎',
    'Бадминтон': '🏸', 'Футбол': '⚽', 'Баскетбол': '🏀',
    'Волейбол': '🏐', 'Гандбол': '🤾', 'Хоккей': '🏒',
    'Плавание': '🏊', 'Фитнес': '💪', 'Кроссфит': '🏋️',
    'Йога': '🧘', 'Пилатес': '🤸', 'Стретчинг': '🦵',
    'Бокс': '🥊', 'ММА': '🥋', 'Дзюдо': '🥋',
    'Карате': '🥋', 'Тхэквондо': '🥋', 'Фехтование': '🤺',
    'Стрельба из лука': '🏹', 'Стрельба': '🎯', 'Гольф': '⛳',
    'Скейтбординг': '🛹', 'Горные лыжи': '⛷️', 'Сноуборд': '🏂',
    'Фигурное катание': '⛸️', 'Танцы': '💃', 'Гимнастика': '🤸‍♀️',
    'Скалолазание': '🧗', 'Велоспорт': '🚴', 'Бег': '🏃',
    'Триатлон': '🏃‍♂️', 'Конный спорт': '🏇', 'Шахматы': '♟️'
};

document.addEventListener('DOMContentLoaded', () => {
    loadCities();
    loadSportTypes();
    loadTrainers();
    loadCitiesSection();
});

async function loadCities() {
    try {
        const response = await fetch(`${API_URL}/search/cities`);
        const cities = await response.json();
        const citySelect = document.getElementById('city-select');
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = `${city.emoji || '🏙️'} ${city.name}`;
            citySelect.appendChild(option);
        });
    } catch (error) { console.error('Error loading cities:', error); }
}

async function loadSportTypes() {
    try {
        const response = await fetch(`${API_URL}/search/sport-types`);
        const sports = await response.json();
        const sportSelect = document.getElementById('sport-select');
        const sportsGrid = document.getElementById('sports-grid');

        sports.forEach(sport => {
            const option = document.createElement('option');
            option.value = sport.id;
            option.textContent = `${sport.emoji || '🏃'} ${sport.name}`;
            sportSelect.appendChild(option);
        });

        sportsGrid.innerHTML = '';
        sports.forEach(sport => {
            const emoji = sport.emoji || sportEmojis[sport.name] || '🏃';
            const card = document.createElement('div');
            card.className = 'sport-card';
            card.innerHTML = `<div class="emoji">${emoji}</div><h3>${sport.name}</h3><p class="count">${Math.floor(Math.random()*200+10)} тренеров</p>`;
            card.addEventListener('click', () => { sportSelect.value = sport.id; searchTrainers(); });
            sportsGrid.appendChild(card);
        });
    } catch (error) { console.error('Error loading sports:', error); }
}

async function loadTrainers() {
    try {
        const response = await fetch(`${API_URL}/trainers?limit=6`);
        const trainers = await response.json();
        renderTrainers(trainers);
    } catch (error) {
        console.error('Error loading trainers:', error);
        renderTrainers(getDemoTrainers());
    }
}

async function searchTrainers() {
    const cityId = document.getElementById('city-select').value;
    const sportTypeId = document.getElementById('sport-select').value;
    let url = `${API_URL}/search/trainers?limit=20`;
    if (cityId) url += `&city_id=${cityId}`;
    if (sportTypeId) url += `&sport_type_id=${sportTypeId}`;

    try {
        const response = await fetch(url);
        const trainers = await response.json();
        renderTrainers(trainers);
        document.getElementById('trainers').scrollIntoView({ behavior: 'smooth' });
    } catch (error) { console.error('Error searching:', error); }
}

document.getElementById('search-btn').addEventListener('click', searchTrainers);

function renderTrainers(trainers) {
    const trainersGrid = document.getElementById('trainers-grid');
    trainersGrid.innerHTML = '';

    if (trainers.length === 0) {
        trainersGrid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">Тренеры не найдены. Попробуйте изменить фильтры.</p>';
        return;
    }

    trainers.forEach(trainer => {
        const card = document.createElement('div');
        card.className = 'trainer-card';
        const emoji = sportEmojis[trainer.sport_type?.name] || '💪';
        const photoUrl = trainer.photo_url || null;

        card.innerHTML = `
            <div class="trainer-photo" style="${photoUrl ? `background-image:url(${photoUrl});background-size:cover;` : ''}">${!photoUrl ? emoji : ''}</div>
            <div class="trainer-info">
                <div class="trainer-header">
                    <span class="trainer-name">${trainer.first_name} ${trainer.last_name}</span>
                    ${trainer.is_verified ? '<span class="verified-badge">✓ Проверен</span>' : ''}
                </div>
                <div class="trainer-meta">${trainer.sport_type?.emoji || ''} ${trainer.sport_type?.name || 'Спорт'} • ${trainer.city?.name || 'Россия'} • ${trainer.experience_years || 0} лет опыта</div>
                <div class="trainer-tags"><span class="tag">★ ${trainer.rating}</span><span class="tag">${trainer.reviews_count} отзывов</span></div>
                <div class="trainer-footer">
                    <span class="trainer-price">от ${trainer.price_per_hour.toLocaleString()} ₽/час</span>
                    <button class="btn-primary" onclick="showTrainerDetails(${trainer.id})">Подробнее</button>
                </div>
            </div>`;
        trainersGrid.appendChild(card);
    });
}

async function showTrainerDetails(trainerId) {
    try {
        const response = await fetch(`${API_URL}/trainers/${trainerId}`);
        const trainer = await response.json();
        const modal = document.getElementById('trainer-modal');
        const modalBody = document.getElementById('modal-body');

        const reviewsHtml = trainer.reviews?.length > 0 
            ? trainer.reviews.map(r => `<div style="margin-bottom:16px;padding:16px;background:var(--bg);border-radius:8px;"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><strong>${r.author_name}</strong><span style="color:#fbbf24;">★ ${r.rating}</span></div><p style="color:var(--text-muted);">${r.text}</p></div>`).join('')
            : '<p style="color:var(--text-muted);">Пока нет отзывов</p>';

        modalBody.innerHTML = `
            <div style="text-align:center;margin-bottom:24px;">
                <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:60px;">${sportEmojis[trainer.sport_type?.name] || '💪'}</div>
                <h2>${trainer.first_name} ${trainer.last_name}</h2>
                <p style="color:var(--text-muted);">${trainer.sport_type?.name} • ${trainer.city?.name}</p>
                ${trainer.is_verified ? '<span class="verified-badge">✓ Проверенный тренер</span>' : ''}
            </div>
            <div style="margin-bottom:24px;"><h3 style="margin-bottom:12px;">О тренере</h3><p style="color:var(--text-muted);line-height:1.8;">${trainer.bio || 'Описание пока не добавлено.'}</p></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
                <div style="background:var(--bg);padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:700;color:var(--primary);">${trainer.experience_years || 0}</div><div style="color:var(--text-muted);font-size:14px;">лет опыта</div></div>
                <div style="background:var(--bg);padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:700;color:var(--primary);">${trainer.reviews_count || 0}</div><div style="color:var(--text-muted);font-size:14px;">отзывов</div></div>
            </div>
            <div style="margin-bottom:24px;"><h3 style="margin-bottom:12px;">Отзывы</h3>${reviewsHtml}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="btn-primary btn-large" style="flex:1;min-width:200px;" onclick="bookTrainer(${trainer.id})">Записаться — ${trainer.price_per_hour.toLocaleString()} ₽/час</button>
                ${trainer.telegram ? `<a href="https://t.me/${trainer.telegram}" target="_blank" class="btn-primary" style="flex:1;min-width:200px;text-align:center;text-decoration:none;background:var(--bg)!important;border:1px solid var(--primary)!important;">Написать в Telegram</a>` : ''}
            </div>`;

        modal.classList.add('active');
    } catch (error) { console.error('Error loading trainer details:', error); }
}

async function bookTrainer(trainerId) {
    const clientName = prompt('Ваше имя:');
    if (!clientName) return;
    const clientPhone = prompt('Ваш телефон:');
    if (!clientPhone) return;

    try {
        const response = await fetch(`${API_URL}/bookings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trainer_id: trainerId, client_name: clientName, client_phone: clientPhone, message: 'Заявка через сайт' })
        });
        if (response.ok) alert('Заявка отправлена! Тренер свяжется с вами в ближайшее время.');
        else alert('Ошибка при отправке заявки. Попробуйте позже.');
    } catch (error) { alert('Ошибка соединения. Попробуйте позже.'); }
}

async function loadCitiesSection() {
    try {
        const response = await fetch(`${API_URL}/search/cities`);
        const cities = await response.json();
        const citiesGrid = document.getElementById('cities-grid');
        const cityEmojis = ['🏙️','🏛️','🌆','🏘️','🌇','🏙️','🌃','🏖️','🏔️','🌉'];

        citiesGrid.innerHTML = '';
        cities.forEach((city, i) => {
            const card = document.createElement('div');
            card.className = 'city-card';
            card.innerHTML = `<h3>${cityEmojis[i % cityEmojis.length]} ${city.name}</h3><p>${Math.floor(Math.random()*200+20)} тренеров • ${Math.floor(Math.random()*500+50)} партнёров</p>`;
            card.addEventListener('click', () => { document.getElementById('city-select').value = city.id; searchTrainers(); });
            citiesGrid.appendChild(card);
        });
    } catch (error) { console.error('Error loading cities section:', error); }
}

document.querySelector('.modal-close').addEventListener('click', () => document.getElementById('trainer-modal').classList.remove('active'));
document.getElementById('trainer-modal').addEventListener('click', (e) => { if (e.target === document.getElementById('trainer-modal')) document.getElementById('trainer-modal').classList.remove('active'); });

function scrollToSearch() {
    document.querySelector('.search-box').scrollIntoView({ behavior: 'smooth' });
}

function getDemoTrainers() {
    return [
        { id: 1, first_name: 'Александр', last_name: 'Петров', sport_type: { name: 'Теннис', emoji: '🎾' }, city: { name: 'Москва' }, experience_years: 12, price_per_hour: 3500, rating: 4.9, reviews_count: 127, is_verified: true },
        { id: 2, first_name: 'Мария', last_name: 'Иванова', sport_type: { name: 'Йога', emoji: '🧘' }, city: { name: 'Санкт-Петербург' }, experience_years: 8, price_per_hour: 2000, rating: 4.8, reviews_count: 89, is_verified: true },
        { id: 3, first_name: 'Дмитрий', last_name: 'Соколов', sport_type: { name: 'Футбол', emoji: '⚽' }, city: { name: 'Казань' }, experience_years: 15, price_per_hour: 2500, rating: 4.9, reviews_count: 203, is_verified: true },
        { id: 4, first_name: 'Анна', last_name: 'Козлова', sport_type: { name: 'Плавание', emoji: '🏊' }, city: { name: 'Екатеринбург' }, experience_years: 10, price_per_hour: 2200, rating: 4.7, reviews_count: 156, is_verified: true },
        { id: 5, first_name: 'Сергей', last_name: 'Волков', sport_type: { name: 'Фитнес', emoji: '💪' }, city: { name: 'Краснодар' }, experience_years: 6, price_per_hour: 1800, rating: 4.8, reviews_count: 178, is_verified: true },
        { id: 6, first_name: 'Елена', last_name: 'Смирнова', sport_type: { name: 'Бокс', emoji: '🥊' }, city: { name: 'Москва' }, experience_years: 9, price_per_hour: 3000, rating: 4.9, reviews_count: 94, is_verified: true },
    ];
}
