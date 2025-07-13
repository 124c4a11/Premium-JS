/**
 * 2692. Сделать объект неизменяемым
 *
 * Условие:
 *   Напишите функцию, которая принимает объект obj (или массив) и возвращает
 *   его новую неизменяемую версию. «Неизменяемый объект» — это объект, у
 *   которого любая попытка изменить свойство или элемент массива приводит к
 *   выбрасыванию строки с ошибкой.
 *
 * Типы ошибок:
 *   • Модификация свойства объекта:
 *       throw `Error Modifying: ${key}`
 *   • Модификация элемента массива:
 *       throw `Error Modifying Index: ${index}`
 *   • Вызов метода массива, изменяющего его содержимое:
 *       throw `Error Calling Method: ${methodName}`
 *
 *   Считайте, что единственные методы, мутирующие массив, это:
 *     ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse']
 *
 * Входные данные:
 *   obj — корректный JSON-объект или массив (результат JSON.parse()).
 *   Бросается строковый литерал, а не объект Error.
 *
 * Примеры:
 *   Пример 1:
 *     Вход:
 *       obj = { "x": 5 }
 *       fn = (o) => { o.x = 5; return o.x; }
 *     Выход:
 *       { value: null, error: "Error Modifying: x" }
 *     Пояснение:
 *       Любая попытка изменить свойство приводит к ошибке,
 *       даже если оно получает то же самое значение.
 *
 *   Пример 2:
 *     Вход:
 *       obj = [1, 2, 3]
 *       fn = (a) => { a[1] = {}; return a[2]; }
 *     Выход:
 *       { value: null, error: "Error Modifying Index: 1" }
 *
 *   Пример 3:
 *     Вход:
 *       obj = { "arr": [1, 2, 3] }
 *       fn = (o) => { o.arr.push(4); return 42; }
 *     Выход:
 *       { value: null, error: "Error Calling Method: push" }
 *
 *   Пример 4:
 *     Вход:
 *       obj = { "x": 2, "y": 2 }
 *       fn = (o) => Object.keys(o);
 *     Выход:
 *       { value: ["x","y"], error: null }
 *
 * Ограничения:
 *   2 <= JSON.stringify(obj).length <= 10^5
 */




/**
 * makeImmutable
 * --------------
 * Создаёт глубокую «неизменяемую» обёртку над объектом или массивом.
 * Любая попытка:
 *   – изменить свойство объекта → throw `Error Modifying: <key>`
 *   – изменить элемент массива   → throw `Error Modifying Index: <index>`
 *   – вызвать мутирующий метод массива → throw `Error Calling Method: <methodName>`
 * Работает рекурсивно для любых вложенных объектов/массивов.
 */
function makeImmutable(target) {
  // Набор методов, которые мутируют массив «по-умолчанию»
  const mutatingMethods = new Set([
    'pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'
  ]);

  // Кэш: каждому оригинальному объекту или массиву
  // соответствует ровно один Proxy, чтобы не создавать их бесконечно,
  // предотвращать циклы и сохранять identity
  const proxyCache = new WeakMap();

  /**
   * isArrayIndex
   * -------------
   * Определяет, что свойство prop на целевом target
   * является «числовым индексом массива».
   *
   * Причина:
   * – В Proxy-ловушках проп приходит всегда строкой.
   * – Мы хотим отличать:
   *     arr[1]  → «индекс»  → Error Modifying Index: 1
   *     arr.foo → «свойство»→ Error Modifying: foo
   *
   * Логика:
   *   +prop   : строка → число (либо NaN)
   *   String(...) : обратно в строку
   * Если результат совпал с исходной строкой, то строка была «чисто цифровой».
   */
  function isArrayIndex(target, prop) {
    return Array.isArray(target) && String(+prop) === prop;
  }

  function getErrorMessage(type, prop) {
    switch (type) {
      case 'method':
        return `Error Calling Method: ${prop}`;
      case 'index':
        return `Error Modifying Index: ${prop}`;
      case 'prop':
        return `Error Modifying: ${prop}`;
    }
  }

  /**
   * _freeze
   * -------
   * Рекурсивно оборачивает любой объект/массив в Proxy,
   * запрещающий модификацию и перехватывающий вызовы мутирующих методов.
   */
  function _freeze(obj) {
    // Примитивы и null возвращаем без изменений
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Если уже есть Proxy для этого объекта, возвращаем из кэша
    if (proxyCache.has(obj)) {
      return proxyCache.get(obj);
    }

    // Создаём Proxy-обёртку
    const proxy = new Proxy(obj, {
      /**
       * get — перехват операций чтения свойства:
       * – если это мутирующий метод массива, возвращаем функцию,
       *   которая сразу бросает нужную ошибку
       * – иначе рекурсивно «замораживаем» дочерний объект/массив
       */
      get(target, prop, receiver) {
        // Используем Reflect.get для «нативного» чтения свойства:
        //
        // Reflect — встроенный в JavaScript объект (ES2015+),
        // предоставляющий чистые функции для выполнения базовых операций
        // с объектами и свойствами (get, set, deleteProperty, defineProperty и др.),
        // точно повторяющие внутреннюю логику движка и возвращающие статус операции.
        //
        // Без Reflect: геттер вызовется, но this будет target, и super-геттеры работать не будут
        // const val = target[prop];
        // С Reflect: все геттеры, прототипы и this передаются правильно
        const originalValue = Reflect.get(target, prop, receiver);

        // Если это метод массива из списка мутирующих,
        // возвращаем функцию, которая выбрасывает ошибку
        if (
          Array.isArray(target)
          && typeof originalValue === 'function'
          && mutatingMethods.has(prop)
        ) return () => {
          throw getErrorMessage('method', prop);
        };

        // Для любых других значений (объектов, массивов, примитивов)
        // возвращаем либо сам примитив, либо новый Proxy
        return _freeze(originalValue);
      },

      /**
       * set — перехват записи в свойство:
       * – запрещаем в любом случае, различая индексы массива
       *   и обычные свойства
       */
      set(target, prop) {
        if (isArrayIndex(target, prop)) {
          // Присвоение arr[2] = ... → Error Modifying Index: 2
          throw getErrorMessage('index', prop);
        } else {
          // Присвоение obj.foo = ... или arr.foo = ... → Error Modifying: foo
          throw getErrorMessage('prop', prop);
        }
      },

      /**
       * deleteProperty — перехват удаления свойства:
       * аналогично set, но для delete obj[prop]
       */
      deleteProperty(target, prop) {
        if (isArrayIndex(target, prop)) {
          throw getErrorMessage('index', prop);
        } else {
          throw getErrorMessage('prop', prop);
        }
      },

      /**
       * defineProperty — перехват Object.defineProperty:
       * блокируем изменения метаданных любых свойств
       */
      defineProperty(target, prop) {
        if (isArrayIndex(target, prop)) {
          throw getErrorMessage('index', prop);
        } else {
          throw getErrorMessage('prop', prop);
        }
      }
    });

    // Кэшируем и возвращаем Proxy
    proxyCache.set(obj, proxy);
    return proxy;
  }

  // Начинаем «заморозку» с корневой структуры
  return _freeze(target);
}









// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Вспомогательная функция для запуска теста:
// вызывает makeImmutable(obj), затем fn(immutableObj),
// возвращает { value, error } в зависимости от результата.
function run(obj, fn) {
  try {
    const immutable = makeImmutable(obj);
    const value = fn(immutable);
    return { value, error: null };
  } catch (e) {
    return { value: null, error: e };
  }
}

// Тестовые кейсы для функции makeImmutable.
const tests = [
  {
    description: "Изменение свойства у простого объекта",
    async test() {
      const obj = { x: 5 };
      const fn = o => { o.x = 10; return o.x; };
      const result = run(obj, fn);
      const expected = { value: null, error: "Error Modifying: x" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Присвоение того же значения тоже бросает",
    async test() {
      const obj = { a: 1 };
      const fn = o => { o.a = 1; return "ok"; };
      const result = run(obj, fn);
      const expected = { value: null, error: "Error Modifying: a" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Изменение вложенного свойства",
    async test() {
      const obj = { nested: { y: 2 } };
      const fn = o => { o.nested.y = 3; return o.nested.y; };
      const result = run(obj, fn);
      const expected = { value: null, error: "Error Modifying: y" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Изменение элемента массива по индексу",
    async test() {
      const arr = [1, 2, 3];
      const fn = a => { a[1] = 99; return a[2]; };
      const result = run(arr, fn);
      const expected = { value: null, error: "Error Modifying Index: 1" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Вызов мутирующего метода массива: push",
    async test() {
      const obj = { arr: [1, 2] };
      const fn = o => { o.arr.push(3); return o.arr.length; };
      const result = run(obj, fn);
      const expected = { value: null, error: "Error Calling Method: push" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Вызов немутирующего метода массива: map",
    async test() {
      const arr = [1, 2, 3];
      const fn = a => a.map(x => x * 2);
      const result = run(arr, fn);
      const expectedValue = [2, 4, 6];
      assert(
        result.error === null && JSON.stringify(result.value) === JSON.stringify(expectedValue),
        `Ожидалось value=${JSON.stringify(expectedValue)}, got ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Чтение свойства и индекса не бросает",
    async test() {
      const obj = { foo: "bar", arr: [7, 8, 9] };
      const fn = o => ({ foo: o.foo, second: o.arr[1] });
      const result = run(obj, fn);
      const expectedValue = { foo: "bar", second: 8 };
      assert(
        result.error === null && JSON.stringify(result.value) === JSON.stringify(expectedValue),
        `Ожидалось value=${JSON.stringify(expectedValue)}, got ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Object.keys и перебор свойств",
    async test() {
      const obj = { a: 1, b: 2 };
      const fn = o => {
        const keys = Object.keys(o);
        return keys.reduce((sum, k) => sum + o[k], 0);
      };
      const result = run(obj, fn);
      const expectedValue = 3;
      assert(
        result.error === null && result.value === expectedValue,
        `Ожидалось value=${expectedValue}, got ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "reverse бросает ошибку",
    async test() {
      const arr = [3, 2, 1];
      const fn = a => { a.reverse(); return a; };
      const result = run(arr, fn);
      const expected = { value: null, error: "Error Calling Method: reverse" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "sort не мутирует",
    async test() {
      const arr = [3, 1, 2];
      const fn = a => a.sort();  // ожидаем ошибку, т.к. sort мутирует
      const result = run(arr, fn);
      const expected = { value: null, error: "Error Calling Method: sort" };
      assert(
        result.value === expected.value && result.error === expected.error,
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
];

// Запуск тестов.
; (async () => {
  console.log("Запуск тестов для makeImmutable...");
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
    console.log("🎉 Все тесты для makeImmutable пройдены успешно.");
  }
})();
