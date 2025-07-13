/**
 * Задача: LeetCode 2776. Convert Callback Based Function to
 *         Promise Based Function
 * 
 * Напишите функцию promisify, которая принимает другую
 * функцию fn и преобразует функцию с колбэком в функцию,
 * возвращающую Promise.
 *
 * Передаваемая функция fn получает в качестве первого
 * аргумента колбэк, за которым следуют любые дополнительные
 * аргументы args.
 *
 * Функция promisify возвращает новую функцию, которая
 * возвращает Promise. Этот Promise должен:
 * - разрешаться значением, переданным первым параметром
 *   колбэка, если колбэк вызывается без ошибки;
 * - отклоняться ошибкой (error), переданной вторым
 *   аргументом колбэка, если колбэк вызывается с ошибкой.
 *
 * Пример функции, которую можно передать в promisify:
 *
 * function sum(callback, a, b) {
 *   if (a < 0 || b < 0) {
 *     const err = Error('a and b must be positive');
 *     callback(undefined, err);
 *   } else {
 *     callback(a + b);
 *   }
 * }
 *
 * Эквивалентная версия на Promise:
 *
 * async function sum(a, b) {
 *   if (a < 0 || b < 0) {
 *     throw Error('a and b must be positive');
 *   } else {
 *     return a + b;
 *   }
 * }
 *
 * Пример 1:
 *
 * Вход:
 * fn = (callback, a, b, c) => {
 *   callback(a * b * c);
 * }
 * args = [1, 2, 3]
 *
 * Вывод: {"resolved": 6}
 *
 * Объяснение:
 * const asyncFunc = promisify(fn);
 * asyncFunc(1, 2, 3).then(console.log); // 6
 *
 * Пример 2:
 *
 * Вход:
 * fn = (callback, a, b, c) => {
 *   callback(a * b * c, "Promise Rejected");
 * }
 * args = [4, 5, 6]
 *
 * Вывод: {"rejected": "Promise Rejected"}
 *
 * Объяснение:
 * const asyncFunc = promisify(fn);
 * asyncFunc(4, 5, 6).catch(console.log); // "Promise
 * Rejected"
 *
 * Ограничения:
 * 1 <= args.length <= 100
 * 0 <= args[i] <= 10^4
 */


function promisify(fn) {
  return function () {
    return new Promise((resolve, reject) => {
      fn((data, error) => {
        if (error) reject(error);
        else resolve(data);
      }, ...arguments);
    });
  };
}











// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Успешное разрешение без ошибки (умножение на 2)",
    async test() {
      function double(callback, x) {
        callback(x * 2);
      }
      const asyncDouble = promisify(double);
      const result = await asyncDouble(5);
      assert(result === 10, `Ожидалось 10, получено ${result}`);
    },
  },
  {
    description: "Отклонение при ошибке через второй аргумент колбэка",
    async test() {
      function fail(callback, x) {
        const err = new Error("fail");
        callback(undefined, err);
      }
      const asyncFail = promisify(fail);
      try {
        await asyncFail(123);
        assert(false, "Ожидалось отклонение, но промис был выполнен");
      } catch (e) {
        assert(e instanceof Error, "Ошибка должна быть объектом Error");
        assert(e.message === "fail", `Ожидалось "fail", получено "${e.message}"`);
      }
    },
  },
  {
    description: "Приоритет ошибки над данными, если оба переданы",
    async test() {
      function mixed(callback) {
        callback("data", "error!");
      }
      const asyncMixed = promisify(mixed);
      try {
        await asyncMixed();
        assert(false, "Ожидалось отклонение из-за ошибки");
      } catch (e) {
        assert(e === "error!", `Ожидалось "error!", получено "${e}"`);
      }
    },
  },
  {
    description: "Разрешение с undefined при отсутствии аргументов",
    async test() {
      function noArgs(callback) {
        callback();
      }
      const asyncNoArgs = promisify(noArgs);
      const result = await asyncNoArgs();
      assert(result === undefined, `Ожидалось undefined, получено ${result}`);
    },
  },
  {
    description: "Передача нескольких аргументов в исходную функцию",
    async test() {
      function collect(callback, a, b, c, d) {
        callback([a, b, c, d]);
      }
      const asyncCollect = promisify(collect);
      const result = await asyncCollect(1, 2, 3, 4);
      assert(
        Array.isArray(result) && result.length === 4 &&
        result.every((v, i) => v === i + 1),
        `Ожидалось [1,2,3,4], получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Асинхронный колбэк через setTimeout",
    async test() {
      function asyncSum(callback, a, b) {
        setTimeout(() => {
          callback(a + b);
        }, 10);
      }
      const asyncSumProm = promisify(asyncSum);
      const result = await asyncSumProm(7, 8);
      assert(result === 15, `Ожидалось 15, получено ${result}`);
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для promisify...");
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
    console.log("🎉 Все тесты для promisify пройдены успешно.");
  }
})();
