/**
 * LeetCode 2754. Привязка функции к контексту
 *
 * Расширьте все функции методом bindPolyfill. При вызове bindPolyfill
 * с объектом obj этот объект становится значением this внутри функции. Например:
 *   function f() { console.log('Мой контекст ' + this.ctx); }
 *   f(); // "Мой контекст undefined"
 *   const boundFunc = f.bindPolyfill({ ctx: "Мой объект" });
 *   boundFunc(); // "Мой контекст Мой объект"
 *
 * Считайте, что в bindPolyfill всегда передается ровно один непустой объект.
 * Решение должно быть без использования встроенного Function.prototype.bind.
 *
 * Пример 1:
 * Вход:
 *   fn = function f(multiplier) { return this.x * multiplier; }
 *   obj = { x: 10 }
 *   inputs = [5]
 * Вывод: 50
 * Пояснение:
 *   const boundFunc = f.bindPolyfill({ x: 10 });
 *   boundFunc(5); // 50, потому что this.x = 10 и multiplier = 5
 *
 * Пример 2:
 * Вход:
 *   fn = function speak() { return "Меня зовут " + this.name; }
 *   obj = { name: "Kathy" }
 *   inputs = []
 * Вывод: "Меня зовут Kathy"
 * Пояснение:
 *   const boundFunc = f.bindPolyfill({ name: "Kathy" });
 *   boundFunc(); // "Меня зовут Kathy"
 *
 * Ограничения:
 * - obj — непустой объект
 * - 0 <= inputs.length <= 100
 * - Нельзя использовать встроенные методы bind
 */


Function.prototype.bindPolyfill = function (context) {
  const originalFn = this;

  return function() {
    return originalFn.apply(context, arguments);
  }
};







function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Вспомогательная функция для запуска теста:
// вызывает fn.bindPolyfill(context), затем boundFn(...inputs),
// возвращает { value, error } в зависимости от результата.
function run(fn, context, inputs) {
  try {
    const boundFn = fn.bindPolyfill(context);
    const value = boundFn(...inputs);
    return { value, error: null };
  } catch (e) {
    return { value: null, error: e.message };
  }
}

// Тесты для bindPolyfill
const tests = [
  {
    description: "Простая привязка без аргументов",
    async test() {
      function fn() { return this.val; }
      const obj = { val: 42 };
      const result = run(fn, obj, []);
      assert(
        result.error === null && result.value === 42,
        `Ожидалось value=42, error=null; получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Привязка с одним аргументом",
    async test() {
      function fn(x) { return this.factor * x; }
      const obj = { factor: 10 };
      const result = run(fn, obj, [5]);
      assert(
        result.error === null && result.value === 50,
        `Ожидалось value=50, error=null; получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Привязка с несколькими аргументами",
    async test() {
      function fn(a, b) { return this.base + a + b; }
      const obj = { base: 1 };
      const result = run(fn, obj, [2, 3]);
      assert(
        result.error === null && result.value === 6,
        `Ожидалось value=6, error=null; получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Два разных контекста для одной функции",
    async test() {
      function fn(n) { return this.mult * n; }
      const obj1 = { mult: 2 };
      const obj2 = { mult: 3 };
      const r1 = run(fn, obj1, [4]);
      const r2 = run(fn, obj2, [4]);
      assert(
        r1.error === null && r1.value === 8,
        `Для obj1 ожидалось 8, получено ${JSON.stringify(r1)}`
      );
      assert(
        r2.error === null && r2.value === 12,
        `Для obj2 ожидалось 12, получено ${JSON.stringify(r2)}`
      );
    },
  },
  {
    description: "Вызов метода из контекста",
    async test() {
      function fn(x) { return this.getValue(x); }
      const obj = { getValue(n) { return n + 5; } };
      const result = run(fn, obj, [3]);
      assert(
        result.error === null && result.value === 8,
        `Ожидалось value=8, error=null; получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Отсутствующее свойство — возвращает undefined",
    async test() {
      function fn() { return this.missing; }
      const obj = {};
      const result = run(fn, obj, []);
      assert(
        result.error === null && result.value === undefined,
        `Ожидалось value=undefined, error=null; получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Работа со строками",
    async test() {
      function fn(prefix) { return prefix + this.suffix; }
      const obj = { suffix: "World" };
      const result = run(fn, obj, ["Hello "]);
      assert(
        result.error === null && result.value === "Hello World",
        `Ожидалось "Hello World", получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Возвращает 0 или пустую строку и отличает от null",
    async test() {
      function fn() { return this.empty; }
      const obj1 = { empty: 0 };
      const obj2 = { empty: "" };
      const r1 = run(fn, obj1, []);
      const r2 = run(fn, obj2, []);
      assert(
        r1.error === null && r1.value === 0,
        `Ожидалось value=0; получено ${JSON.stringify(r1)}`
      );
      assert(
        r2.error === null && r2.value === "",
        `Ожидалось value=""; получено ${JSON.stringify(r2)}`
      );
    },
  },
];

// Запуск тестов.
; (async () => {
  console.log("Запуск тестов для bindPolyfill...");
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
    console.log("🎉 Все тесты для bindPolyfill пройдены успешно.");
  }
})();
