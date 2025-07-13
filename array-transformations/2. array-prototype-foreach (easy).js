/*
  LeetCode 2804. Array Prototype ForEach

  Напишите свою версию метода forEach, которая расширяет все массивы таким образом, 
  чтобы можно было вызвать array.forEach(callback, context) на любом массиве, 
  и он выполнял callback для каждого элемента массива. Метод forEach не должен ничего возвращать.

  callback принимает следующие аргументы:

  currentValue - текущий обрабатываемый элемент массива; значение элемента на текущей итерации.
  index - индекс текущего обрабатываемого элемента массива.
  array - сам массив, что позволяет получить доступ ко всему массиву внутри функции callback.

  context — это объект, который передаётся в качестве контекста вызова для callback, 
  чтобы внутри callback ключевое слово this ссылалось на этот объект.

  Попробуйте реализовать метод без использования встроенных методов массива.

  Пример 1:
  Input:
    arr = [1, 2, 3]
    callback = (val, i, arr) => arr[i] = val * 2
    context = { "context": true }
  Output: [2, 4, 6]
  Пояснение:
    arr.forEach(callback, context)
    console.log(arr) // [2, 4, 6]

  Пример 2:
  Input:
    arr = [true, true, false, false]
    callback = (val, i, arr) => arr[i] = this
    context = { "context": false }
  Output: [{ "context": false }, { "context": false }, { "context": false }, { "context": false }]
  Пояснение:
    arr.forEach(callback, context)
    console.log(arr) // [{ "context": false }, …]

  Пример 3:
  Input:
    arr = [true, true, false, false]
    callback = (val, i, arr) => arr[i] = !val
    context = { "context": 5 }
  Output: [false, false, true, true]

  Ограничения:
    arr — корректный JSON-массив
    context — корректный JSON-объект
    fn — функция
    0 <= arr.length <= 10^5
*/



Array.prototype.forEach = function (callback, context) {
  for (let i = 0; i < this.length; ++i) {
    callback.call(context, this[i], i, this);
  }
};









// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const tests = [
  {
    description: "Умножение элементов массива на 2",
    async test() {
      const arr = [1, 2, 3];
      arr.forEach((val, i, a) => a[i] = val * 2);
      const expected = [2, 4, 6];
      assert(
        JSON.stringify(arr) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(arr)}`
      );
    }
  },
  {
    description: "Привязка контекста: заполняем массив значением из this",
    async test() {
      const arr = [null, null, null];
      const context = { fill: 5 };
      arr.forEach(function(val, i, a) {
        a[i] = this.fill;
      }, context);
      const expected = [5, 5, 5];
      assert(
        JSON.stringify(arr) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(arr)}`
      );
    }
  },
  {
    description: "Проверка аргументов callback (value, index, array)",
    async test() {
      const arr = ['a', 'b', 'c'];
      const calls = [];
      arr.forEach(function(val, i, a) {
        calls.push([val, i, a]);
      });
      assert(calls.length === 3, `Ожидалось 3 вызова, получено ${calls.length}`);
      assert(calls[1][0] === 'b', `Ожидалось значение 'b', получено ${calls[1][0]}`);
      assert(calls[1][1] === 1, `Ожидалось индекс 1, получено ${calls[1][1]}`);
      assert(calls[1][2] === arr, `Ожидалось ссылку на исходный массив`);
    }
  },
  {
    description: "Пустой массив: callback не вызывается",
    async test() {
      const arr = [];
      let count = 0;
      arr.forEach(() => count++);
      assert(count === 0, `Ожидалось 0 вызовов, получено ${count}`);
    }
  },
  {
    description: "Изменение объектов в массиве с привязкой контекста",
    async test() {
      const arr = [{}, {}];
      const context = { key: 'prop' };
      const value = 42;
      arr.forEach(function(val) {
        val[this.key] = value;
      }, context);
      arr.forEach(val => {
        assert(
          val.prop === value,
          `Ожидалось свойство prop = ${value}, получено ${val.prop}`
        );
      });
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для Array.prototype.forEach...");
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
    console.log("🎉 Все тесты для Array.prototype.forEach завершены успешно.");
  }
})();
