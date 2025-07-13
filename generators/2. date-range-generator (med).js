/*
  Задача: LeetCode 2777. Date Range Generator

  Условие задачи:
  Дана начальная дата start, конечная дата end и положительное целое число step.
  Необходимо вернуть объект-генератор, который выдаёт даты в диапазоне от start до end включительно.
  Все даты представлены строками в формате YYYY-MM-DD.
  Параметр step задаёт количество дней между последовательными возвращаемыми значениями.

  Пример 1:
  Вход:  start = "2023-04-01", end = "2023-04-04", step = 1
  Выход: ["2023-04-01","2023-04-02","2023-04-03","2023-04-04"]
  Пояснение:
    const g = dateRangeGenerator(start, end, step);
    g.next().value // '2023-04-01'
    g.next().value // '2023-04-02'
    g.next().value // '2023-04-03'
    g.next().value // '2023-04-04'

  Пример 2:
  Вход:  start = "2023-04-10", end = "2023-04-20", step = 3
  Выход: ["2023-04-10","2023-04-13","2023-04-16","2023-04-19"]
  Пояснение:
    const g = dateRangeGenerator(start, end, step);
    g.next().value // '2023-04-10'
    g.next().value // '2023-04-13'
    g.next().value // '2023-04-16'
    g.next().value // '2023-04-19'

  Пример 3:
  Вход:  start = "2023-04-10", end = "2023-04-10", step = 1
  Выход: ["2023-04-10"]
  Пояснение:
    const g = dateRangeGenerator(start, end, step);
    g.next().value // '2023-04-10'

  Ограничения:
    new Date(start) <= new Date(end)
    0 <= разница в днях между start и end <= 1000
    1 <= step <= 100
*/


/*
  Объявляем генераторную функцию dateRangeGenerator, принимающую три аргумента:
    - start — строка с начальной датой 
    - end — строка с конечной датой, step — число дней шага
  Пример вызова: 
  dateRangeGenerator('2021-01-01', '2021-01-05', 2)
*/
function* dateRangeGenerator(start, end, step) {

  /*
    Создаем объект Date из строки end.
    new Date('2021-01-05') даст объект с датой 5 января 2021 года
  */
  const endDate = new Date(end);

  /*
    Создаем объект Date из строки start.
    new Date('2021-01-01') даст объект с датой 1 января 2021 года
  */
  let currDate = new Date(start);

  /*
    Запускаем цикл, который будет выполняться, 
    пока currDate <= endDate.
    Пример: 2021-01-01 <= 2021-01-05 — цикл сработает
  */
  while (currDate <= endDate) {

    /* 
      Возвращаем в виде строки текущую дату в формате "YYYY-MM-DD".
      currDate.toISOString() -> "2021-01-01T00:00:00.000Z", 
      slice(0,10) -> "2021-01-01"
    */
    yield currDate.toISOString().slice(0, 10);

    /* 
      Прибавляем к currDate значение step (количество дней).
      Если step = 2, то 1 января превратится в 3 января:
      currDate.getDate() = 1, + 2 = 3
    */
    currDate.setDate(currDate.getDate() + step);
  }
}










// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/* Тестовые кейсы для функции dateRangeGenerator */
const tests = [
  {
    description: "Ежедневный шаг от 2021-01-01 до 2021-01-05",
    async test() {
      const gen = dateRangeGenerator("2021-01-01", "2021-01-05", 1);
      const result = [...gen];
      const expected = [
        "2021-01-01",
        "2021-01-02",
        "2021-01-03",
        "2021-01-04",
        "2021-01-05"
      ];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Шаг в 3 дня от 2021-01-01 до 2021-01-10",
    async test() {
      const gen = dateRangeGenerator("2021-01-01", "2021-01-10", 3);
      const result = [...gen];
      const expected = ["2021-01-01", "2021-01-04", "2021-01-07", "2021-01-10"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Начало и конец совпадают",
    async test() {
      const gen = dateRangeGenerator("2022-06-15", "2022-06-15", 5);
      const result = [...gen];
      const expected = ["2022-06-15"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Начало позже конца — пустой диапазон",
    async test() {
      const gen = dateRangeGenerator("2022-12-10", "2022-12-01", 1);
      const result = [...gen];
      const expected = [];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось пустой массив, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Прыжок через високосный день (2020-02-27…2020-03-01)",
    async test() {
      const gen = dateRangeGenerator("2020-02-27", "2020-03-01", 1);
      const result = [...gen];
      const expected = ["2020-02-27", "2020-02-28", "2020-02-29", "2020-03-01"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Граница месяцев (2021-01-30…2021-02-02)",
    async test() {
      const gen = dateRangeGenerator("2021-01-30", "2021-02-02", 1);
      const result = [...gen];
      const expected = [
        "2021-01-30",
        "2021-01-31",
        "2021-02-01",
        "2021-02-02"
      ];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Входные строки с временной меткой",
    async test() {
      const gen = dateRangeGenerator(
        "2023-05-10T12:34:56Z",
        "2023-05-12T23:59:59Z",
        1
      );
      const result = [...gen];
      const expected = ["2023-05-10", "2023-05-11", "2023-05-12"];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  }
];

/* Запуск тестов в асинхронном режиме с подробным выводом ошибок */
;(async () => {
  console.log("Запуск тестов для dateRangeGenerator...");
  let hasErrors = false;

  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test();
      console.log(`✔️  Тест ${i + 1} пройден: ${tests[i].description}`);
    } catch (e) {
      hasErrors = true;
      console.error(`❌ Тест ${i + 1} не пройден: ${tests[i].description}`);
      console.error("Ошибка:", e.message);
      console.error(e.stack);
    }
  }

  if (hasErrors) {
    console.error("❗ Некоторые тесты завершились с ошибкой.");
  } else {
    console.log("🎉 Все тесты для dateRangeGenerator завершены успешно.");
  }
})();

