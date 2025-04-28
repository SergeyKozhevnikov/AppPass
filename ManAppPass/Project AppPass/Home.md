# Стартовая страница Пропуск.Онлайн
Система – «Пропуск.Онлайн» (**AppPass**)
Наша команда - КГБ (Контрольно-Гостевое Бюро)

https://disk.yandex.ru/client/disk/JS_TS_2025

**Описание:** 
Наша команда создает продукт «Пропуск.Онлайн» (**AppPass**) - система заказа электронных пропусков. Основная цель заключается в создании удобного и эффективного инструмента для управления доступом на объекты отрасли, который автоматизирует процесс выдачи пропусков, улучшает контроль безопасности и оптимизирует административные процессы.

**Видение:**  <br>Мы хотим создать универсальную и надежную отраслевую систему управления пропусками, которая станет основой для организаций, заботящихся об эффективности и комфорте своих сотрудников и посетителей с учетом высоких требований к безопасности. Система будет способствовать переходу к цифровому будущему, где процессы получения пропуска станут проще и быстрее.

Презентация
https://disk.yandex.ru/i/lue8vZdAiO4Jiw
Описание
https://disk.yandex.ru/i/qknMz13d8sD4PA
Критерии 
https://disk.yandex.ru/i/Pp2pWrFtoe9eHg
Посещения 
https://disk.yandex.ru/edit/d/SLB5vCLTcgeKE8KQOM9VDyPegnqahzm72s0qoIz-cKg6cVFzUVZUWEJsQQ?source=docs

**Роли пользователей системы**
- любой авторизированный пользователь (может оформлять заявку на пропуск)
- ~~оператор (просматривает заявки и проставляет отметки о выдаче пропуска и проходах/проездах)~~
- ~~согласующий (согласовывает оформление заявки на пропуск)~~
- администратор системы (может всё)

**Бэклог на систему**
1.Авторизация в системе. Регистрация нового пользователя. Поддержка ролевой модели. Профиль пользователя с возможностью редактирования. Форма регистрации новых пользователей и назначения ролей.    
2.Главная страница (MainPage) с главным меню или списком, навигацией, логотипом и возможностью создания новой заявки пропуска с выбором формы установленного образца. Адаптация под мобильное устройство.
3.Страница создания нового пропуска установленного образца, с кнопками: Сохранить, Удалить, Изменить, Отменить, Согласовать, История отработки.  
4.Представление с перечнем всех заявок на пропуск, с кнопками:  Создать, Удалить, Изменить, Отменить.  
5.Страница для создания перечня согласующих по типу заявки, с атрибутами:  ФИО согласующих, срок, комментарий, Кнопки: Согласен и Не согласен.      
6.Представление с перечнем всех заявок, которые на согласовании. Каждый пользователь видит только свои заявки.  
7.Страница "О программе" и "Связь с тех поддержкой"        
8.Страница для печати согласованной заявки на пропуск.

**Ресурсы** 
Github - https://github.com/SergeyKozhevnikov/AppPass
ЁЖКА - https://bun.rt.ru/project/PROPUSKONL/board
FigJam - https://www.figma.com/board/0dWAIdmfeM3cp2vjCesxyr/AppPass
Figma Design - https://www.figma.com/design/jeSZuwj1e87dHOMBeXqPlJ/AppPass
DrawSql БД проекта - https://drawsql.app/teams/bitrixbitrixisovich/diagrams/jsf25          
(Логин - info@dev-consult.ru   и пароль - 11223344     Проект JSF25)

**Инструменты**
Среда разработки проекта выбирается участником команды самостоятельно, в учебном курсе рекомендуется **Visual Studio Code** - (https://code.visualstudio.com/download)

Рекомендуется использовать расширения **Visual Studio Code** из маркета:
https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Installs

- Git Graph - показывает график Git для своего репозитория
https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph
- TODOs - позволяет выделять в коде заметки
https://marketplace.visualstudio.com/items?itemName=solomonkinard.todos
- Docker - для работы с Docker
https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
- ESLint - подсказывает синтетические ошибки в коде
https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Prettier - помогает форматировать код в едином стиле 
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- MUI - подсказки по коду для MUI
https://marketplace.visualstudio.com/items?itemName=vscodeshift.material-ui-snippets
- Tailwind CSS IntelliSense -стили Tailwind
https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
- Nextjs snippets - для работы с NextJS 
https://marketplace.visualstudio.com/items?itemName=PulkitGangwar.nextjs-snippets

Базы данных проекта будем хранить в **СУБД PostgreSQL** — это мощная объектно-реляционная система управления базами данных с открытым исходным кодом.
https://www.postgresql.org/download/

**Проект**
Для создания проекта мы будем использовать create-react-app - это официально поддерживаемый способ создания одностраничных приложений React без предварительной настройки. 
Для использования необходимо иметь установленный node.js, компоненты и плагины:
Node.js — скачать и установить (https://nodejs.org/en/download)
NestJS - а progressive Node.js frame https://nestjs.com/
MUI X - плагин (https://mui.com/x/whats-new/)
Tailwind CSS - плагин (https://tailwindcss.ru/docs/editor-setup/)

**Инструкции** 
Obsidian - бесплатное и гибкое приложение для заметок и ваших идей.
https://obsidian.md/
### Инструкции по запуску
[[Запуск проекта]]
[[Начало работы в GIT]]
[[Деплой системы на сервер]]
