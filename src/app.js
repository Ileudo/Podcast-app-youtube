import './styles.css';
import { Question } from './question';
import { createModal, isValid } from './utils';
import { getAuthForm, authWithEmailAndPassword } from './auth';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

/* Рендерим список при загрузке страницы. Чтобы он не очищался при перезагрузке страницы. */
window.addEventListener('load', Question.renderList)
/* Нативное событие, которое слушает, когда мы нажимаем на Enter или на сабмит-кнопку. */
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
})

function submitFormHandler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }
    /* Выключаем кнопку, чтобы пользователь не мог спамить кучу запросов на сервер. */
    submitBtn.disabled = true;
    //Async request to server to save question
    /* Метод create ждет объект question, который мы с вами сформировали. И учитывая, что метод create возвращает промис,
    то мы можем дописать then. И этот then выполнится уже тогда, когда мы сделали запрос к серверу. */
    Question.create(question).then()
    console.log('Question', question);

    input.value = '';
    input.className = ''; /*Чтобы инпут перестал нативно через MUI валидироваться после отправки запроса на сервер. */
    submitBtn.disabled = false;

  }
}

function openModal() {
  createModal('Авторизация', getAuthForm());
  document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(event) {
  event.preventDefault();

  /* Для начала нам надо получить доступ до email и пароля, который мы писали в форме. */
  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  /* Пока что этот метод нам возвращает промис, но мы его частично обрабатываем в самой функции. */
  authWithEmailAndPassword(email, password)
    .then(token => Question.fetch(token))
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
  /* createModal принимает в себя html, поэтому нам необходимо привести его к списку. */
  if (typeof content === 'string') {
    createModal('Ошибка', content)
  } else {
    createModal('Список вопросов', Question.listToHtml(content))
  }
}