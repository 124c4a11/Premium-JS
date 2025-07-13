/**
 * LeetCode 2628. JSON Deep Equal
 *
 * Описание:
 * Даны два значения `o1` и `o2`. Необходимо определить, являются ли эти два значения «глубоко равными».
 * При этом следует учитывать следующие условия:
 *
 * 1. Примитивные типы:
 *    Если оба значения являются примитивами (например, числа, строки, логические значения, `null`),
 *    то они считаются глубоко равными, если выполняется строгое сравнение (`===`).
 *
 * 2. Массивы:
 *    Если оба значения являются массивами, то они считаются глубоко равными, если:
 *      - Массивы имеют одинаковую длину.
 *      - Каждый элемент, расположенный на одинаковых позициях в двух массивах, также является глубоко равным
 *        (проверка выполняется рекурсивно).
 *
 * 3. Объекты:
 *    Если оба значения являются объектами (и не являются массивами), то они считаются глубоко равными, если:
 *      - Объекты имеют одинаковый набор ключей (порядок ключей не важен).
 *      - Для каждого ключа значение, ассоциированное с ним в одном объекте, является глубоко равным
 *        соответствующему значению в другом объекте (сравнение выполняется рекурсивно).
 *
 * Также обратите внимание, что два значения, которые удовлетворяют условию строгого равенства (`===`), должны быть признаны глубоко равными.
 *
 * Ограничения:
 * - 1 <= JSON.stringify(o1).length <= 10^5
 * - 1 <= JSON.stringify(o2).length <= 10^5
 * - maxNestingDepth <= 1000
 *
 * Важно:
 * Решение задачи необходимо реализовать без использования внешних библиотек или готовых функций для глубокого сравнения,
 * таких как `_.isEqual()` из lodash.
 *
 * Примеры:
 * Пример 1:
 *   Ввод:  o1 = {"x":1, "y":2} и o2 = {"x":1, "y":2}
 *   Вывод: true
 *   Объяснение: Ключи и соответствующие значения в обоих объектах совпадают.
 *
 * Пример 2:
 *   Ввод: o1 = {"y":2, "x":1} и o2 = {"x":1, "y":2}
 *   Вывод: true
 *   Объяснение: Хотя порядок ключей различается, фактические пары ключ-значение совпадают.
 *
 * Пример 3:
 *   Ввод: o1 = {"x":null, "L":[1,2,3]} и o2 = {"x":null, "L":["1","2","3"]}
 *   Вывод: false
 *   Объяснение: Массив чисел не равен массиву строк, так как типы элементов различаются.
 *
 * Пример 4:
 *   Ввод: o1 = true и o2 = false
 *   Вывод: false
 *   Объяснение: true !== false.
 *
 * Подсказка:
 * Реализация задачи требует применения рекурсивного подхода для проверки глубокого сравнения, что обеспечивает корректное
 * сравнение даже вложенных структур данных.
 */


function deepEqual(o1, o2) {
  // Если значения абсолютно равны (включая примитивы и
  // одинаковые ссылки)
  // Оператор === сравнивает и тип, и значение:
  //  - Для примитивов (number, string, boolean, undefined,
  //    symbol) это полное равенство.
  //  - Для объектов/массивов — проверка того, указывают ли
  //    ссылки на один и тот же объект.
  // Этот «быстрый путь» сразу обрабатывает все тривиальные
  // случаи.
  if (o1 === o2) return true;

  // Если типы отличаются, значения точно не равны
  if (typeof o1 !== typeof o2) return false;

  // Ловушка JS: typeof null === 'object'. 
  // Но если бы оба были null, мы бы уже вышли на предыдущих
  // проверках. Раз только один — null, глубокого
  // равенства нет.
  if (o1 === null || o2 === null) return false;

  // Обработка массивов
  // В первую очередь обрабатываем массивы, так как
  // JavaScript массивы являются объектами, поэтому если
  // поменять порядок проверок и сначала выполнить проверку
  // if (typeof o1 === 'object'), то массивы могут попасть в
  // эту ветку, что приведёт к некорректной обработке
  if (Array.isArray(o1)) {

    // Если o1 – массив, а o2 – нет, или длины массивов не равны, возвращаем false
    if (!Array.isArray(o2)) return false;
    if (o1.length !== o2.length) return false;

    // Рекурсивно сравниваем каждый элемент массива
    for (let i = 0; i < o1.length; i++) {
      if (!deepEqual(o1[i], o2[i])) return false;
    }

    // Все элементы совпали на этом уровне — массивы равны.
    return true;
  }

  // Обработка объектов (которые не являются массивами)
  if (typeof o1 === 'object') {
    // Если один из объектов является массивом, а другой – нет, они не равны
    if (Array.isArray(o2)) return false;

    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    // Если количество ключей разное, объекты не равны
    if (keys1.length !== keys2.length) return false;

    // Для каждого ключа проверяем наличие его в обоих объектах
    // и рекурсивное сравнение значений этого ключа
    for (const key of keys1) {
      // При использовании Object.prototype.hasOwnProperty.call(o2, key) мы заботимся о том, чтобы вызвать проверку наличия 
      // собственного свойства именно у объекта o2, используя оригинальный метод hasOwnProperty, определённый в прототипе Object.
      // Это гарантирует корректную работу даже в случаях, когда:
      //  1. Метод может быть переопределён: Если в объекте o2 имеется собственное свойство с именем hasOwnProperty, оно может
      //     замещать стандартный метод. В таком случае вызов o2.hasOwnProperty(key) может привести к неожиданным результатам или
      //     даже ошибке, если это свойство не является функцией.
      //  2. Объект без прототипа: При создании объекта с использованием Object.create(null) объект не наследует никаких свойств,
      //     в том числе hasOwnProperty. Вызов o2.hasOwnProperty(key) тогда приведёт к ошибке, так как метода не существует.
      //     Использование Object.prototype.hasOwnProperty.call(o2, key) гарантирует доступ к методу из Object.prototype, независимо
      //     от того, есть ли он у конкретного объекта.
      // Так же можно использовать Object.hasOwn(o2, key) — это современное и удобное решение для проверки наличия собственного
      // свойства у объекта. Этот метод был добавлен в ECMAScript 2022.
      // Однако стоит учитывать, что если вам требуется поддержка более старых сред (например, некоторых устаревших браузеров),
      // где данный метод может отсутствовать, тогда более универсальным вариантом останется использование Object.prototype.
      // hasOwnProperty.call(o2, key).
      if (!Object.prototype.hasOwnProperty.call(o2, key)) return false;
      if (!deepEqual(o1[key], o2[key])) return false;
    }

    // Все ключи найдены и все их значения совпали — объекты
    // равны.
    return true;
  }

  // Если ни одно из условий не выполнено, возвращаем false
  // Попали сюда, когда оба значения одного типа, не null,
  // не массивы, не «обычные» объекты.
  // Это функции, либо символы, либо другие экзотические
  // типы — считаем их неравными.
  return false;
}








// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции deepEqual (дополненные).
  Перед запуском убедитесь, что deepEqual объявлена в этом контексте.
*/
const tests = [
  {
    description: "Равные числа (примитивы)",
    async test() {
      assert(
        deepEqual(5, 5) === true,
        `Ожидалось true, получено ${deepEqual(5, 5)}`
      );
    },
  },
  {
    description: "Неравные числа",
    async test() {
      assert(
        deepEqual(5, 6) === false,
        `Ожидалось false, получено ${deepEqual(5, 6)}`
      );
    },
  },
  {
    description: "Равные строки",
    async test() {
      assert(
        deepEqual("test", "test") === true,
        `Ожидалось true, получено ${deepEqual("test", "test")}`
      );
    },
  },
  {
    description: "Примитивы разного типа (число и строка)",
    async test() {
      assert(
        deepEqual(5, "5") === false,
        `Ожидалось false, получено ${deepEqual(5, "5")}`
      );
    },
  },
  {
    description: "Равные булевы значения",
    async test() {
      assert(
        deepEqual(true, true) === true,
        `Ожидалось true, получено ${deepEqual(true, true)}`
      );
    },
  },
  {
    description: "Неравные булевы значения",
    async test() {
      assert(
        deepEqual(true, false) === false,
        `Ожидалось false, получено ${deepEqual(true, false)}`
      );
    },
  },
  {
    description: "null и null",
    async test() {
      assert(
        deepEqual(null, null) === true,
        `Ожидалось true, получено ${deepEqual(null, null)}`
      );
    },
  },
  {
    description: "null и объект",
    async test() {
      assert(
        deepEqual(null, {}) === false,
        `Ожидалось false, получено ${deepEqual(null, {})}`
      );
    },
  },
  {
    description: "undefined и undefined",
    async test() {
      assert(
        deepEqual(undefined, undefined) === true,
        `Ожидалось true, получено ${deepEqual(undefined, undefined)}`
      );
    },
  },
  {
    description: "Объект с undefined свойством vs. пустой объект",
    async test() {
      assert(
        deepEqual({ a: undefined }, {}) === false,
        `Ожидалось false, получено ${deepEqual({ a: undefined }, {})}`
      );
    },
  },
  {
    description: "Простые равные массивы",
    async test() {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      assert(
        deepEqual(a, b) === true,
        `Ожидалось true, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Массивы с разными элементами",
    async test() {
      const a = [1, 2, 3];
      const b = [1, 2, 4];
      assert(
        deepEqual(a, b) === false,
        `Ожидалось false, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Массивы разной длины",
    async test() {
      const a = [1, 2, 3];
      const b = [1, 2];
      assert(
        deepEqual(a, b) === false,
        `Ожидалось false, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Пустые массивы",
    async test() {
      assert(
        deepEqual([], []) === true,
        `Ожидалось true, получено ${deepEqual([], [])}`
      );
    },
  },
  {
    description: "Вложенные массивы равны",
    async test() {
      const a = [1, [2, 3], 4];
      const b = [1, [2, 3], 4];
      assert(
        deepEqual(a, b) === true,
        `Ожидалось true, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Массив с объектами (равны)",
    async test() {
      const a = [{ a: [1, 2] }, { b: 3 }];
      const b = [{ a: [1, 2] }, { b: 3 }];
      assert(
        deepEqual(a, b) === true,
        `Ожидалось true, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Массив с объектами (не равны)",
    async test() {
      const a = [{ a: [1, 2] }, { b: 3 }];
      const b = [{ a: [1, 2] }, { b: 4 }];
      assert(
        deepEqual(a, b) === false,
        `Ожидалось false, получено ${deepEqual(a, b)}`
      );
    },
  },
  {
    description: "Простые равные объекты (одинаковый порядок ключей)",
    async test() {
      const o1 = { a: 1, b: 2 };
      const o2 = { a: 1, b: 2 };
      assert(
        deepEqual(o1, o2) === true,
        `Ожидалось true, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Простые равные объекты (разный порядок ключей)",
    async test() {
      const o1 = { a: 1, b: 2 };
      const o2 = { b: 2, a: 1 };
      assert(
        deepEqual(o1, o2) === true,
        `Ожидалось true, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Объекты с разными значениями",
    async test() {
      const o1 = { a: 1, b: 2 };
      const o2 = { a: 1, b: 3 };
      assert(
        deepEqual(o1, o2) === false,
        `Ожидалось false, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Объект с дополнительным свойством",
    async test() {
      const o1 = { a: 1 };
      const o2 = { a: 1, b: 2 };
      assert(
        deepEqual(o1, o2) === false,
        `Ожидалось false, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Пустые объекты",
    async test() {
      assert(
        deepEqual({}, {}) === true,
        `Ожидалось true, получено ${deepEqual({}, {})}`
      );
    },
  },
  {
    description: "Вложенные объекты равны",
    async test() {
      const o1 = { a: 1, b: { c: 2, d: [3, 4] } };
      const o2 = { a: 1, b: { c: 2, d: [3, 4] } };
      assert(
        deepEqual(o1, o2) === true,
        `Ожидалось true, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Неравные вложенные объекты",
    async test() {
      const o1 = { a: 1, b: { c: 2, d: [3, 4] } };
      const o2 = { a: 1, b: { c: 2, d: [3, 5] } };
      assert(
        deepEqual(o1, o2) === false,
        `Ожидалось false, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Вложенные объекты с разными значениями",
    async test() {
      const o1 = { a: { b: 2 } };
      const o2 = { a: { b: 3 } };
      assert(
        deepEqual(o1, o2) === false,
        `Ожидалось false, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Объект против массива",
    async test() {
      assert(
        deepEqual({}, []) === false,
        `Ожидалось false, получено ${deepEqual({}, [])}`
      );
    },
  },
  {
    description: "Функции всегда не равны",
    async test() {
      const f1 = () => {};
      const f2 = () => {};
      assert(
        deepEqual(f1, f2) === false,
        `Ожидалось false, получено ${deepEqual(f1, f2)}`
      );
    },
  },
  {
    description: "Разные символы",
    async test() {
      const s1 = Symbol("a");
      const s2 = Symbol("a");
      assert(
        deepEqual(s1, s2) === false,
        `Ожидалось false, получено ${deepEqual(s1, s2)}`
      );
    },
  },
  {
    description: "Object.create(null) – равные объекты без прототипа",
    async test() {
      const o1 = Object.create(null);
      o1.a = 1;
      const o2 = Object.create(null);
      o2.a = 1;
      assert(
        deepEqual(o1, o2) === true,
        `Ожидалось true, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Object.create(null) – неравные объекты без прототипа",
    async test() {
      const o1 = Object.create(null);
      o1.a = 1;
      const o2 = Object.create(null);
      o2.a = 2;
      assert(
        deepEqual(o1, o2) === false,
        `Ожидалось false, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "Сравнение объектов с унаследованными свойствами",
    async test() {
      function F() { this.a = 1; }
      F.prototype.b = 2;
      const o1 = new F();
      const o2 = { a: 1 };
      assert(
        deepEqual(o1, o2) === true,
        `Ожидалось true, получено ${deepEqual(o1, o2)}`
      );
    },
  },
  {
    description: "NaN против NaN",
    async test() {
      assert(
        deepEqual(NaN, NaN) === false,
        `Ожидалось false, получено ${deepEqual(NaN, NaN)}`
      );
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для deepEqual...");
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
    console.log("🎉 Все тесты для deepEqual завершены успешно.");
  }
})();
