const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const multer = require('multer'); // Подключаем библиотеку multer для обработки файлов

// Настройка хранения файлов с использованием multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>Форма</h1>
    <form class="hhh" id="myForm" action="/data" method="post" enctype="multipart/form-data"> <!-- Добавлено: атрибут enctype для отправки файлов -->
      <!-- Поле названия -->
      <label for="name">Название:</label>
      <input type="text" id="name" name="title" required>

      <label for="name">Бағасы:</label>
      <input type="text" name="price" required>

      <label for="name">Телефон номер:</label>
      <input type="text" name="nom" required>

      <!-- Поле текста адаптивного размера -->
      <label for="text">Не туралы:</label>
      <textarea id="text" name="content" rows="4" cols="50" required></textarea>

      <!-- Список -->
      <label for="list">Список:</label>
      <select name="labels">
        <option value="Ұсыныс">Ұсыныс</option>
        <option value="Жаңалық">Жаңалық</option>
        <option value="Тапсырма">Тапсырма</option>
      </select>

      <!-- Поле для загрузки фото -->
      <label for="photo">Фото:</label>
      <input type="file" id="photo" name="photo">

      <!-- Кнопка отправки формы -->
      <input type="submit" value="Отправить">
    </form>
  `);
});

app.post('/data', upload.single('photo'), (req, res) => { // Добавлено: использование multer для обработки файла
  const base = req.body;
  const file = req.file; // Добавлено: получение файла из запроса
  const fileData = {
    originalname: file.originalname,
    mimetype: file.mimetype,
    buffer: file.buffer
  };
  io.emit('send', {base, file: fileData}); // Исправлено: отправка данных и файла через событие 'send'
  res.send('Сіздің ұсынсыңыз сақталды!'); // Исправлено: убрана лишняя буква "e"
});

io.on('connection', (socket) => {
  console.log('Клиент подключился');

  socket.on('disconnect', () => {
    console.log('Клиент отключился');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
