/*
  Задача: LeetCode 2758. Next Day

  Условие задачи:
  Напишите код, который расширяет все объекты Date таким образом, 
  чтобы можно было вызывать метод date.nextDay() на любом объекте Date 
  и получать следующий день в формате "YYYY-MM-DD" в виде строки.

  Пример 1:
  Вход: date = "2014-06-20"
  Выход: "2014-06-21"
  Пояснение:
  const date = new Date("2014-06-20");
  date.nextDay(); // "2014-06-21"

  Пример 2:
  Вход: date = "2017-10-31"
  Выход: "2017-11-01"
  Пояснение:
  день после 2017-10-31 — это 2017-11-01

  Ограничения:
  new Date(date) всегда создаёт валидный объект Date
*/


Date.prototype.nextDay = function () {
  const date = new Date(this.valueOf());

  date.setDate(date.getDate() + 1);

  return date.toISOString().slice(0, 10);
};










// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для метода Date.prototype.nextDay.
  Перед запуском убедитесь, что метод определён в этом контексте.
*/
const tests = [
  {
    description: "Обычная дата внутри месяца",
    async test() {
      const date = new Date("2025-07-07");
      const next = date.nextDay();
      const expected = "2025-07-08";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );

      // проверяем, что исходный объект Date не изменился
      assert(
        date.toISOString().slice(0, 10) === "2025-07-07",
        "Оригинальная дата должна остаться неизменной"
      );
    },
  },
  {
    description: "Переход к следующему месяцу",
    async test() {
      const date = new Date("2025-01-31");
      const next = date.nextDay();
      const expected = "2025-02-01";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );
      assert(
        date.toISOString().slice(0, 10) === "2025-01-31",
        "Оригинальная дата должна остаться неизменной"
      );
    },
  },
  {
    description: "Переход к следующему году",
    async test() {
      const date = new Date("2025-12-31");
      const next = date.nextDay();
      const expected = "2026-01-01";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );
      assert(
        date.toISOString().slice(0, 10) === "2025-12-31",
        "Оригинальная дата должна остаться неизменной"
      );
    },
  },
  {
    description: "Високосный год: 28 февраля",
    async test() {
      const date = new Date("2020-02-28");
      const next = date.nextDay();
      const expected = "2020-02-29";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );
    },
  },
  {
    description: "Невисокосный год: 28 февраля",
    async test() {
      const date = new Date("2019-02-28");
      const next = date.nextDay();
      const expected = "2019-03-01";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );
    },
  },
  {
    description: "Переход с 29 февраля в високосном году",
    async test() {
      const date = new Date("2020-02-29");
      const next = date.nextDay();
      const expected = "2020-03-01";

      assert(
        next === expected,
        `Ожидалось ${expected}, получено ${next}`
      );
    },
  },
  {
    description: "Несколько вызовов nextDay не меняют исходную дату",
    async test() {
      const date = new Date("2025-07-07");
      const next1 = date.nextDay();
      const next2 = date.nextDay();
      const expected = "2025-07-08";

      assert(
        next1 === expected,
        `Ожидалось ${expected}, получено ${next1}`
      );
      assert(
        next2 === expected,
        `Ожидалось ${expected}, получено ${next2}`
      );
      assert(
        date.toISOString().slice(0, 10) === "2025-07-07",
        "Оригинальная дата должна остаться неизменной"
      );
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для Date.prototype.nextDay...");
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
    console.log("🎉 Все тесты для Date.prototype.nextDay завершены успешно.");
  }
})();
