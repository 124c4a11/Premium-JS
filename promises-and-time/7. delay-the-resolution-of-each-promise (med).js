/*
  LeetCode 2821. Delay the Resolution of Each Promise

  Дано массив functions и число ms. Требуется вернуть новый массив функций.

  functions — массив функций, возвращающих промисы.
  ms — длительность задержки в миллисекундах; определяет, сколько времени ждать перед разрешением каждого промиса в новом массиве.

  Каждая функция из нового массива должна возвращать промис, который разрешится с задержкой ms миллисекунд, сохраняя порядок функций из исходного массива functions. Функция delayAll должна обеспечить, чтобы каждая функция из исходного массива выполнялась с указанной задержкой, формируя новый массив функций, возвращающих промисы с задержкой.

  Пример 1:
  Вход:
  functions = [
    () => new Promise(resolve => setTimeout(resolve, 30))
  ],
  ms = 50

  Вывод: [80]
  Пояснение: промис из исходного массива разрешился бы через 30 мс, но был задержан на 50 мс, итого 30 + 50 = 80 мс.

  Пример 2:
  Вход:
  functions = [
    () => new Promise(resolve => setTimeout(resolve, 50)),
    () => new Promise(resolve => setTimeout(resolve, 80))
  ],
  ms = 70

  Вывод: [120, 150]
  Пояснение: промисы из исходного массива разрешились бы через 50 мс и 80 мс, но были задержаны на 70 мс, итого 50 + 70 = 120 мс и 80 + 70 = 150 мс.

  Ограничения:
  - functions — массив функций, возвращающих промисы.
  - 10 <= ms <= 500
  - 1 <= functions.length <= 10
*/



/*
  Объявляем функцию delayAll, принимающую два аргумента:
    functions — массив функций, возвращающих промисы;
    ms — длительность задержки в миллисекундах перед выполнением каждой функции.
*/
function delayAll(functions, ms) {

  /*
    Используем метод .map для преобразования каждого элемента массива functions.
    Для каждой оригинальной функции fn мы создаем и возвращаем новую функцию.
  */
  return functions.map((fn) => {

    /*
      Возвращаем асинхронную функцию, которая при вызове:
      1) ставит выполнение на паузу на заданное время;
      2) затем вызывает оригинальную функцию fn.
    */
    return async () => {

      /*
        Создаем новый промис, который
        через ms миллисекунд вызывает resolve,
        тем самым "разблокируя" ожидание await.
      */
      await new Promise((resolve) =>
        setTimeout(resolve, ms)
      );

      /*
        После задержки выполняем оригинальную функцию fn()
        и сразу возвращаем её результат (промис).
      */
      return fn();
    };
  });
}











// Тестовые кейсы для delayAll
// Вспомогательная функция для создания задержки.
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Тестовые кейсы для delayAll
const tests = [
  {
    description: "Пустой массив функций",
    async test() {
      const start = Date.now();
      const wrapped = delayAll([], 100);
      const elapsed = Date.now() - start;
      assert(Array.isArray(wrapped), "Ожидался массив");
      assert(wrapped.length === 0, `Ожидалось 0 функций, получено ${wrapped.length}`);
      assert(elapsed < 50, `Оборачивание заняло слишком много времени: ${elapsed} ms`);
    },
  },
  {
    description: "Одна синхронная функция с задержкой",
    async test() {
      let called = false;
      const fn = () => {
        called = true;
        return 123;
      };
      const [wrapped] = delayAll([fn], 100);
      const start = Date.now();
      const result = await wrapped();
      const elapsed = Date.now() - start;
      assert(called, "Оригинальная функция не была вызвана");
      assert(result === 123, `Ожидалось 123, получено ${result}`);
      assert(elapsed >= 90 && elapsed < 200, `Задержка должна быть ~100ms, фактически ${elapsed} ms`);
    },
  },
  {
    description: "Одна асинхронная функция с собственной задержкой",
    async test() {
      let order = [];
      const fn = async () => {
        order.push("before");
        await delay(50);
        order.push("after");
        return "done";
      };
      const [wrapped] = delayAll([fn], 100);
      const start = Date.now();
      const result = await wrapped();
      const elapsed = Date.now() - start;
      assert(result === "done", `Ожидалось "done", получено "${result}"`);
      assert(order.join(",") === "before,after", `Неправильный порядок: ${order.join(",")}`);
      assert(elapsed >= 140 && elapsed < 250, `Полная задержка должна быть ~150ms, фактически ${elapsed} ms`);
    },
  },
  {
    description: "Несколько функций параллельно",
    async test() {
      const durations = [30, 60, 90];
      const fns = durations.map((d, i) => async () => {
        await delay(d);
        return i;
      });
      const wrapped = delayAll(fns, 50);
      const start = Date.now();
      const results = await Promise.all(wrapped.map(fn => fn()));
      const elapsed = Date.now() - start;
      // Все три выполняются параллельно: ms (50) + max внутренней (90) = ~140ms
      assert(results.join(",") === "0,1,2", `Неожиданные результаты: ${results}`);
      assert(elapsed >= 130 && elapsed < 250, `Ожидалось ~140ms, фактически ${elapsed} ms`);
    },
  },
  {
    description: "Задержка 0 ms",
    async test() {
      let count = 0;
      const fns = [
        () => { count++; return "a"; },
        () => { count++; return "b"; }
      ];
      const wrapped = delayAll(fns, 0);
      const results = [];
      results.push(await wrapped[0]());
      results.push(await wrapped[1]());
      assert(count === 2, `Ожидалось 2 вызова, фактически ${count}`);
      assert(results.join("") === "ab", `Ожидались ["a","b"], получено ${JSON.stringify(results)}`);
    },
  },
  {
    description: "Оригинальная функция выбрасывает ошибку",
    async test() {
      const fnErr = () => { throw new Error("Oops"); };
      const [wrapped] = delayAll([fnErr], 50);
      let caught = false;
      try {
        await wrapped();
      } catch (e) {
        caught = true;
        assert(e.message === "Oops", `Ожидалось "Oops", получено "${e.message}"`);
      }
      assert(caught, "Ожидалась ошибка, но её не было");
    },
  },
];

// Запуск тестов
(async () => {
  console.log("Запуск тестов для delayAll...");
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
    console.log("🎉 Все тесты для delayAll пройдены успешно.");
  }
})();
