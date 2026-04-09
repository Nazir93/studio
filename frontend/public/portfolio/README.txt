Портфолио без админки и без базы данных
========================================

1) Медиа (фото, видео)
   Кладите файлы в эту папку: public/portfolio/<slug-кейса>/
   Пример: public/portfolio/tfl/hero.png, public/portfolio/tfl/showcase-analytics.png
   В продакшене путь в браузере: /portfolio/tfl/hero.png

2) Тексты и структура кейсов
   Редактируйте frontend/src/lib/portfolio-data.ts
   — поля heroImage, heroVideo, showcaseImage*, imageGallery[] указывают на пути от /public.

3) Новый кейс
   — Добавьте папку с файлами в public/portfolio/<новый-slug>/
   — Добавьте объект в массив PORTFOLIO_CASES в portfolio-data.ts
   — Убедитесь, что slug совпадает с именем папки и с URL /portfolio/<slug>

4) Видео
   Форматы: mp4 в public (как сейчас cases-title.mp4 для заголовка).
   В данных кейса поле heroVideo: "/portfolio/.../video.mp4"
