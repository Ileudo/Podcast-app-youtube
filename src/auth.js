export function getAuthForm() {
  /* Почему мы динамически генерируем данный html, а не прописываем изначально в верстке? Потому что у нас динамическое
окно, которое изначально не существует, и поэтому нам нужно динамически отразить форму, и потом нам нужно будет также
динамически создать контент окна уже со списком всех вопросов. Поэтому нам приходится всё делать через JS. */
  return `
  <form class="mui-form" id="auth-form">
  <div class="mui-textfield mui-textfield--float-label">
    <input type="email" id="email" required>
    <label for="email">Email</label>
  </div>
  <div class="mui-textfield mui-textfield--float-label">
  <input type="password" id="password" required>
  <label for="pasword">Пароль</label>
</div>
  <button type="submit" class="mui-btn mui-btn--raised mui-btn--primary">Войти</button>
</form>
  `;
}

export function authWithEmailAndPassword(email, password) {
  const apiKey = 'AIzaSyD5uP3DEwH9i54CuZmveH33_rB9LcEErJY';
  /* Здесь нам потребуется сделать асинхронный запрос на сервер. То есть мы обращаемся к методу fetch. Учитывая, что это
  промис, то я сразу и возвращаю этот промис. */
  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password, returnSecureToken: true }),
    headers: {
      'Content-type': 'application-json'
    }
  })
    .then(responce => responce.json())
    .then(data => data.idToken);
}