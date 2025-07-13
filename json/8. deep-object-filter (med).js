/*
  LeetCode 2823. Deep Object Filter

  Условие задачи:
  Реализуйте функцию deepFilter(obj, fn), которая принимает на вход объект или массив obj
  и функцию fn. Функция должна вернуть новую структуру (объект или массив) filteredObject,
  в которую войдут только те элементы или значения, для которых fn возвращает true.

  Правила глубокого фильтра:
  - Если obj — это объект, проверяйте каждое свойство:  
    • Если fn(value) === true, включайте пару ключ–значение в результат.  
    • Если fn(value) === false, удаляйте это свойство.  
    • Если значение оказалось вложенным объектом или массивом, применяйте фильтрацию рекурсивно.
  - Если после удаления неподходящих свойств во вложенном объекте или массиве не останется ни одного элемента,
    такой объект или массив тоже удаляется.
  - Если в результате работы deepFilter весь obj оказывается пустым (нет ни одного свойства или элемента),
    функция должна вернуть undefined.

  Примеры:

  1) Чистый массив чисел
    Ввод:
      obj = [-5, -4, -3, -2, -1,  0, 1]
      fn  = (x) => x > 0
    Вывод: [1]
    Пояснение:
      Остаются только значения > 0.

  2) Объект со строками и числами
    Ввод:
      obj = {
        "a": 1,
        "b": "2",
        "c": 3,
        "d": "4",
        "e": 5,
        "f": 6,
        "g": { "a": 1 }
      }
      fn  = (x) => typeof x === "string"
    Вывод: { "b": "2", "d": "4" }
    Пояснение:
      Остаются только строковые значения. Вложенный объект g удаляется,
      так как после фильтрации он пуст.

  3) Вложенные массивы
    Ввод:
      obj = [-1, [-1, -1, 5, -1, 10], -1, [-1], [-5]]
      fn  = (x) => x > 0
    Вывод: [[5, 10]]
    Пояснение:
      Остаются только числа > 0 в одном из вложенных массивов.
      Пустые массивы удаляются.

  4) Глубокая вложенность массивов
    Ввод:
      obj = [[[[5]]]]
      fn  = (x) => Array.isArray(x)
    Вывод: undefined
    Пояснение:
      fn возвращает true только для массивов, но внутри нет ни одного вложенного
      массива без чисел, таким образом в конечном результате нет значимых данных.

  Ограничения:
  - fn — функция, возвращающая булево значение.
  - obj — корректный JSON-объект или массив.
  - Длина JSON.stringify(obj) находится в диапазоне от 2 до 10^5 символов.
*/



/* 
  Объявляем функцию deepFilter, принимающую объект или массив и функцию фильтрации fn 
*/
function deepFilter(obj, fn) {
  /* 
    Объявляем вспомогательную рекурсивную функцию dfs для обхода и фильтрации данных 
  */
  function dfs(data) {
    /* 
      Проверяем, является ли текущий элемент массивом 
    */
    if (Array.isArray(data)) {
      /* 
        Рекурсивно обрабатываем каждый элемент массива и оставляем только те, что не undefined 
      */
      const result = [];
      for (const item of data) {
        const filteredValue = dfs(item);

        if (filteredValue === undefined) continue;

        result.push(filteredValue);
      }

      /* 
        Если после фильтрации массив не пуст, возвращаем его, иначе сигнализируем об отсутствии данных 
      */
      return result.length ? result : undefined;
    }

    /*
      Проверяем, является ли текущий элемент объектом (не null и не массивом) 
    */
    if (typeof data === 'object' && data !== null) {
      /* 
        Создаем новый объект для накопления отфильтрованных свойств 
      */
      const result = {};

      /* 
        Проходим по всем перечисляемым свойствам исходного объекта 
      */
      for (const key in data) {
        /*
          Пропускаем свойства из прототипа, оставляем только собственные 
        */
        if (!Object.hasOwn(data, key)) continue;

        /* 
          Рекурсивно фильтруем значение текущего свойства 
        */
        const filteredValue = dfs(data[key]);
        /* 
          Если значение не прошло фильтрацию, пропускаем его
        */
        if (filteredValue === undefined) continue;

        /* 
          Сохраняем отфильтрованное значение в результирующем объекте 
        */
        result[key] = filteredValue;
      }

      /* 
        Если в result нет свойств, возвращаем undefined, иначе result
      */
      return isObjectEmpty(result) ? undefined : result;
    }

    /* 
      Для примитивных значений применяем функцию fn: возвращаем значение или undefined 
    */
    return fn(data) ? data : undefined;
  };

  /* 
    Запускаем DFS-обход с корневого объекта и возвращаем итог 
  */
  return dfs(obj);
}

/* 
  Вспомогательная функция для проверки объекта на пустоту 
*/
function isObjectEmpty(obj) {
  /* 
    Если в объекте есть хоть одно свойство, возвращаем false 
  */
  for (const _ in obj) return false;
  /* 
    Иначе объект пустой — возвращаем true 
  */
  return true;
}









// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции deepFilter.
*/
const tests = [
  {
    description: "Фильтрация простого объекта по значению > 1",
    async test() {
      const input = { a: 1, b: 2, c: 3 };
      const fn = x => x > 1;
      const resultult = deepFilter(input, fn);
      const expected = { b: 2, c: 3 };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Фильтрация вложенного объекта по значению > 2",
    async test() {
      const input = { a: 1, b: { c: 2, d: 3 } };
      const fn = x => x > 2;
      const resultult = deepFilter(input, fn);
      const expected = { b: { d: 3 } };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Фильтрация простого массива чётных чисел",
    async test() {
      const input = [1, 2, 3, 4];
      const fn = x => x % 2 === 0;
      const resultult = deepFilter(input, fn);
      const expected = [2, 4];
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Фильтрация вложенных массивов по значению > 2",
    async test() {
      const input = [1, [2, 3], 4];
      const fn = x => x > 2;
      const resultult = deepFilter(input, fn);
      const expected = [[3], 4];
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Смешанный объект с массивом и числом",
    async test() {
      const input = { arr: [1, 2, 3], num: 2 };
      const fn = x => x >= 2;
      const resultult = deepFilter(input, fn);
      const expected = { arr: [2, 3], num: 2 };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Всегда true – должен вернуть полную копию",
    async test() {
      const input = { x: 1, y: [2, { z: 3 }] };
      const fn = () => true;
      const resultult = deepFilter(input, fn);
      const expected = input;
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось полную копию ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Всегда false – должен вернуть undefined",
    async test() {
      const input = { a: 1, b: [2, 3] };
      const fn = () => false;
      const resultult = deepFilter(input, fn);
      assert(
        resultult === undefined,
        `Ожидалось undefined, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Массив объектов – фильтрация по числам > 1",
    async test() {
      const input = { items: [{ a: 1 }, { b: 2 }, { c: 3 }] };
      const fn = x => x > 1;
      const resultult = deepFilter(input, fn);
      const expected = { items: [{ b: 2 }, { c: 3 }] };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Разные типы – оставляем только числа",
    async test() {
      const input = { a: null, b: "hello", c: 411 };
      const fn = x => typeof x === "number";
      const resultult = deepFilter(input, fn);
      const expected = { c: 411 };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  },
  {
    description: "Удаление пустых коллекций",
    async test() {
      const input = { a: [], b: {}, c: 1 };
      const fn = x => x === 1;
      const resultult = deepFilter(input, fn);
      const expected = { c: 1 };
      assert(
        JSON.stringify(resultult) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(resultult)}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для deepFilter...");
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
    console.log("🎉 Все тесты для deepFilter завершены успешно.");
  }
})();
