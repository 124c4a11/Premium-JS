/*
  LeetCode 2796. Repeat String

  Условие задачи:
  Напишите код, который расширяет все строки таким образом, чтобы на любой строке можно было вызвать метод 
  replicate(x),
  и он возвращал строку, повторённую x раз.

  Постарайтесь реализовать это без использования встроенного метода repeat.

  Примеры:
  1. Вход: str = "hello", times = 2
    Выход: "hellohello"
    Пояснение: "hello" повторяется 2 раза

  2. Вход: str = "code", times = 3
    Выход: "codecodecode"
    Пояснение: "code" повторяется 3 раза

  3. Вход: str = "js", times = 1
    Выход: "js"
    Пояснение: "js" повторяется 1 раз

  Ограничения:
  1 <= str.length, times <= 10^5
*/

String.prototype.replicate = function (times) {
  let result = '';

  for (let i = 0; i < times; i++) {
    result += this;
  }

  return result;
};








// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Повторение строки несколько раз",
    async test() {
      const result = "hello".replicate(2);
      const expected = "hellohello";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Повторение строки один раз возвращает оригинал",
    async test() {
      const input = "js";
      const result = input.replicate(1);
      const expected = "js";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Повторение пустой строки любое число раз — результат всё та же пустая строка",
    async test() {
      const result1 = "".replicate(5);
      const result2 = "".replicate(1);
      assert(
        result1 === "",
        `Ожидалось "", получено "${result1}"`
      );
      assert(
        result2 === "",
        `Ожидалось "", получено "${result2}"`
      );
    }
  },
  {
    description: "Повторение одной буквы несколько раз",
    async test() {
      const result = "a".replicate(5);
      const expected = "aaaaa";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Повторение строки с пробелами внутри",
    async test() {
      const input = "ab cd";
      const result = input.replicate(3);
      const expected = "ab cdab cdab cd";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Метод replicate доступен у объектов String",
    async test() {
      const strObj = new String("X");
      const result = strObj.replicate(4);
      const expected = "XXXX";
      assert(
        result === expected,
        `Ожидалось "${expected}", получено "${result}"`
      );
    }
  },
  {
    description: "Большое число повторений (проверка производительности на короткой строке)",
    async test() {
      const times = 10000;
      const part = "z";
      const result = part.replicate(times);
      assert(
        result.length === times,
        `Ожидалось длину ${times}, получено ${result.length}`
      );
      // дополнительно проверим первые и последние символы
      assert(
        result[0] === "z" && result[result.length - 1] === "z",
        `Ожидалось, что строка состоит из "${part}", но получили "${result.slice(0, 1)}...${result.slice(-1)}"`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для String.prototype.replicate...");
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
    console.log("🎉 Все тесты для String.prototype.replicate успешно пройдены.");
  }
})();
