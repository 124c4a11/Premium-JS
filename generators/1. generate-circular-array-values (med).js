/**
 * Задача: LeetCode 2757. Generate Circular Array Values
 * 
 * Дан круговой (циклический) массив arr и целочисленный стартовый индекс startIndex.
 * Нужно вернуть объект-генератор gen, который при каждом вызове gen.next()
 * выдаёт элементы массива arr по “кольцу”.
 *
 * Первое обращение gen.next() без аргументов должно вернуть arr[startIndex].
 * При каждом последующем вызове gen.next(jump) ему передаётся целое jump.
 *
 * Правила смещения:
 * - если jump > 0, сдвигаемся вперёд на jump шагов; достигнув конца, переходим в начало;
 * - если jump < 0, сдвигаемся назад на |jump| шагов; достигнув начала, переходим в конец.
 *
 * Пример 1:
 *   const arr = [1,2,3,4,5], startIndex = 0;
 *   const gen = cycleGenerator(arr, startIndex);
 *   gen.next().value    // 1,  index = 0
 *   gen.next(1).value   // 2,  index = 1
 *   gen.next(2).value   // 4,  index = 3
 *   gen.next(6).value   // 5,  index = 4  (3 → 4 → 0 → 1 → 2 → 3 → 4)
 *
 * Пример 2:
 *   const arr = [10,11,12,13,14,15], startIndex = 1;
 *   const gen = cycleGenerator(arr, startIndex);
 *   gen.next().value    // 11, index = 1
 *   gen.next(1).value   // 12, index = 2
 *   gen.next(4).value   // 10, index = 0  (2 → 3 → 4 → 5 → 0)
 *   gen.next(0).value   // 10, index = 0
 *   gen.next(-1).value  // 15, index = 5
 *   gen.next(-3).value  // 12, index = 2  (5 → 4 → 3 → 2)
 *
 * Пример 3:
 *   const arr = [2,4,6,7,8,10], startIndex = 3;
 *   const gen = cycleGenerator(arr, startIndex);
 *   gen.next().value    // 7,  index = 3
 *   gen.next(-4).value  // 10, index = 5 (3 → 2 → 1 → 0 → 5)
 *   gen.next(5).value   // 8,  index = 4 (5 → 0 → 1 → 2 → 3 → 4)
 *   gen.next(-3).value  // 4,  index = 1 (4 → 3 → 2 → 1)
 *   gen.next(10).value  // 10, index = 5 (1 → … → 5)
 *
 * Ограничения:
 *   1 ≤ arr.length ≤ 10⁴
 *   1 ≤ steps.length ≤ 100
 *   –10⁴ ≤ arr[i], steps[i] ≤ 10⁴
 *   0 ≤ startIndex < arr.length
 */



function* cycleGenerator(arr, startIndex) {
  const n = arr.length;

  /* 
   * Запускаем бесконечный цикл,
   * чтобы генератор мог выдавать новые значения
   * до тех пор, пока его явно не остановят.
   */
  while (true) {

    /*
     * Первый вызов generator.next() – всегда без аргумента, 
     * он начинает выполнение и возвращает результат первого yield.
     * На этой точке генератор приостанавливает выполнение.
     * При первом вызове gen.next():
     *  – выполнение доходит до yield arr[startIndex] и возвращает значение.
     *  – присваивание jump = … ещё не происходит, и код "виснет" прямо здесь.
     *  – строка ниже, с обновлением startIndex, не выполнится.
     *
     * 1) Пауза и отдача значения:
     *    – Движок встречает `yield arr[startIndex]`,
     *      вычисляет `arr[startIndex]` и возвращает его
     *      внешнему коду в `gen.next().value`.
     *    – Присвоение `jump = …` ещё не происходит.
     *    – Генератор «замораживается» сразу после `yield`.
     *
     * 2) Возобновление и приём аргумента:
     *    – При вызове `gen.next(x)` переданное `x` становится
     *      результатом того самого `yield`.
     *    – Выражение `yield arr[startIndex]` «возвращает» `x`,
     *      и оно присваивается переменной `jump`.
     *
     * Пример:
     *   const gen = cycleGenerator([10,20,30], 0);
     *
     *   // Первый вызов:
     *   gen.next();      // => { value: 10, done: false }
     *   //   – отдаёт 10, jump = undefined
     *
     *   // Второй вызов:
     *   gen.next(5);     // => { value: 30, done: false }
     *   //   – присваивает jump = 5, startIndex = (0+5)%3 = 2
     */
    const jump = yield arr[startIndex];

    /*
     * После возобновления (второй и последующие gen.next(value)):
     * сюда передаётся значение value, и уже затем этот блок отработает.
     *
     * Пересчитываем startIndex следующим образом:
     *  a) startIndex + jump — двигаемся вперёд (jump > 0) или назад (jump < 0).
     *       Пример 1: n = 5, startIndex = 3, jump = 2 → 3 + 2 = 5
     *  b) (… % n) — берём остаток от деления, чтобы уйти от «выхода» за длину массива.
     *       Пример 1: 5 % 5 = 0
     *  c) + n — сдвигаем диапазон в неотрицательную зону. Даже если результат
     *    предыдущей операции был положительным, мы просто прибавляем лишнее n,
     *    что выведет значение за дипапзон n-1. Последующая операция % n (d)
     *    вернет значение в рамки диапозона от 0 до n−1.
     *       Пример 1: 0 + 5 = 5 
     *  d) ещё один % n — окончательно гарантируем, что результат будет в [0…n−1],
     *       обеспечивая «кольцевой» переход.
     *       Пример 1: 5 % 5 = 0 → новый startIndex = 0
     *
     * Пример 2 (отрицательный шаг): n = 5, startIndex = 1, jump = -3
     *  a) 1 + (−3) = -2
     *  b) -2 % 5 = -2
     *  c) -2 + 5 = 3
     *  d) 3 % 5 = 3 → новый startIndex = 3
     */
    startIndex = (((startIndex + jump) % n) + n) % n;
  }
}






// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции cycleGenerator.
  Перед запуском тестов убедитесь, что функция cycleGenerator описана выше
  и доступна в этом контексте.
*/
const tests = [
  {
    description: "Начальный yield без передачи jump",
    async test() {
      const arr = [10, 20, 30];
      const gen = cycleGenerator(arr, 1);
      const first = gen.next().value; // без аргумента, jump по-умолчанию undefined
      assert(
        first === 20,
        `Ожидалось 20, получено ${first}`
      );
    },
  },
  {
    description: "Прыжок 0: остаемся на той же позиции",
    async test() {
      const arr = ["a", "b", "c"];
      const gen = cycleGenerator(arr, 2);
      gen.next(); // дает "c"
      const second = gen.next(0).value; // прыжок 0, снова index 2
      assert(
        second === "c",
        `Ожидалось "c", получено ${second}`
      );
    },
  },
  {
    description: "Положительный прыжок в пределах длины массива",
    async test() {
      const arr = [0, 1, 2, 3, 4];
      const gen = cycleGenerator(arr, 1);
      gen.next(); // 1
      const v = gen.next(2).value; // (1 + 2) % 5 = 3
      assert(
        v === 3,
        `Ожидалось 3, получено ${v}`
      );
    },
  },
  {
    description: "Положительный прыжок больше длины массива (wrap-around)",
    async test() {
      const arr = [100, 200, 300];
      const gen = cycleGenerator(arr, 0);
      gen.next(); // 100
      const v = gen.next(5).value; // (0 + 5) % 3 = 2
      assert(
        v === 300,
        `Ожидалось 300, получено ${v}`
      );
    },
  },
  {
    description: "Отрицательный прыжок в пределах длины массива",
    async test() {
      const arr = ["x", "y", "z"];
      const gen = cycleGenerator(arr, 2);
      gen.next(); // "z"
      const v = gen.next(-1).value; // (2 - 1) = 1
      assert(
        v === "y",
        `Ожидалось "y", получено ${v}`
      );
    },
  },
  {
    description: "Отрицательный прыжок больше длины массива (wrap-around)",
    async test() {
      const arr = [7, 8, 9, 10];
      const gen = cycleGenerator(arr, 1);
      gen.next(); // 8
      const v = gen.next(-5).value; 
      // 1 + (-5) = -4, -4 % 4 = -0, normalize → 0
      assert(
        v === 7,
        `Ожидалось 7, получено ${v}`
      );
    },
  },
  {
    description: "Последовательность прыжков и проверка нескольких шагов",
    async test() {
      const arr = [0, 1, 2, 3];
      const gen = cycleGenerator(arr, 2);
      const results = [];
      results.push(gen.next().value);   // 2
      results.push(gen.next(1).value);  // 3
      results.push(gen.next(1).value);  // 0
      results.push(gen.next(-2).value); // (0 - 2) mod 4 = 2
      results.push(gen.next(5).value);  // (2 + 5) mod 4 = 3
      const expected = [2, 3, 0, 2, 3];
      assert(
        JSON.stringify(results) === JSON.stringify(expected),
        `Ожидалась последовательность ${JSON.stringify(expected)}, получено ${JSON.stringify(results)}`
      );
    },
  },
  {
    description: "Исходный массив остается без изменений",
    async test() {
      const arr = [1, 2, 3];
      const snapshot = JSON.stringify(arr);
      const gen = cycleGenerator(arr, 0);
      gen.next();
      gen.next(2);
      assert(
        JSON.stringify(arr) === snapshot,
        `Исходный массив должен быть ${snapshot}, после вызовов получен ${JSON.stringify(arr)}`
      );
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для cycleGenerator...");
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
    console.log("🎉 Все тесты для cycleGenerator завершены успешно.");
  }
})();
