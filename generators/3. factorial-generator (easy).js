/*
  LeetCode 2803. Factorial Generator

  Напишите генераторную функцию, которая принимает на вход целое число n 
  и возвращает генератор, выдающий последовательность факториалов.

  Факториал определяется как:
    n! = n × (n − 1) × (n − 2) × … × 2 × 1
  При этом 0! = 1

  Пример 1:
    Вход: n = 5
    Выход: [1, 2, 6, 24, 120]
    Объяснение:
      const gen = factorial(5);
      gen.next().value // 1
      gen.next().value // 2
      gen.next().value // 6
      gen.next().value // 24
      gen.next().value // 120

  Пример 2:
    Вход: n = 2
    Выход: [1, 2]
    Объяснение:
      const gen = factorial(2);
      gen.next().value // 1
      gen.next().value // 2

  Пример 3:
    Вход: n = 0
    Выход: [1]
    Объяснение:
      const gen = factorial(0);
      gen.next().value // 1

  Ограничения:
    0 <= n <= 18
*/



function* factorial(n) {
  if (n === 0) yield 1;

  let result = 1;
  for (let i = 1; i <= n; ++i) {
    yield result *= i;
  }
}








// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для генератора factorial.
*/
const tests = [
  {
    description: "Факториал 0 должен вернуть [1]",
    async test() {
      const input = 0;
      const result = [...factorial(input)];
      const expected = [1];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Факториал 1 должен вернуть [1]",
    async test() {
      const input = 1;
      const result = [...factorial(input)];
      const expected = [1];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Факториал 5 должен вернуть [1, 2, 6, 24, 120]",
    async test() {
      const input = 5;
      const result = [...factorial(input)];
      const expected = [1, 2, 6, 24, 120];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Частичная итерация: первые два yield для n=4",
    async test() {
      const input = 4;
      const gen = factorial(input);
      const first = gen.next();
      const second = gen.next();
      assert(
        first.value === 1 && !first.done,
        `Первый yield: ожидалось value=1, done=false, получено value=${first.value}, done=${first.done}`
      );
      assert(
        second.value === 2 && !second.done,
        `Второй yield: ожидалось value=2, done=false, получено value=${second.value}, done=${second.done}`
      );
    }
  },
  {
    description: "Негативное n (например, -3) должен вернуть []",
    async test() {
      const input = -3;
      const result = [...factorial(input)];
      const expected = [];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось пустой массив, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Большой n=10: длина результата 10, последний элемент 3628800",
    async test() {
      const input = 10;
      const result = [...factorial(input)];
      assert(
        result.length === 10,
        `Ожидалось длину 10, получено ${result.length}`
      );
      assert(
        result[result.length - 1] === 3628800,
        `Ожидалось последний элемент 3628800, получено ${result[result.length - 1]}`
      );
    }
  },
  {
    description: "Повторное использование: второй и третий запуск одинаковы для n=3",
    async test() {
      const input = 3;
      const firstRun = [...factorial(input)];
      const secondRun = [...factorial(input)];
      const expected = [1, 2, 6];
      assert(
        JSON.stringify(firstRun) === JSON.stringify(expected),
        `Первый запуск: ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(firstRun)}`
      );
      assert(
        JSON.stringify(secondRun) === JSON.stringify(expected),
        `Второй запуск: ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(secondRun)}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для factorial...");
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
    console.log("🎉 Все тесты для factorial завершены успешно.");
  }
})();
