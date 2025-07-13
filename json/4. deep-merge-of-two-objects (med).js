/**
 * LeetCode 2755. Deep Merge of Two Objects
 *
 * Условие:
 * Даны два значения obj1 и obj2, вернуть результат их глубокой слияния.
 *
 * Правила глубокого слияния:
 * - Если оба значения — объекты, результирующий объект содержит все ключи из обоих.
 *   • Если ключ есть в обоих объектах, их значения сливаются рекурсивно.  
 *   • Иначе ключ и его значение просто добавляются в результат.
 *
 * - Если оба значения — массивы, результирующий массив имеет длину максимально длинного массива.
 *   • Элементы по одинаковым индексам сливаются по тем же правилам, что и объекты.
 *   • Если индекс есть только в одном из массивов, его значение сохраняется без изменений.
 *
 * - Во всех остальных случаях (разные типы, примитивы и т.п.) результатом становится obj2.
 *
 * Предположение:
 * obj1 и obj2 получены через JSON.parse(), то есть это валидные JSON-значения.
 *
 * Примеры:
 * 1) obj1 = { "a": 1, "c": 3 }, obj2 = { "a": 2, "b": 2 }
 *    Результат: { "a": 2, "c": 3, "b": 2 }
 *
 * 2) obj1 = [{}, 2, 3], obj2 = [[], 5]
 *    Результат: [[], 5, 3]
 *
 * 3) obj1 = {
 *       "a": 1,
 *       "b": { "c": [1, [2, 7], 5], "d": 2 }
 *    },
 *    obj2 = {
 *       "a": 1,
 *       "b": { "c": [6, [6], [9]], "e": 3 }
 *    }
 *    Результат:
 *    {
 *      "a": 1,
 *      "b": {
 *        "c": [6, [6, 7], [9]],
 *        "d": 2,
 *        "e": 3
 *      }
 *    }
 *
 * 4) obj1 = true, obj2 = null
 *    Результат: null
 *
 * Ограничения:
 * - 1 <= JSON.stringify(obj1).length <= 5 * 10^5
 * - 1 <= JSON.stringify(obj2).length <= 5 * 10^5
 */


function deepMerge(obj1, obj2) {
  // Базовая проверка: если хотя бы один из аргументов не является «настоящим» объектом,
  // мы не можем слить их свойства. В этом случае возвращаем obj2, полностью заменяя obj1.
  if (!isObject(obj1) || !isObject(obj2)) return obj2;

  // Защита от слияния массива и объекта: если один аргумент — массив, а другой нет,
  // нет однозначного правила объединения, поэтому отдаем второй без изменений.
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return obj2;

  // Перебираем _все_ перечислимые ключи obj2.
  for (const key in obj2) {
    // Фильтруем унаследованные свойства:
    // берём оригинальный hasOwnProperty из Object.prototype и вызываем через call.
    // Причины:
    //  - obj2 может переопределить собственный метод hasOwnProperty,
    //    и прямой вызов obj2.hasOwnProperty(key) даст неверный результат.
    //  - obj2 может быть создан через Object.create(null),
    //    тогда у него вообще нет метода hasOwnProperty.
    // Вызов Object.prototype.hasOwnProperty.call гарантирует
    // корректную проверку на наличие собственнoго свойства.
    //
    // В современных браузерах вместо этого можно использовать:
    //   Object.hasOwn(obj2, key)
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) continue;

    // Для каждого ключа запускаем рекурсию:
    //  - Если obj1[key] и obj2[key] — объекты/массивы, мы спускаемся глубже.
    //  - Иначе просто перезаписываем obj1[key] значением obj2[key].
    obj1[key] = deepMerge(obj1[key], obj2[key]);
  }

  // Возвращаем модифицированный obj1, теперь содержащий объединённые свойства.
  return obj1;
}

function isObject(value) {
  // JavaScript: typeof null тоже «object», поэтому дополнительно проверяем != null.
  return typeof value === 'object' && value !== null;
}








// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции deepMerge.
  Перед запуском тестов убедитесь, что в этом контексте
  определена функция deepMerge(obj1, obj2).
*/
const tests = [
  {
    description: "Простое поверхностное слияние: перезапись и добавление свойства",
    async test() {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge(obj1, obj2);
      const expected = { a: 1, b: 3, c: 4 };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );

      // obj1 должен быть изменён так же, как и result
      assert(
        JSON.stringify(obj1) === JSON.stringify(expected),
        "obj1 должен содержать результат слияния"
      );
    }
  },

  {
    description: "Замена не-объектного свойства на объект",
    async test() {
      const obj1 = { x: 10 };
      const obj2 = { x: { y: 5 } };
      const result = deepMerge(obj1, obj2);
      const expected = { x: { y: 5 } };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Глубокое слияние вложенных объектов",
    async test() {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { c: 2 } };
      const result = deepMerge(obj1, obj2);
      const expected = { a: { b: 1, c: 2 } };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Несовпадение типов массива и объекта приводит к подстановке из obj2",
    async test() {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: { 0: "zero", 1: "one" } };
      const result = deepMerge(obj1, obj2);
      const expected = { arr: { 0: "zero", 1: "one" } };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Топ-уровневое слияние примитивов: возвращаем obj2",
    async test() {
      const obj1 = 42;
      const obj2 = { answer: 42 };
      const result = deepMerge(obj1, obj2);
      const expected = { answer: 42 };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Глубокое слияние массивов одинакового типа",
    async test() {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5];
      const result = deepMerge(arr1, arr2);
      const expected = [4, 5, 3];

      assert(
        Array.isArray(result),
        "Результат должен быть массивом"
      );
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Слияние null с объектом возвращает объект",
    async test() {
      const obj1 = null;
      const obj2 = { foo: "bar" };
      const result = deepMerge(obj1, obj2);
      const expected = { foo: "bar" };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },

  {
    description: "Сложная вложенная структура: массив объектов и новые элементы",
    async test() {
      const obj1 = { a: [{ b: 1 }, { c: 2 }] };
      const obj2 = { a: [{ b: 3 }, { d: 4 }, { e: 5 }] };
      const result = deepMerge(obj1, obj2);
      const expected = {
        a: [
          { b: 3 },
          { c: 2, d: 4 },
          { e: 5 }
        ]
      };

      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для deepMerge...");
  let hasErrors = false;

  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test();
      console.log(`✔️  Тест ${i + 1} пройден: ${tests[i].description}`);
    } catch (e) {
      hasErrors = true;
      console.error(`❌ Тест ${i + 1} не пройден: ${tests[i].description}`);
      console.error(e); // выводим саму ошибку с её стеком
    }
  }

  if (hasErrors) {
    console.error("❗ Некоторые тесты завершились с ошибкой.");
  } else {
    console.log("🎉 Все тесты для deepMerge завершены успешно.");
  }
})();
