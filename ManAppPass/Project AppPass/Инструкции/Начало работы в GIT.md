**Начало работы в GIT**
шаг 0 - сделать локальную копию проекта  
git clone [https://github.com/DenSakharov/impuls.git](https://github.com/DenSakharov/impuls.git)

шаг 0 - Профиль
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

шаг 1 - Начало работы  
git status  
git pull --rebase origin main  
git branch  
git branch develop  
git checkout develop

шаг 2 -Коммит изменений  
git add .  
git commit -m 'Новый коммит'  
git push --set-upstream origin develop  
git log --oneline

шаг 3 - Отправляю на github  
git checkout main  
git merge develop  
git push

Create sub-issue