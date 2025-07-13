/**
 * LeetCode 2633. Convert Object to JSON String
 * 
 * Описание:
 * Дан объект. Верните корректную JSON-строку, представляющую этот объект.
 * Можно предполагать, что объект содержит только строки, целые числа, массивы,
 * объекты, логические значения и null.
 * 
 * Возвращаемая строка не должна содержать лишних пробелов.
 * Порядок ключей должен быть таким же, как в массиве, возвращаемом методом Object.keys().
 * 
 * Решите задачу, не используя встроенный метод JSON.stringify.
 * 
 * Примеры:
 * 
 * Пример 1:
 * Ввод:  object = {"y":1,"x":2}
 * Вывод: {"y":1,"x":2}
 * Объяснение: Верните JSON-представление объекта. Обратите внимание, что порядок ключей
 *              должен соответствовать порядку, возвращаемому методом Object.keys().
 * 
 * Пример 2:
 * Ввод:  object = {"a":"str","b":-12,"c":true,"d":null}
 * Вывод: {"a":"str","b":-12,"c":true,"d":null}
 * Объяснение: Примитивы JSON — строки, числа, логические значения и null.
 * 
 * Пример 3:
 * Ввод:  object = {"key":{"a":1,"b":[{},null,"Hello"]}}
 * Вывод: {"key":{"a":1,"b":[{},null,"Hello"]}}
 * Объяснение: Объекты и массивы могут содержать другие объекты и массивы.
 * 
 * Пример 4:
 * Ввод:  object = true
 * Вывод: true
 * Объяснение: Примитивные значения также являются допустимыми входными данными.
 * 
 * Ограничения:
 * - Объект может содержать строки, целые числа, логические значения, массивы, объекты и null.
 * - 1 <= длина строки JSON.stringify(object) <= 10^5.
 */


/**
 * Функция jsonStringify рекурсивно преобразует переданное значение в JSON-строку.
 * Поддерживаются следующие типы: null, number, boolean, string, Array, Object.
 *
 * @param {any} value - входное значение для преобразования
 * @return {string} - JSON-представление входного значения
 */
function jsonStringify(value) {
  // Базовый случай: если значение равно null, возвращаем строку "null"
  if (value === null) return 'null';

  // Если значение имеет тип number (число) или boolean (логическое),
  // преобразуем его в строку с помощью String() и возвращаем.
  if (
    typeof value === 'number'
    || typeof value === 'boolean'
  ) return String(value);

  // Если значение является строкой, оборачиваем его в двойные кавычки,
  // чтобы соответствовать формату JSON для строк.
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  // Если значение является массивом:
  // В первую очередь обрабатываем массивы, так как JavaScript массивы являются объектами, поэтому если поменять порядок проверок
  // и сначала выполнить проверку if (typeof value === 'object'), то массивы могут попасть в эту ветку,
  // что приведёт к некорректной обработке
  if (Array.isArray(value)) {
    // Рекурсивно обрабатываем каждый элемент массива, вызывая jsonStringify для него,
    // получая массив его строковых представлений.
    // Затем объединяем их через запятую и заключаем получившуюся строку в квадратные скобки.
    const elements = value.map(
      (item) => jsonStringify(item)
    ); // рекурсивное преобразование каждого элемента

    return `[${elements.toString()}]`;
  }

  // Если значение является объектом (не массивом, так как массивы уже обработаны):
  if (typeof value === 'object') {
    // Для каждого ключа создаём строку вида "ключ":значение,
    // где ключ оборачивается в двойные кавычки,
    // а значение рекурсивно преобразуется с помощью jsonStringify.
    const keyValuePairs = [];
    for (const key in value) {
      if (!Object.hasOwn(value, key)) continue;

      keyValuePairs.push(
        `"${key}":${jsonStringify(value[key])}`
      );
    }

    // Объединяем все пары через запятую и заключаем итоговую строку в фигурные скобки.
    return `{${keyValuePairs.toString()}}`;
  }

  // Если значение не соответствует ни одному из допустимых типов (это не должно случаться по условию),
  // возвращаем пустую строку.
  return '';
}






// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Тестовые кейсы для функции jsonStringify.
const tests = [
  {
    description: "Проверка null",
    async test() {
      const result = jsonStringify(null);
      const expected = "null";
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка числа",
    async test() {
      const result = jsonStringify(123);
      const expected = "123";
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка логических значений",
    async test() {
      const resultTrue = jsonStringify(true);
      const expectedTrue = "true";
      assert(resultTrue === expectedTrue, `Ожидалось "${expectedTrue}", получено "${resultTrue}"`);

      const resultFalse = jsonStringify(false);
      const expectedFalse = "false";
      assert(resultFalse === expectedFalse, `Ожидалось "${expectedFalse}", получено "${resultFalse}"`);
    },
  },
  {
    description: "Проверка строки",
    async test() {
      const result = jsonStringify("Hello");
      const expected = `"Hello"`;
      assert(result === expected, `Ожидалось ${expected}, получено ${result}`);
    },
  },
  {
    description: "Проверка пустого массива",
    async test() {
      const result = jsonStringify([]);
      const expected = "[]";
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка массива с примитивными значениями",
    async test() {
      const input = [1, "a", false];
      const result = jsonStringify(input);
      const expected = `[1,"a",false]`;
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка пустого объекта",
    async test() {
      const result = jsonStringify({});
      const expected = "{}";
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка объекта с несколькими ключами",
    async test() {
      const input = { y: 1, x: 2 };
      const result = jsonStringify(input);
      const expected = `{"y":1,"x":2}`;
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка вложенных объектов и массивов",
    async test() {
      const input = {
        a: { b: [null, true, "test"] },
        c: "hello"
      };
      const result = jsonStringify(input);
      const expected = `{"a":{"b":[null,true,"test"]},"c":"hello"}`;
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
  {
    description: "Проверка сложной структуры",
    async test() {
      const input = {
        name: "Alice",
        age: 30,
        isStudent: false,
        scores: [10, 20, 30],
        details: {
          address: null,
          hobbies: ["reading", "swimming"]
        }
      };
      const result = jsonStringify(input);
      const expected = `{"name":"Alice","age":30,"isStudent":false,"scores":[10,20,30],"details":{"address":null,"hobbies":["reading","swimming"]}}`;
      assert(result === expected, `Ожидалось "${expected}", получено "${result}"`);
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для jsonStringify...");
  let hasErrors = false;
  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test(); // Здесь тесты асинхронные, хотя функция работает синхронно
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
    console.log("🎉 Все тесты для jsonStringify завершены успешно.");
  }
})();
