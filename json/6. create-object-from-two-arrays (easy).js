/*
  LeetCode 2794. Create Object from Two Arrays

  Даны два массива keysArr и valuesArr. Необходимо вернуть новый объект obj,
  в котором каждая пара «ключ-значение» формируется из элементов keysArr[i] и valuesArr[i].

  При появлении дублирующегося ключа (после преобразования в строку) учитывать только
  его первое вхождение и игнорировать все последующие.

  Если элемент массива keysArr не является строкой, он должен быть приведён
  к строке с помощью String().

  Примеры:
    1) keysArr = ["a", "b", "c"], valuesArr = [1, 2, 3]
       // возвращаемый объект: { "a": 1, "b": 2, "c": 3 }

    2) keysArr = ["1", 1, false], valuesArr = [4, 5, 6]
       // после String(): ["1", "1", "false"]
       // первое вхождение ключа "1" связывается со значением 4,
       // для второго "1" пара не создаётся,
       // а ключ "false" связывается со значением 6
       // возвращаемый объект: { "1": 4, "false": 6 }

    3) keysArr = [], valuesArr = []
       // пустые массивы → возвращается пустой объект {}

  Ограничения:
    - keysArr и valuesArr — корректные JSON-массивы
    - 2 ≤ длина JSON.stringify(keysArr), JSON.stringify(valuesArr) ≤ 5·10^5
    - keysArr.length === valuesArr.length
*/


function createObject(keysArr, valuesArr) {
  const obj = {};

  for (let i = 0; i < keysArr.length; ++i) {
    const key = String(keysArr[i]);

    if (Object.hasOwn(obj, key)) continue;

    obj[key] = valuesArr[i];
  }

  return obj;
}











// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции createObject.
*/
const tests = [
  {
    description: "Простая маппинг строковых ключей",
    async test() {
      const keys = ["a", "b", "c"];
      const values = [1, 2, 3];
      const result = createObject(keys, values);
      const expected = { a: 1, b: 2, c: 3 };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Игнорирование повторного ключа",
    async test() {
      const keys = ["x", "y", "x", "z"];
      const values = [10, 20, 30, 40];
      const result = createObject(keys, values);
      const expected = { x: 10, y: 20, z: 40 };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Коллизия строкового и числового ключа",
    async test() {
      const keys = ["1", 1, 2];
      const values = [100, 200, 300];
      const result = createObject(keys, values);
      const expected = { "1": 100, "2": 300 };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Нестроковые ключи: boolean, null, undefined",
    async test() {
      const keys = [true, false, null, undefined];
      const values = ["T", "F", "N", "U"];
      const result = createObject(keys, values);
      const expected = { true: "T", false: "F", null: "N", undefined: "U" };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Ключ-объект приводит к [object Object], дубликаты фильтруются",
    async test() {
      const objKey = { a: 1 };
      const keys = [objKey, objKey];
      const values = [5, 6];
      const result = createObject(keys, values);
      const expected = { "[object Object]": 5 };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Пустые массивы на входе — пустой объект",
    async test() {
      const result = createObject([], []);
      const expected = {};
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Пустая строка и пустой массив приводят к одному ключу",
    async test() {
      const keys = ["", []];
      const values = [7, 8];
      const result = createObject(keys, values);
      const expected = { "": 7 };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для createObject...");
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
    console.log("🎉 Все тесты для createObject завершены успешно.");
  }
})();
