/*
  LeetCode 2805. Custom Interval
  
  Реализуйте функцию customInterval(fn, delay, period), которая принимает:
    - fn: функцию для выполнения,
    - delay: число, начальная задержка в миллисекундах,
    - period: число, приращение задержки в миллисекундах.
  Функция должна возвращать идентификатор id.

  customInterval вызывает fn с интервалами, вычисляемыми по формуле:
    delay + period * count
  где count — номер вызова (начиная с 0).

  Реализуйте функцию customClearInterval(id), которая по полученному
  идентификатору id (возвращённому customInterval) отменяет дальнейшие
  вызовы fn.

  Пример 1:
    Ввод:  delay = 50, period = 20, cancelTime = 225
    Вывод: [50, 120, 210]
    Объяснение:
      const t      = performance.now()
      const result = []
      const fn     = () => {
        result.push(Math.floor(performance.now() - t))
      }
      const id = customInterval(fn, delay, period)
      setTimeout(() => {
        customClearInterval(id)
      }, 225)

      50 + 20 * 0 = 50   → 50 ms    (1-й вызов)
      50 + 20 * 1 = 70   → 50+70=120 ms (2-й вызов)
      50 + 20 * 2 = 90   → 120+90=210 ms (3-й вызов)

  Пример 2:
    Ввод:  delay = 20, period = 20, cancelTime = 150
    Вывод: [20, 60, 120]
    Объяснение:
      20 + 20 * 0 = 20   → 20 ms    (1-й вызов)
      20 + 20 * 1 = 40   → 20+40=60 ms  (2-й вызов)
      20 + 20 * 2 = 60   → 60+60=120 ms (3-й вызов)

  Пример 3:
    Ввод:  delay = 100, period = 200, cancelTime = 500
    Вывод: [100, 400]
    Объяснение:
      100 + 200 * 0 = 100   → 100 ms   (1-й вызов)
      100 + 200 * 1 = 300   → 100+300=400 ms (2-й вызов)

  Ограничения:
    20 ≤ delay, period ≤ 250
    20 ≤ cancelTime ≤ 1000
*/



/*
  Создаем Map для хранения активных таймаутов по уникальным ключам.
  Это позволит нам сохранять и отменять каждый “интервал” отдельно.
*/
const intervalMap = new Map();

/*
  Определяем customInterval, которая имитирует setInterval с настраиваемым шагом.
  fn     — функция, которую нужно вызывать.
  delay  — начальная задержка перед первым вызовом fn.
  period — дополнительная задержка, добавляемая к каждой последующей итерации.
*/
function customInterval(fn, delay, period) {

  /*
    Отслеживаем, сколько раз уже была вызвана fn().
    Нужен для вычисления растущей задержки: 
    delay + period * count.
  */
  let count = 0;

  /*
    Рекурсивная функция, которая ставит новый таймаут после каждого выполнения fn().
  */
  function recursiveTimeout() {

    /*
      Вычисляем задержку для текущего запуска:
      первая итерация → delay + period*0,
      вторая       → delay + period*1, и т.д.
    */
    const timeoutDelay = delay + period * count;

    /*
      Устанавливаем таймаут с динамической задержкой и сохраняем его ID в intervalMap.
      Если понадобится отмена, мы знаем, какой именно таймаут отменить.
    */
    intervalMap.set(
      // ключ — уникальный идентификатор интервала
      id,

      /*
        функцию передаем в setTimeout
        1. вызываем пользовательскую функцию
        2. увеличиваем счетчик итераций
        3. планируем следующий запуск
        задаем рассчитанную задержку
      */
      setTimeout(() => {
        fn();
        count++;
        recursiveTimeout();
      }, timeoutDelay)
    );
  }

  /*
    Генерируем 'достаточно уникальный' ключ для этой серии таймаутов.
    Используем Date.now(): если кто-то вызовет customInterval реже чем раз в 1 мс,
    то ключи не повторятся.
  */
  const id = Date.now();

  // Сразу же запускаем первый таймаут.
  recursiveTimeout();

  /*
    Возвращаем ключ, чтобы в дальнейшем пользователь мог остановить интервал.
  */
  return id;
}

/*
  Функция для отмены ранее созданного customInterval по его идентификатору.
*/
function customClearInterval(id) {

  /*
   Проверяем, есть ли в нашей карте таймаут с таким ключом.
  */
  if (!intervalMap.has(id)) return;

  // Получаем сохранённый ID таймаута и очищаем его.
  clearTimeout(intervalMap.get(id));

  /*
    Удаляем запись из Map, чтобы не накапливать “мусор” и избежать утечек памяти.
  */
  intervalMap.delete(id);
}










// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Сохраним оригинальные таймеры, чтобы восстановить их после тестов.
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

// Массив тестов для customInterval и customClearInterval.
const tests = [
  {
    description: "customInterval возвращает числовой id и сохраняет его в map",
    async test() {
      let scheduled = [];
      let cleared = [];
      // Подменяем setTimeout и clearTimeout.
      global.setTimeout = (cb, t) => {
        scheduled.push({ cb, t });
        return scheduled.length - 1;
      };
      global.clearTimeout = (id) => {
        cleared.push(id);
      };
      // Сброс состояния
      intervalMap.clear();

      let callCount = 0;
      const fn = () => { callCount++; };

      const id = customInterval(fn, 100, 50);

      // Проверяем возвращаемый id
      assert(typeof id === "number", `Ожидался числовой id, получено ${typeof id}`);
      assert(intervalMap.has(id), "id должен быть в intervalMap после запуска");

      // Должен быть один запланированный таймаут
      assert(scheduled.length === 1, `Ожидалось 1 запланированный таймаут, найдено ${scheduled.length}`);
      assert(scheduled[0].t === 100, `Ожидалась задержка 100, получена ${scheduled[0].t}`);

      // Эмулируем первый вызов
      scheduled[0].cb();
      assert(callCount === 1, `fn должен был вызваться 1 раз, вызван ${callCount}`);
      // После первого вызова запланируется следующий с delay + period*1 = 150
      assert(scheduled.length === 2, `Ожидалось 2 запланированных таймаута, найдено ${scheduled.length}`);
      assert(scheduled[1].t === 150, `Ожидалась задержка 150, получена ${scheduled[1].t}`);

      // Эмулируем второй вызов
      scheduled[1].cb();
      assert(callCount === 2, `fn должен был вызваться 2 раза, вызван ${callCount}`);
      // После второго вызова запланится ещё один с delay + period*2 = 200
      assert(scheduled.length === 3, `Ожидалось 3 запланированных таймаута, найдено ${scheduled.length}`);
      assert(scheduled[2].t === 200, `Ожидалась задержка 200, получена ${scheduled[2].t}`);

      // Восстанавливаем оригинальные таймеры и очищаем map
      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
      intervalMap.clear();
    },
  },
  {
    description: "customClearInterval отменяет первый запланированный таймаут",
    async test() {
      let scheduled = [];
      let cleared = [];
      global.setTimeout = (cb, t) => {
        scheduled.push({ cb, t });
        return scheduled.length - 1;
      };
      global.clearTimeout = (id) => {
        cleared.push(id);
      };
      intervalMap.clear();

      const fn = () => { };
      const id = customInterval(fn, 30, 20);

      // Должен быть один запланированный таймаут с id = 0
      assert(scheduled.length === 1, "Таймаут не был запланирован");
      assert(scheduled[0].t === 30, `Ожидалась задержка 30, получена ${scheduled[0].t}`);

      // Отменяем до первого срабатывания
      customClearInterval(id);

      // Должен быть вызван clearTimeout с тем же id
      assert(cleared.length === 1, `Ожидалось 1 вызов clearTimeout, найдено ${cleared.length}`);
      assert(cleared[0] === 0, `Ожидался clearTimeout(0), получен clearTimeout(${cleared[0]})`);
      assert(!intervalMap.has(id), "id не должен больше присутствовать в intervalMap");

      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
      intervalMap.clear();
    },
  },
  {
    description: "customClearInterval после первого срабатывания отменяет следующий таймаут",
    async test() {
      let scheduled = [];
      let cleared = [];
      global.setTimeout = (cb, t) => {
        scheduled.push({ cb, t });
        return scheduled.length - 1;
      };
      global.clearTimeout = (id) => {
        cleared.push(id);
      };
      intervalMap.clear();

      let callCount = 0;
      const fn = () => { callCount++; };
      const id = customInterval(fn, 50, 25);

      // Эмулируем первый срабатывающий таймаут
      scheduled[0].cb();
      assert(callCount === 1, "fn должен был вызваться 1 раз после первого cb");

      // Теперь в scheduled[1] лежит следующий таймаут с id = 1
      assert(scheduled.length === 2, "Ожидалось 2 запланированных таймаута");
      assert(scheduled[1].t === 75, `Ожидалась задержка 75, получена ${scheduled[1].t}`);

      // Отменяем до второго срабатывания
      customClearInterval(id);
      assert(cleared.length === 1, `Ожидалось 1 вызов clearTimeout, найдено ${cleared.length}`);
      assert(cleared[0] === 1, `Ожидался clearTimeout(1), получен clearTimeout(${cleared[0]})`);
      assert(!intervalMap.has(id), "id не должен присутствовать в intervalMap после clear");

      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
      intervalMap.clear();
    },
  },
  {
    description: "customClearInterval с несуществующим id не бросает ошибок",
    async test() {
      // Просто вызываем с рандомным id
      customClearInterval(123456);
      // Если не упало — тест пройден
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для customInterval и customClearInterval...");
  let hasErrors = false;
  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test();
      console.log(`✔️  Тест ${i + 1} пройден: ${tests[i].description}`);
    } catch (e) {
      hasErrors = true;
      console.error(`❌ Тест ${i + 1} не пройден: ${tests[i].description}`);
      console.error(e);
    }
  }
  if (hasErrors) {
    console.error("❗ Некоторые тесты завершились с ошибкой.");
  } else {
    console.log("🎉 Все тесты для customInterval и customClearInterval завершены успешно.");
  }
})();
