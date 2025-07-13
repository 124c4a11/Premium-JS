/**
 * 2690. Infinite Method Object
 *
 * Описание задачи:
 * Напишите функцию, которая возвращает объект с бесконечными методами.
 * Объект с бесконечными методами определяется как объект, позволяющий вызывать любой метод,
 * при этом вызов любого метода всегда возвращает его имя в виде строки.
 *
 * Пример 1:
 * Ввод:  метод = "abc123"
 * Вывод: "abc123"
 *
 * Объяснение:
 * Если создать объект через функцию createInfiniteObject(), то вызов:
 *   obj["abc123"]();
 * должен вернуть "abc123", то есть имя вызванного метода.
 *
 * Пример 2:
 * Ввод:  метод = ".-qw73n|^2It"
 * Вывод: ".-qw73n|^2It"
 *
 * Объяснение:
 * Независимо от имени вызываемого метода, объект должен вернуть именно его.
 *
 * Ограничения:
 * 0 <= длина строки метода <= 1000
 *
 * Пример реализации на JavaScript/TypeScript:
 *
 * // Пример использования:
 * const obj = createInfiniteObject();
 * console.log(obj.abc123()); // Выведет: "abc123"
 */


function createInfiniteObject() {
  return new Proxy({}, {
    get(_, prop) {
      // Обработка специальных символов, например, Symbol.toPrimitive
      if (prop === Symbol.toPrimitive) {
        return () => "[object InfiniteMethodObject]";
      }
      // Для любого свойства возвращаем функцию, которая возвращает его имя в виде строки
      return () => prop.toString();
    }
  });
}




// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/* Тестовые кейсы для функции createInfiniteObject */
const tests = [
  {
    description: "Вызов метода через точечную нотацию",
    async test() {
      const obj = createInfiniteObject();
      const result = obj.abc123();
      assert(
        result === "abc123",
        `Ожидалось "abc123", получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Вызов метода через квадратные скобки",
    async test() {
      const obj = createInfiniteObject();
      const result = obj[".-qw73n|^2It"]();
      assert(
        result === ".-qw73n|^2It",
        `Ожидалось ".-qw73n|^2It", получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Проверка нескольких методов",
    async test() {
      const obj = createInfiniteObject();
      const result1 = obj.foo();
      const result2 = obj.bar();
      assert(
        result1 === "foo",
        `Ожидалось "foo", получено ${JSON.stringify(result1)}`
      );
      assert(
        result2 === "bar",
        `Ожидалось "bar", получено ${JSON.stringify(result2)}`
      );
    },
  },
  {
    description: "Вызов метода с числовым ключом",
    async test() {
      const obj = createInfiniteObject();
      const result = obj[42]();
      assert(
        result === "42",
        `Ожидалось "42", получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Проверка работы Symbol.toPrimitive",
    async test() {
      const obj = createInfiniteObject();
      const primitiveValue = obj[Symbol.toPrimitive]("string");
      assert(
        primitiveValue === "[object InfiniteMethodObject]",
        `Ожидалось "[object InfiniteMethodObject]", получено ${JSON.stringify(primitiveValue)}`
      );
    },
  },
  {
    description: "Вызов метода с пользовательским символом",
    async test() {
      const obj = createInfiniteObject();
      const customSymbol = Symbol("custom");
      const result = obj[customSymbol]();
      assert(
        result === customSymbol.toString(),
        `Ожидалось ${customSymbol.toString()}, получено ${JSON.stringify(result)}`
      );
    },
  },
];

/* Запуск тестов в асинхронном режиме */
(async () => {
  console.log("Запуск тестов для createInfiniteObject...");
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
    console.log("🎉 Все тесты для createInfiniteObject завершены успешно.");
  }
})();
