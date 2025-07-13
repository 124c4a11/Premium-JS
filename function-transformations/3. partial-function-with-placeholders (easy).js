/*
  LeetCode 2797. Partial Function with Placeholders

  Условие задачи:
  Дана функция fn и массив args. Нужно вернуть новую функцию partialFn.

  При вызове partialFn(...restArgs):
  - Все плейсхолдеры "_" в args заменяются на значения из restArgs по порядку (начиная с restArgs[0]).
  - Оставшиеся после замены значения из restArgs добавляются в конец массива args.
  - Затем fn вызывается с элементами получившегося массива args как отдельными аргументами и возвращает свой результат.

  Примеры:

  Пример 1:
  Input: fn = (...args) => args, args = [2, 4, 6], restArgs = [8, 10]  
  Output: [2, 4, 6, 8, 10]  
  Объяснение:
  const partialFn = partial(fn, args);  
  const result = partialFn(...restArgs); // [2, 4, 6, 8, 10]

  Пример 2:
  Input: fn = (...args) => args, args = [1, 2, "_", 4, "_", 6], restArgs = [3, 5]  
  Output: [1, 2, 3, 4, 5, 6]  
  Объяснение:
  const partialFn = partial(fn, args);  
  const result = partialFn(...restArgs); // [1, 2, 3, 4, 5, 6]

  Пример 3:
  Input: fn = (a, b, c) => b + a - c, args = ["_", 5], restArgs = [5, 20]  
  Output: -10  
  Объяснение:
  const partialFn = partial(fn, args);  
  const result = partialFn(...restArgs); // -10

  Ограничения:
  - fn — функция
  - args и restArgs — корректные JSON-массивы
  - 1 <= args.length <= 5 * 10^4
  - 1 <= restArgs.length <= 5 * 10^4
  - число плейсхолдеров "_" не превышает restArgs.length
*/



function partial(fn, args) {

  // возвращаем новую функцию-обёртку, принимающую
  // оставшиеся аргументы
  return function (...restArgs) {

    // счётчик для прохода по restArgs
    let i = 0;

    // проходим по всем элементам массива args
    for (let j = 0; j < args.length; ++j) {

      // пропускаем элементы, которые не являются
      // плейсхолдерами '_'
      if (args[j] !== '_') continue;

      // заменяем плейсхолдер на следующий аргумент
      // из restArgs
      args[j] = restArgs[i++];
    }

    // если после подстановки плейсхолдеров остались
    // аргументы, добавляем их в конец
    while (i < restArgs.length) {
      args.push(restArgs[i++]);
    }
    
    // вызываем исходную функцию fn с контекстом
    // текущего вызова и собранным списком args
    return fn.apply(this, args);
  };
};









// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Нет плейсхолдеров — просто добавляем все restArgs в конец",
    async test() {
      const fn = (...args) => args;
      const partialFn = partial(fn, [1, 2, 3]);
      const result = partialFn(4, 5);
      const expected = [1, 2, 3, 4, 5];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Все аргументы — плейсхолдеры, ровно столько же restArgs",
    async test() {
      const fn = (...args) => args;
      const partialFn = partial(fn, ["_", "_", "_"]);
      const result = partialFn("a", "b", "c");
      const expected = ["a", "b", "c"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Частичная замена и остаток restArgs в конец",
    async test() {
      const fn = (...args) => args;
      const partialFn = partial(fn, ["_", 2, "_"]);
      const result = partialFn(1, 3, 4);
      const expected = [1, 2, 3, 4];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Плейсхолдеры на краях массива",
    async test() {
      const fn = (...args) => args;
      const partialFn = partial(fn, ["_", "X", "_"]);
      const result = partialFn("A", "B");
      const expected = ["A", "X", "B"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Функция с именованными параметрами, пример из условия",
    async test() {
      const fn = (a, b, c) => b + a - c;
      const partialFn = partial(fn, ["_", 5]);
      const result = partialFn(5, 20);
      const expected = -10;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    }
  },
  {
    description: "Работа со строками",
    async test() {
      const fn = (...args) => args.join("");
      const partialFn = partial(fn, ["Hello", "_", "!"]);
      const result = partialFn("World");
      const expected = "HelloWorld!";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Смешанные типы — числа, строки, булевы значения",
    async test() {
      const fn = (...args) => args;
      const partialFn = partial(fn, [true, "_", null, "_"]);
      const result = partialFn(false, 42);
      const expected = [true, false, null, 42];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Суммирование четырёх чисел через замыкание",
    async test() {
      const sum4 = (a, b, c, d) => a + b + c + d;
      const partialFn = partial(sum4, ["_", 2, "_", 4]);
      const result = partialFn(1, 3);
      const expected = 10; // 1 + 2 + 3 + 4
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для partial...");
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
    console.log("🎉 Все тесты для partial завершены успешно.");
  }
})();
