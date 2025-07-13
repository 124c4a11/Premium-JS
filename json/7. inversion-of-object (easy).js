/*
  LeetCode 2822. Inversion of Object

  Даны объект или массив obj. Требуется вернуть инвертированный объект или массив invertedObj.

  В invertedObj ключи исходного obj становятся значениями, а значения исходного obj — ключами.
  Индексы массива следует рассматривать как ключи. Гарантируется, что все значения в obj — строки.
  Функция должна обрабатывать дубли: если в obj несколько ключей имеют одно и то же значение,
  то в invertedObj этому значению соответствует массив со всеми соответствующими ключами.

  Примеры:

  1) Вход: obj = {"a": "1", "b": "2", "c": "3", "d": "4"}  
    Выход: invertedObj = {"1": "a", "2": "b", "3": "c", "4": "d"}

  2) Вход: obj = {"a": "1", "b": "2", "c": "2", "d": "4"}  
    Выход: invertedObj = {"1": "a", "2": ["b", "c"], "4": "d"}

  3) Вход: obj = ["1", "2", "3", "4"]  
    Выход: invertedObj = {"1": "0", "2": "1", "3": "2", "4": "3"}

  Ограничения:
  - obj — валидный JSON-объект или массив  
  - typeof obj[key] === "string"  
  - 2 <= JSON.stringify(obj).length <= 10^5
*/



/*
  Объявление функции invertObject,
  которая принимает один параметр obj — исходный объект,
  и возвращает новый объект, в котором
  исходные значения obj становятся ключами,
  а исходные ключи obj — значениями.
*/
function invertObject(obj) {

  /*
    Создаём пустой объект result,
    в который будем помещать перевёрнутые пары ключ-значение.
  */
  const result = {};

  /*
    Цикл for-in проходит по всем перечислимым свойствам obj.
    Он захватит как собственные, так и унаследованные поля.
    Если нужно обрабатывать только собственные свойства,
    внутри цикла добавляют проверку: if (Object.hasOwn(obj, key)).
  */
  for (const key in obj) {

    /*
      Извлекаем текущее значение по имени свойства key.
      Это значение может быть примитивом (string, number, boolean, null, undefined)
      или объектом/массивом/функцией.
    */
    const value = obj[key];

    /*
      В JS все ключи объекта — строки.
      Поэтому значение value будет приведено к строке при использовании в качестве ключа.
      Проверяем, есть ли уже в result такое строковое имя свойства.
      Это нужно, чтобы объединить несколько исходных ключей,
      у которых оказалось одно и то же значение.
    */
    if (Object.hasOwn(result, value)) {

      /*
        Если по такому ключу уже лежит массив,
        значит мы раньше уже сталкивались с дубликатом этого value
        и превратили первые два ключа в массив.
      */
      if (Array.isArray(result[value])) {
        /*
          Добавляем новый ключ в конец существующего массива ключей.
        */
        result[value].push(key);
      } else {
        /*
          Если же в result[value] пока обычное значение —
          первый найденный ключ (строка),
          создаём массив из старого и нового ключей.
        */
        result[value] = [result[value], key];
      }

    } else {
      /*
        Если такого свойства ещё нет,
        добавляем его в result и присваиваем значение key.
        Теперь в result значение value будет указывать на оригинальный ключ key.
      */
      result[value] = key;
    }
  }

  /*
    После завершения цикла в result собраны все перевёрнутые пары.
    Возвращаем итоговый объект с инвертированными данными.
  */
  return result;
}










// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/* Тестовые кейсы для функции invertObject */
const tests = [
  {
    description: "Уникальные числовые значения",
    async test() {
      const obj = { a: 1, b: 2, c: 3 };
      const expected = { "1": "a", "2": "b", "3": "c" };
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Дублирующиеся числовые значения",
    async test() {
      const obj = { a: 1, b: 1, c: 2 };
      const expected = { "1": ["a", "b"], "2": "c" };
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Дублирующиеся строковые значения",
    async test() {
      const obj = { x: "foo", y: "foo", z: "bar" };
      const expected = { "foo": ["x", "y"], "bar": "z" };
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Разные типы значений (boolean, null)",
    async test() {
      const obj = { a: true, b: false, c: false, d: null };
      const expected = { "true": "a", "false": ["b", "c"], "null": "d" };
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Пустой объект",
    async test() {
      const obj = {};
      const expected = {};
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Значения-объекты приводятся к строке",
    async test() {
      const val = {};
      const obj = { p: val, q: val };
      const expected = { "[object Object]": ["p", "q"] };
      const result = invertObject(obj);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
  {
    description: "Массив как входной объект",
    async test() {
      const arr = [1, 2, 1];
      const expected = { "1": ["0", "2"], "2": "1" };
      const result = invertObject(arr);
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    },
  },
];

/* Запуск тестов в асинхронном режиме с отображением ошибок */
(async () => {
  console.log("Запуск тестов для invertObject...");
  let hasErrors = false;

  for (let i = 0; i < tests.length; i++) {
    const { description, test } = tests[i];
    try {
      await test();
      console.log(`✔️  Тест ${i + 1} пройден: ${description}`);
    } catch (e) {
      hasErrors = true;
      console.error(`❌ Тест ${i + 1} не пройден: ${description}`);
      console.error(`   Ошибка: ${e.message}`);
      console.error(`   Стек:\n${e.stack.split('\n').slice(1).map(line => '     ' + line).join('\n')}`);
    }
  }

  if (hasErrors) {
    console.error("❗ Некоторые тесты завершились с ошибкой.");
  } else {
    console.log("🎉 Все тесты для invertObject завершены успешно.");
  }
})();
