/**
 * LeetCode 2756. Query Batching
 * 
 * Объединение нескольких мелких запросов в один крупный запрос может быть полезной оптимизацией.
 * Напишите класс QueryBatcher, реализующий эту функциональность.
 *
 * Конструктор должен принимать два параметра:
 * 1. Асинхронную функцию queryMultiple, которая принимает массив строк-ключей input и возвращает
 *    промис, разрешающийся массивом значений той же длины. Каждый элемент массива соответствует
 *    значению для input[i]. Можно считать, что промис никогда не будет отклонён.
 * 2. Время троттлинга t в миллисекундах.
 *
 * Класс имеет единственный метод:
 * async getValue(key) — принимает одну строку-ключ и возвращает промис со строковым значением.
 * Переданные ключи должны в конечном итоге передаваться в функцию queryMultiple.
 * Функция queryMultiple не должна вызываться подряд чаще, чем с интервалом t миллисекунд.
 * При первом вызове getValue queryMultiple вызывается сразу с этим ключом.
 * Если в течение следующих t миллисекунд метод getValue вызывался снова, все ключи
 * объединяются и передаются одним массивом в queryMultiple, а затем возвращаются их значения.
 * Можно считать, что каждый ключ уникален.
 * 
 * Класс QueryBatcher группирует (батчит) запросы
 * по отдельным вызовам метода getValue. Каждый вызов передаёт один ключ, 
 * а QueryBatcher:
 * - Немедленно отправляет первый запрос и запускает «окно» в throttleTime.
 * - Любые последующие вызовы в течение этого окна собирает в массив #throttledRequests.
 * - По истечении throttleTime запускает один запрос через queryMultiple 
 *   для всех накопленных ключей и возвращает результаты всем ожидающим промисам.
 * - Затем снова открывает окно на следующий throttleTime 
 *   и повторяет процесс, пока есть запросы.
 * 
 * Класс QueryBatcher организует одиночные запросы на получение данных в пакетные запросы
 * с контролем частоты. Основная цель — уменьшить количество обращений к удалённому сервису
 * и не превышать заданное ограничение по частоте (rate limit).
 * 
 * Преимущества:
 * - Снижение сетевого трафика и нагрузки на бэкенд за счет группировки запросов в один.
 * - Устойчивость к ограничениям по частоте запросов (rate limiting).
 * - Предсказуемое поведение при резком всплеске однотипных запросов.
 *
 * Пример 1:
 * Входные данные:
 * queryMultiple = async function(keys) {
 *   return keys.map(key => key + '!');
 * }
 * t = 100
 * calls = [
 *   {"key": "a", "time": 10},
 *   {"key": "b", "time": 20},
 *   {"key": "c", "time": 30}
 * ]
 * Выход:
 * [
 *   {"resolved": "a!", "time": 10},
 *   {"resolved": "b!", "time": 110},
 *   {"resolved": "c!", "time": 110}
 * ]
 * Объяснение:
 * const batcher = new QueryBatcher(queryMultiple, 100);
 * setTimeout(() => batcher.getValue('a'), 10); // "a!" в t=10мс
 * setTimeout(() => batcher.getValue('b'), 20); // "b!" в t=110мс
 * setTimeout(() => batcher.getValue('c'), 30); // "c!" в t=110мс
 * В t=10мс вызывается getValue('a') → queryMultiple(['a']) вызывается сразу.
 * В t=20мс и t=30мс getValue('b') и getValue('c') ставятся в очередь.
 * В t=110мс вызывается queryMultiple(['a', 'b']) и результаты возвращаются сразу.
 *
 * Пример 2:
 * Входные данные:
 * queryMultiple = async function(keys) {
 *   await new Promise(res => setTimeout(res, 100));
 *   return keys.map(key => key + '!');
 * }
 * t = 100
 * calls = [
 *   {"key": "a", "time": 10},
 *   {"key": "b", "time": 20},
 *   {"key": "c", "time": 30}
 * ]
 * Выход:
 * [
 *   {"resolved": "a!", "time": 110},
 *   {"resolved": "b!", "time": 210},
 *   {"resolved": "c!", "time": 210}
 * ]
 * Объяснение аналогично примеру 1, но с задержкой в queryMultiple.
 *
 * Пример 3:
 * Входные данные:
 * queryMultiple = async function(keys) {
 *   await new Promise(res => setTimeout(res, keys.length * 100));
 *   return keys.map(key => key + '!');
 * }
 * t = 100
 * calls = [
 *   {"key": "a", "time": 10},
 *   {"key": "b", "time": 20},
 *   {"key": "c", "time": 30},
 *   {"key": "d", "time": 40},
 *   {"key": "e", "time": 250},
 *   {"key": "f", "time": 300}
 * ]
 * Выход:
 * [
 *   {"resolved": "a!", "time": 110},
 *   {"resolved": "e!", "time": 350},
 *   {"resolved": "b!", "time": 410},
 *   {"resolved": "c!", "time": 410},
 *   {"resolved": "d!", "time": 410},
 *   {"resolved": "f!", "time": 450}
 * ]
 * Пояснение:
 * queryMultiple(['a']) вызывается в t=10мс и завершается в t=110мс
 * queryMultiple(['b','c','d']) вызывается в t=110мс и завершается в t=410мс
 * queryMultiple(['e']) вызывается в t=250мс и завершается в t=350мс
 * queryMultiple(['f']) вызывается в t=350мс и завершается в t=450мс
 */




/**
 * Функция для пакетного получения значений по массиву ключей.
 * @callback #queryMultipleFn
 * 
 * Массив ключей
 * @param {string[]} keys
 * 
 * Промис, возвращающий массив строковых результатов
 * @returns {Promise<string[]>} 
 */

/**
 * Запрос, отложенный до формирования пакета.
 * @typedef {Object} ThrottledRequest
 * 
 * Ключ запроса
 * @property {string} key 
 * 
 * Функция для передачи результата
 * @property {(result: string) => void} resolve 
 */

class QueryBatcher {
  #queryMultiple;
  #throttleTime;
  #isThrottling;
  #throttledRequests

  /**
   * конструктор класса, инициализирует внутренние поля
   * 
   * Функция, которая выполняет пакетный запрос
   * @param {queryMultipleFn} queryMultiple 
   * 
   * Время задержки между отправками пакетов (в мс)
   * @param {number} throttleTime 
   */
  constructor(queryMultiple, throttleTime) {
    // сохраняем функцию пакетного запроса
    this.#queryMultiple = queryMultiple;

    // сохраняем интервал throttle между пакетами
    this.#throttleTime = throttleTime;

    // флаг, указывающий, что сейчас идёт период ожидания
    this.#isThrottling = false;

    // массив отложенных запросов, ожидающих пакетной отправки
    this.#throttledRequests = [];
  }

  /**
   * Получение значения по одному ключу с учётом пакетирования.
   * @param {string} key Ключ, для которого нужно получить значение
   * @returns {Promise<string>} Промис, возвращающий строковый результат
   */
  async getValue(key) {
    // проверяем: если #throttleTime равен нулю
    // сразу выполняем пакетный запрос с массивом из одного ключа
    // берём и возвращаем первый элемент из результата
    if (!this.#throttleTime) {
      return (await this.#queryMultiple([key]))[0];
    }
    /**
     * 1. Проверка флага троттлинга
     *    - this.#isThrottling = true означает, что мы уже отправили один батч
     *      и находимся в «ждущем» интервале throttleTime.
     *
     * 2. Создание нового промиса
     *    - Возвращаем промис, который не будет резолвиться сразу.
     *    - Функция-исполнитель промиса принимает единственный аргумент resolve.
     *    - Внутри этого промиса мы сохраняем функцию resolve вместе с соответствующим key
     *      в this.#throttledRequests: { key, resolve }.
     *    - За счёт этого resolve «привязан» к конкретному key и к созданному промису.
     *    - Когда срабатывает #deThrottle(), мы:
     *       1) Собираем все ключи из очереди.
     *       2) Выполняем единый batch-запрос this.#queryMultiple(keys).
     *       3) Для каждого результата вызываем сохранённый resolve(res),
     *          который «разрешает» именно тот промис, что был создан для этого key.
     *
     * 3. Регистрация отложенного запроса
     *    - В массив this.#throttledRequests добавляем объект { key, resolve }.
     *    - key — тот же ключ, по которому мы хотим получить значение.
     *    - resolve — колбэк, вызов которого позже «отпустит» промис и вернёт результат.
     *
     * 4. Как промис «ожидает» результата
     *    - Пока этот промис «в подвешенном» состоянии, метод getValue
     *      возвращает его вызывающему коду.
     *    - В середине throttleTime мы не шлём отдельные запросы,
     *      а только собираем ключи и соответствующие resolve-функции.
     *
     * 5. Разрешение отложенных промисов
     *    - Когда таймер вытечет и вызовется #deThrottle(), 
     *      мы соберём все pending key’и в один batch и вызовем queryMultiple(keys).
     *    - Получив массив results, пробегаем по pending и для каждого:
     *        pending[i].resolve(results[i])
     *      — это пробуждает соответствующий промис и отдаёт значение
     *      туда, где кто-то ждал getValue(key).
     */

    if (this.#isThrottling) {
      return new Promise((resolve) => {
        this.#throttledRequests.push({ key, resolve });
      });
    }

    // иначе помечаем, что throttle-окно началось
    // запускаем таймер на #deThrottle
    this.#isThrottling = true;
    setTimeout(() => this.#deThrottle(), this.#throttleTime);

    // сразу отправляем пакетный запрос для первого ключа
    // и возвращаем его результат
    return (await this.#queryMultiple([key]))[0];
  }

  /**
   * Обработка отложенных запросов по окончании throttle-окна.
   * приватный метод: отправляет собранные за время ожидания запросы одним пакетом
   * @private
   */
  async #deThrottle() {
    /**
     * Сохраняем ссылку на массив отложенных запросов в переменную pending,
     * чтобы далее:
     * 1) Обработать именно ту "партию" запросов, которая накопилась к этому моменту.
     * 2) После этого обнулить this.#throttledRequests = [] и начать собирать новую очередь,
     *    не затрагивая уже сохранённый snapshot (pending).
     *
     * Если бы мы напрямую работали с this.#throttledRequests и сразу же его очищали,
     * мы потеряли бы доступ к списку запросов, которые нужно отправить в текущем батче.
     * 
     * Любые запросы, пришедшие до строки с this.#throttledRequests = [], попадут в
     * pending и будут обработаны сразу в текущей «пачке».
     * 
     * Какие-то запросы, пришедшие после присвоения нового массива (=[]),
     * будут записаны уже в новый this.#throttledRequests и не потеряются:
     * они дождутся следующего #deThrottle().
     */
    const pending = this.#throttledRequests;

    // если очередь пуста, сбрасываем флаг #isThrottling
    // и выходим.
    if (!pending.length) {
      this.#isThrottling = false;
      return;
    }

    /**
     * 1. Извлечение ключей:
     *    const keys = pending.map(({ key }) => key);
     *    — pending  — массив объектов { key, resolve }.
     *    — map берёт каждый объект и возвращает поле key,
     *      в итоге получаем массив простых ключей, например ['a', 'b', 'c'].
     *
     * 2. Групповой запрос:
     *    this.#queryMultiple(keys)
     *    — вызываем функцию пакетного запроса, передаём весь массив keys.
     *    — она возвращает Promise, который при успешном выполнении
     *      отдаёт массив результатов в том же порядке, что и ключи.
     *    — results — массив значений, например [valA, valB, valC].
     *
     * 3. Связывание ответа с промисами:
     *    for (let i = 0; i < results.length; i++) {
     *      pending[i].resolve(results[i]);
     *    }
     *    — проходим по массиву результатов по индексу i.
     *    — для каждого результата берём соответствующий объект pending[i],
     *      у него есть resolve (связанная функция из созданного ранее Promise).
     *    — вызываем pending[i].resolve(results[i]), чтобы «пробудить» именно тот промис,
     *      который ждал своё значение для ключа pending[i].key.
     *
     * Резюме:
     * мы группируем все ожидающие запросы в один массив keys,
     * выполняем единый пакетный запрос и по полученным результатам
     * вызываем соответствующие resolve-функции, завершая оригинальные промисы.
     */
    const keys = pending.map(({ key }) => key);
    const results = await this.#queryMultiple(keys)

    for (let i = 0; i < results.length; i++) {
      pending[i].resolve(results[i]);
    }

    // очищаем старую очередь, готовясь к новым
    // отложенным запросам.
    this.#throttledRequests = [];

    // планируем следующий виток обработки
    // если в новой очереди по­явятся запросы, они
    // обработаются через тот же интервал.
    setTimeout(() => this.#deThrottle(), this.#throttleTime);
  }
}





// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Вспомогательная функция для задержки.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
  Тестовые кейсы для класса QueryBatcher.
  Перед запуском тестов убедитесь, что в этом контексте
  определён класс QueryBatcher.
*/
const tests = [

  {
    description: "Без задержки (throttleTime=0) запросы выполняются сразу",
    async test() {
      const calls = [];
      // stub: возвращает результат вида `val-<key>`
      const queryMultiple = async keys => {
        calls.push([...keys]);
        return keys.map(k => `val-${k}`);
      };
      const batcher = new QueryBatcher(queryMultiple, 0);

      const resA = await batcher.getValue("A");
      const resB = await batcher.getValue("B");

      assert(resA === "val-A", `Ожидалось 'val-A', получено '${resA}'`);
      assert(resB === "val-B", `Ожидалось 'val-B', получено '${resB}'`);

      // Каждый запрос отдельный
      assert(
        calls.length === 2 &&
        calls[0][0] === "A" &&
        calls[1][0] === "B",
        `Ожидалось два отдельных вызова, получено: ${JSON.stringify(calls)}`
      );
    }
  },

  {
    description: "Пакетирование двух запросов в одном throttle окне",
    async test() {
      const calls = [];
      const queryMultiple = async keys => {
        calls.push([...keys]);
        return keys.map(k => `res-${k}`);
      };
      const throttleTime = 50;
      const batcher = new QueryBatcher(queryMultiple, throttleTime);

      // Первый вызов: выполняется сразу и запускает окно
      const p1 = batcher.getValue("X");
      // Второй вызов до истечения throttleTime: попадает в очередь
      const p2 = batcher.getValue("Y");

      const r1 = await p1;
      const r2 = await p2;

      assert(r1 === "res-X", `Ожидалось 'res-X', получено '${r1}'`);
      assert(r2 === "res-Y", `Ожидалось 'res-Y', получено '${r2}'`);

      // Ждём чуть больше окна, чтобы пакет точно ушёл
      await sleep(throttleTime + 10);

      // Первый вызов – отдельный, второй – в пакете из одного
      assert(
        calls.length === 2 &&
        JSON.stringify(calls[0]) === JSON.stringify(["X"]) &&
        JSON.stringify(calls[1]) === JSON.stringify(["Y"]),
        `Ожидалось два вызова: ['X'], ['Y'], получено ${JSON.stringify(calls)}`
      );
    }
  },

  {
    description: "Три запроса в одном throttle окне пакетируются вместе",
    async test() {
      const calls = [];
      const queryMultiple = async keys => {
        calls.push([...keys]);
        return keys.map(k => `${k.toLowerCase()}!`);
      };
      const throttleTime = 30;
      const batcher = new QueryBatcher(queryMultiple, throttleTime);

      // Первый запрос
      const p1 = batcher.getValue("A");
      // Два последующих до истечения окна
      const p2 = batcher.getValue("B");
      const p3 = batcher.getValue("C");

      const r1 = await p1;
      const r2 = await p2;
      const r3 = await p3;

      assert(r1 === "a!", `Ожидалось 'a!', получено '${r1}'`);
      assert(r2 === "b!", `Ожидалось 'b!', получено '${r2}'`);
      assert(r3 === "c!", `Ожидалось 'c!', получено '${r3}'`);

      await sleep(throttleTime + 10);

      // Первый – один, затем пакет из B и C
      assert(
        calls.length === 2 &&
        JSON.stringify(calls[0]) === JSON.stringify(["A"]) &&
        JSON.stringify(calls[1].sort()) === JSON.stringify(["B", "C"].sort()),
        `Ожидалось вызовы: ['A'], ['B','C'], получено ${JSON.stringify(calls)}`
      );
    }
  },

  {
    description: "После окончания окна новые запросы снова идут одиночными или в новом пакете",
    async test() {
      const calls = [];
      const queryMultiple = async keys => {
        calls.push([...keys]);
        return keys.map(k => k.repeat(2));
      };
      const throttleTime = 20;
      const batcher = new QueryBatcher(queryMultiple, throttleTime);

      // пакет №1
      const r1 = await batcher.getValue("M");
      const r2 = await batcher.getValue("N");
      await sleep(throttleTime + 5);

      // пакет №2
      const r3 = await batcher.getValue("P");
      await sleep(throttleTime + 5);

      assert(r1 === "MM", "r1 должно быть 'MM'");
      assert(r2 === "NN", "r2 должно быть 'NN'");
      assert(r3 === "PP", "r3 должно быть 'PP'");

      // Ожидаем 3 пакета: ['M'], ['N'], ['P']
      assert(
        calls.length === 3 &&
        JSON.stringify(calls[0]) === JSON.stringify(["M"]) &&
        JSON.stringify(calls[1]) === JSON.stringify(["N"]) &&
        JSON.stringify(calls[2]) === JSON.stringify(["P"]),
        `Ожидалось три отдельных вызова, получено ${JSON.stringify(calls)}`
      );
    }
  },

  {
    description: "Проверка сохранения порядка ответов при перекрёстных запросах",
    async test() {
      const queryMultiple = async keys => {
        // эмулируем разную задержку ответа
        await sleep(keys[0].charCodeAt(0) % 10 * 5);
        return keys.map(k => k + "_OK");
      };
      const batcher = new QueryBatcher(queryMultiple, 40);

      // запрашиваем D и C одновременно
      const pD = batcher.getValue("D");
      const pC = batcher.getValue("C");

      const [resD, resC] = await Promise.all([pD, pC]);

      assert(resD === "D_OK", `Ожидалось 'D_OK', получено '${resD}'`);
      assert(resC === "C_OK", `Ожидалось 'C_OK', получено '${resC}'`);
    }
  },

];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для QueryBatcher...");
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
    console.log("🎉 Все тесты для QueryBatcher пройдены успешно.");
  }
})();
