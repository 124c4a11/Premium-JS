/**
 * Задача: LeetCode 2774. Array Upper Bound
 * 
 * Напишите код, который расширяет все массивы, чтобы можно было вызывать метод upperBound() на любом массиве.
 * Метод должен возвращать последний индекс заданного числа target.
 *
 * nums — это отсортированный по возрастанию массив чисел, в котором могут встречаться дубликаты.
 * Если target не найден в массиве, метод должен возвращать -1.
 *
 * Примеры:
 *
 * Example 1:
 *   Input:  nums = [3, 4, 5], target = 5
 *   Output: 2
 *   Пояснение: последний индекс значения 5 — 2
 *
 * Example 2:
 *   Input:  nums = [1, 4, 5], target = 2
 *   Output: -1
 *   Пояснение: число 2 в массиве отсутствует, возвращаем -1
 *
 * Example 3:
 *   Input:  nums = [3, 4, 6, 6, 6, 6, 7], target = 6
 *   Output: 5
 *   Пояснение: последний индекс значения 6 — 5
 *
 * Ограничения:
 *   1 <= nums.length <= 10^4
 *   -10^4 <= nums[i], target <= 10^4
 *   nums отсортирован в порядке возрастания
 *
 * Вопрос: Можете ли вы реализовать алгоритм со сложностью O(log n)?
 */


Array.prototype.upperBound = function (target) {
  // Инициализируем левую границу поиска (включительно) нулём.
  // Это минимальный индекс, на котором может находиться верхняя граница для target.
  let l = 0;

  // Инициализируем правую границу поиска (исключительно) длиной массива.
  // Правильная позиция для вставки «правее всех элементов».
  let r = this.length;

  // Выполняем бинарный поиск, пока диапазон [l, r) не сомкнётся
  while (l < r) {
    // Находим середину текущего диапазона.
    // Math.floor нужен, чтобы получить целочисленный индекс.
    const midd = Math.floor((l + r) / 2);

    // Сравниваем элемент в середине с искомым target.
    // Если элемент больше target, значит все элементы
    // начиная с midd и правее тоже больше — сузим правую границу до midd.
    if (this[midd] > target) r = midd;

    // Если элемент меньше или равен target,
    // значит upperBound должен быть правее midd.
    else l = midd + 1;
  }

  // После выхода из цикла l === r — это позиция, куда мог бы встать первый элемент, строго больший target.
  // Например, для массива [1,2,2,3] и target = 2, цикл остановится, когда l = r = 3.
  // Это означает:
  //   — для всех индексов от 0 до 2 (то есть < 3) элемент либо меньше target (1), либо равен target (2);
  //   — начиная с индекса 3 элемент уже строго больше target (3).

  // Чтобы найти последний индекс, равного target, проверяем два условия:
  // 1) l > 0 — убедиться, что перед «точкой вставки» есть элемент.
  // 2) this[l - 1] == target — подтвердить, что этот элемент слева действительно равен target.
  // Если оба условия верны, возвращаем l - 1, иначе — -1 (target отсутствует в массиве).
  return l > 0 && this[l - 1] === target
    ? l - 1   // оба условия выполнены: возвращаем индекс последнего вхождения target
    : -1;     // одно из условий провалилось: target нет в массиве
};

















// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Единичный элемент равен target",
    async test() {
      const arr = [5];
      const result = arr.upperBound(5);
      const expected = 0;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Единичный элемент не равен target",
    async test() {
      const arr = [5];
      const result = arr.upperBound(3);
      const expected = -1;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Уникальные элементы: target в начале",
    async test() {
      const arr = [1, 2, 3];
      const result = arr.upperBound(1);
      const expected = 0;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Уникальные элементы: target в конце",
    async test() {
      const arr = [1, 2, 3];
      const result = arr.upperBound(3);
      const expected = 2;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Уникальные элементы: target в середине",
    async test() {
      const arr = [1, 2, 3, 4];
      const result = arr.upperBound(3);
      const expected = 2;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Дубликаты: несколько вхождений target",
    async test() {
      const arr = [1, 2, 2, 2, 3];
      const result = arr.upperBound(2);
      const expected = 3;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Все элементы одинаковы и равны target",
    async test() {
      const arr = [7, 7, 7, 7];
      const result = arr.upperBound(7);
      const expected = 3;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Дубликаты, но target отсутствует",
    async test() {
      const arr = [1, 2, 2, 2, 3];
      const result = arr.upperBound(4);
      const expected = -1;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "Отрицательные числа: target отрицательное",
    async test() {
      const arr = [-3, -2, -1, 0, 1];
      const result = arr.upperBound(-2);
      const expected = 1;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "target меньше минимума",
    async test() {
      const arr = [1, 2, 3];
      const result = arr.upperBound(0);
      const expected = -1;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
  {
    description: "target больше максимума",
    async test() {
      const arr = [1, 2, 3];
      const result = arr.upperBound(4);
      const expected = -1;
      assert(
        result === expected,
        `Ожидалось ${expected}, получено ${result}`
      );
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для Array.prototype.upperBound...");
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
    console.log("🎉 Все тесты для Array.prototype.upperBound завершены успешно.");
  }
})();

