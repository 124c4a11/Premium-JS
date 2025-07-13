/**
 * Задача: LeetCode 2775. Undefined to Null
 * 
 * Напишите функцию undefinedToNull, которая принимает
 * глубоко вложенный объект или массив obj.
 * 
 * Цель этой функции — обойти всю структуру obj, и везде,
 * где найдено значение undefined, заменить его на null.
 * 
 * Значения undefined обрабатываются иначе, чем null при
 * преобразовании объектов в JSON-строку с помощью
 * JSON.stringify(). Эта функция помогает избежать
 * неожиданных ошибок при сериализации данных.
 *
 * Пример 1:
 * Input:  obj = { "a": undefined, "b": 3 }
 * Output: { "a": null,      "b": 3 }
 * Объяснение: значение obj.a изменено с undefined на null.
 *
 * Пример 2:
 * Input:  obj = { "a": undefined, "b": ["a", undefined] }
 * Output: { "a": null,      "b": ["a", null] }
 * Объяснение: значения obj.a и obj.b[1] изменены
 * с undefined на null.
 *
 * Ограничения:
 * - obj является валидным JSON-объектом или массивом.
 * - 2 <= JSON.stringify(obj).length <= 10^5.
 */


function undefinedToNull(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = undefinedToNull(obj[key]);
    }

    if (obj[key] === undefined) {
      obj[key] = null;
    }
  }

  return obj;
}










// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Простое свойство undefined преобразуется в null",
    async test() {
      const original = { a: undefined, b: 2 };
      const result = undefinedToNull(original);
      const expected = { a: null, b: 2 };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
      assert(
        result === original,
        "Функция должна мутировать и возвращать тот же объект"
      );
    },
  },

  {
    description: "Обработка вложенного объекта с несколькими уровнями",
    async test() {
      const original = { x: { y: { z: undefined } }, k: undefined };
      const result = undefinedToNull(original);
      const expected = { x: { y: { z: null } }, k: null };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },

  {
    description: "Преобразование undefined в массивах и вложенных объектах",
    async test() {
      const original = {
        arr: [1, undefined, 3, { nested: undefined, keep: 5 }],
      };
      const result = undefinedToNull(original);
      const expected = {
        arr: [1, null, 3, { nested: null, keep: 5 }],
      };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },

  {
    description: "Объект без undefined остаётся без изменений",
    async test() {
      const original = { a: 1, b: false, c: 0, d: "" };
      const copy = JSON.stringify(original);
      const result = undefinedToNull(original);

      assert(
        JSON.stringify(result) === copy,
        `Ожидалось ${copy}, получено ${JSON.stringify(result)}`
      );
      assert(
        result === original,
        "Для объекта без undefined должна возвращаться та же ссылка"
      );
    },
  },

  {
    description: "Преобразование пустого объекта",
    async test() {
      const original = {};
      const result = undefinedToNull(original);
      const expected = {};

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось пустой объект, получено ${JSON.stringify(result)}`
      );
    },
  },

  {
    description: "Прямой вызов на массиве",
    async test() {
      const original = [undefined, { a: undefined }, 2];
      const result = undefinedToNull(original);
      const expected = [null, { a: null }, 2];

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
      assert(
        result === original,
        "При передаче массива возвращается тот же массив"
      );
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для undefinedToNull...");
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
    console.log("🎉 Все тесты для undefinedToNull пройдены успешно.");
  }
})();
