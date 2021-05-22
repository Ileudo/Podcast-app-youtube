export class Question {
  /* И учитывая, что мне даже контекст здесь не нужен, то я буду использовать ключевое слово static для того, чтобы
 использовать статические методы. */
  static create(question) {
    /* Здесь нам необходимо сделать запрос к бекэнду. Для этого в JS в Web API присутствует нативный метод fetch. Туда мы просто
    передаем строчку, которую скопировали из созданной базы в firebase. Надо учитывать, что это просто ссылка до базы
    данных. И далее нам необходимо создать какую-то коллекцию. Для простоты понимания, это просто как обычный ключ
    в объекте. Назову её questions.json. Расширение .json обязательно нужно писать. Это правило в firebase, для того чтобы
    он понимал, что мы сейчас работаем с форматом json. Но далее для того, чтобы создать какое-то поле в базе данных, нам
    необходимо настроить метод fetch. То есть вторым параметром я сюда передаю объект*/
    return fetch('https://podcast--app-88185-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
      method: 'POST',
      /* Если я просто передам в body question, то это работать не будет, потому что это JS объект. Для того чтобы firebase
      понимал, что это за данные нам необходимо его застрингифайить. */
      body: JSON.stringify(question),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(responce => responce.json())
      .then(responce => {
        /* У responce в поле name хранится его id. */
        question.id = responce.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">У вас нет токена</p>`)
    }
    /* По этой строчке методом Get, который идет по умолчанию в методе fetch,  мы получаем список всех вопросов,
    которые есть в системе. Дальше я начинаю парсить этот ответ. */
    return fetch(`https://podcast--app-88185-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
      .then(responce => responce.json())
      .then(responce => {
        if (responce && responce.error) {
          return `<p class="error">У вас нет токена</p>`
        }
        return responce
          ? Object.keys(responce).map(key => ({
            ...responce[key],
            id: key
          }))
          : []
      })
  }

  static renderList() {
    /* Мы обозначили метод как static, поэтому внутри then мы не можем написать this.renderList. Это не будет работать.
    Здесь мы напишем Question.renderList. */
    const questions = getQuestionsFromLocalStorage();
    /* Далее нам необходимо сформировать базовый html, который будет содержать в себе все необходимые карточки. На выходе
    нам нужен html, то есть обычная строчка, поэтому массив я соединяю через join. */
    const html = questions.length
      ? questions.map(toCard).join('')
      : ` <div class="mui--text-headline">Вы пока ничего не спрашивали</div>`;

    /* Наш Html готов. Нужно положить его в то место, где нам нужно вывести список.*/
    const list = document.getElementById('list');
    list.innerHTML = html;
  }

  static listToHtml(questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : `<p>Вопросов пока нет!</p>`
  }
}

function addToLocalStorage(question) {
  /* Нам необходимо получить список всех вопросов, которые есть в LocalStorage и уже к ним добавить новый вопрос, и потом
  записать обратно этот массив. */
  const all = getQuestionsFromLocalStorage();
  /* Переменная all является JS-массивом, поэтому с помощью метода push я могу добавить question. */
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));

}

function getQuestionsFromLocalStorage() {
  /* Здесь мы получаем строку. Нам нужно её распарсить.*/
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  return `
  <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
  <div>${question.text}</div>
  <br>
  `
}