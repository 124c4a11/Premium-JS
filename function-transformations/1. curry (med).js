/*
  Задача: https://learn.javascript.ru/currying-partials
*/

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function pass(...args2) {
      return curried.apply(this, args.concat(args2));
    }
  }
}


















/*
  function curry(fn) {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn.apply(this, args);
      }

      return function pass(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  }

  Когда мы запускаем её, есть две ветви выполнения if:

    1. Вызвать сейчас: если количество переданных аргументов args совпадает с количеством аргументов при объявлении функции (func.length) или больше, тогда вызов просто переходит к ней.

    2. Частичное применение: в противном случае func не вызывается сразу. Вместо этого, возвращается другая обёртка pass, которая снова применит curried, передав предыдущие аргументы вместе с новыми. Затем при новом вызове мы опять получим либо новое частичное применение (если аргументов недостаточно) либо, наконец, результат.

  Например, давайте посмотрим, что произойдёт в случае sum(a, b, c). У неё три аргумента, так что sum.length = 3.

  Для вызова curried(1)(2)(3):

    1. Первый вызов curried(1) запоминает 1 в своём лексическом окружении и возвращает обёртку pass.

    2. Обёртка pass вызывается с (2): она берёт предыдущие аргументы (1), объединяет их с тем, что получила сама (2) и вызывает curried(1, 2) со всеми ними. Так как число аргументов всё ещё меньше 3-х, curry возвращает pass.

    3. Обёртка pass вызывается снова с (3). Для следующего вызова pass(3) берёт предыдущие аргументы (1, 2) и добавляет к ним 3, делая вызов curried(1, 2, 3) – наконец 3 аргумента, и они передаются оригинальной функции.
*/






// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/* Тестовые кейсы для функции curry. 
   Перед запуском тестов убедитесь, что функция curry описана выше и доступна в этом контексте. */
const tests = [
  {
    description: "Полное применение аргументов за один шаг",
    async test() {
      const sum = (a, b, c) => a + b + c;
      const curriedSum = curry(sum);
      const result = curriedSum(1, 2, 3);
      assert(result === 6, `Ожидалось 6, получено ${result}`);
    },
  },
  {
    description: "Частичное применение в два шага",
    async test() {
      const sum = (a, b, c) => a + b + c;
      const curried = curry(sum);
      const addOne = curried(1);
      const result = addOne(2, 3);
      assert(result === 6, `Ожидалось 6, получено ${result}`);
    },
  },
  {
    description: "Частичное применение тремя шагами",
    async test() {
      const sum = (a, b, c) => a + b + c;
      const curried = curry(sum);
      const result = curried(1)(2)(3);
      assert(result === 6, `Ожидалось 6, получено ${result}`);
    },
  },
  {
    description: "Функция без аргументов",
    async test() {
      const zero = () => 42;
      const curriedZero = curry(zero);
      const result = curriedZero();
      assert(result === 42, `Ожидалось 42, получено ${result}`);
    },
  },
  {
    description: "Функция с одним аргументом: прямое и отложенное применение",
    async test() {
      const double = x => x * 2;
      const curriedDouble = curry(double);
      const direct = curriedDouble(5);
      const delayed = curriedDouble()(6);
      assert(direct === 10, `Ожидалось 10, получено ${direct}`);
      assert(delayed === 12, `Ожидалось 12, получено ${delayed}`);
    },
  },
  {
    description: "Различные варианты частичного применения",
    async test() {
      const sum = (a, b, c) => a + b + c;
      const curried = curry(sum);
      assert(curried(1, 2)(3) === 6, `curried(1,2)(3) ожидает 6`);
      assert(curried(1)(2, 3) === 6, `curried(1)(2,3) ожидает 6`);
      assert(curried(1)(2)(3) === 6, `curried(1)(2)(3) ожидает 6`);
    },
  },
  {
    description: "Передача лишних аргументов",
    async test() {
      const join = function (a, b) {
        return Array.prototype.slice.call(arguments);
      };
      const curriedJoin = curry(join);
      const result = curriedJoin(1, 2, 3, 4);
      assert(Array.isArray(result), `Ожидался массив, получено ${typeof result}`);
      assert(result.length === 4, `Ожидалась длина 4, получено ${result.length}`);
      assert(
        JSON.stringify(result) === JSON.stringify([1, 2, 3, 4]),
        `Ожидался [1,2,3,4], получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Сохранение контекста this при прямом применении",
    async test() {
      const fn = function (y) {
        return this.x + y;
      };
      const obj = { x: 10, f: curry(fn) };
      const result = obj.f(5);
      assert(result === 15, `Ожидалось 15, получено ${result}`);
    },
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для функции curry...");
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
    console.log("🎉 Все тесты для функции curry завершены успешно.");
  }
})();
