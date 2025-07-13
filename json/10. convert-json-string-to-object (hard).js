/*
  Задача: LeetCode 2759. Convert JSON String to Object

  Описание задачи:
  Дана строка str, представляющая корректный JSON. Необходимо вернуть разобранное значение parsedStr,
  которое может быть объектом, массивом, строкой, числом, булевым значением или null.
  Строка str не содержит невидимых символов и символов экранирования.
  Задачу нужно решить без использования встроенного JSON.parse.

  Примеры:
  1) Ввод: str = '{"a":2,"b":[1,2,3]}'
    Вывод: { a: 2, b: [1,2,3] }
    Пояснение: возвращается объект, соответствующий JSON-строке.

  2) Ввод: str = 'true'
    Вывод: true
    Пояснение: булевы значения тоже допустимы.

  3) Ввод: str = '[1,5,"false",{"a":2}]'
    Вывод: [1,5,"false",{"a":2}]
    Пояснение: возвращается массив, соответствующий JSON-строке.

  Ограничения:
  - str является корректной JSON-строкой
  - 1 <= str.length <= 10^5
*/




function jsonParse(str) {
  // Сохраняем длину входной строки в переменную n
  const n = str.length;

  // Инициализируем указатель i на текущую позицию в строке
  let i = 0;

  // Функция для разбора литерала true
  function parseTrue() {
    // Пропускаем 4 символа: 't','r','u','e'
    i += 4;
    // Возвращаем булево значение true
    return true;
  }

  // Функция для разбора литерала false
  function parseFalse() {
    // Пропускаем 5 символов: 'f','a','l','s','e'
    i += 5;
    // Возвращаем булево значение false
    return false;
  }

  // Функция для разбора литерала null
  function parseNull() {
    // Пропускаем 4 символа: 'n','u','l','l'
    i += 4;
    // Возвращаем значение null
    return null;
  }

  // Функция для разбора числа
  function parseNumber() {
    // Буфер для накопления символов числа
    let s = '';

    // Цикл до конца строки
    while (i < n) {
      // Считаем текущий символ
      const c = str[i];

      // Если встретили один из разделителей числа:
      // ','  — запятая между элементами массива или
      //        свойствами объекта
      // '}'  — закрывающая фигурная скобка, конец объекта
      // ']'  — закрывающая квадратная скобка, конец массива
      if (c === ',' || c === '}' || c === ']') {
        // Прерываем сбор цифр
        break;
      }

      // Добавляем цифру/точку/знак
      s += c;
      // Переходим к следующему символу
      i++;
    }

    // Преобразуем строку в число и возвращаем
    return Number(s);
  }

  // Функция для разбора строки в кавычках
  function parseString() {
    // Буфер для содержимого строки
    let s = '';
    // Пропускаем начальную кавычку
    i++;

    // Цикл до конца строки
    while (i < n) {
      // Текущий символ
      const c = str[i];

      // Если это закрывающая кавычка
      if (c === '"') {
        // Пропускаем её
        i++;
        // Завершаем разбор строки
        break;
      }

      // Если найден символ экранирования
      if (c === '\\') {
        // Пропускаем символ '\'
        i++;
        // Добавляем следующий символ без изменений
        s += str[i];
      } else {
        // Иначе добавляем текущий символ
        s += c;
      }

      // Переходим к следующему символу
      i++;
    }

    // Возвращаем разобранную строку
    return s;
  }

  // Функция для разбора массива
  function parseArray() {
    // Инициализируем пустой массив-результат
    const arr = [];
    // Пропускаем открывающую '['
    i++;

    // Цикл до конца строки
    while (i < n) {
      // Текущий символ
      const c = str[i];

      // Если встретили закрывающую ']'
      if (c === ']') {
        // Пропускаем её
        i++;
        // Завершаем разбор массива
        break;
      }

      // Если разделитель элементов
      if (c === ',') {
        // Пропускаем ','
        i++;
        // Переходим к следующей итерации
        continue;
      }

      // Рекурсивно разбираем следующий элемент
      const value = parseValue();
      // Добавляем разобранное значение в массив
      arr.push(value);
    }

    // Возвращаем готовый массив
    return arr;
  }

  // Функция для разбора объекта
  function parseObject() {
    // Инициализируем пустой объект-результат
    const obj = {};
    // Пропускаем открывающую '{'
    i++;

    // Цикл до конца строки
    while (i < n) {
      // Текущий символ
      const c = str[i];

      // Если встретили закрывающую '}'
      if (c === '}') {
        // Пропускаем её
        i++;
        // Завершаем разбор объекта
        break;
      }

      // Если разделитель пар ключ-значение
      if (c === ',') {
        // Пропускаем ','
        i++;
        // Переходим к следующей итерации
        continue;
      }

      // Разбираем строку-ключ
      const key = parseString();
      // Пропускаем символ ':' между ключом и значением
      i++;

      // Рекурсивно разбираем значение
      const value = parseValue();
      // Сохраняем пару ключ-значение в объекте
      obj[key] = value;
    }

    // Возвращаем готовый объект
    return obj;
  }

  // Функция для выбора типа разбора по первому символу
  function parseValue() {
    // Текущий символ
    const c = str[i];

    // Определяем, какой разбор вызывать
    switch (c) {
      case '{':
        return parseObject();
      case '[':
        return parseArray();
      case '"':
        return parseString();
      case 't':
        return parseTrue();
      case 'f':
        return parseFalse();
      case 'n':
        return parseNull();
      default:
        return parseNumber();
    }
  }

  // Запускаем разбор с первой позиции и возвращаем результат
  return parseValue();
}
















// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции jsonParse.
*/
const tests = [
  {
    description: "Парсинг целого числа",
    async test() {
      const input = "12345";
      const result = jsonParse(input);
      const expected = 12345;
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${expected}, получено ${result}`
      );
    }
  },
  {
    description: "Парсинг отрицательного и дробного числа",
    async test() {
      const input = "-12.34";
      const result = jsonParse(input);
      const expected = -12.34;
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${expected}, получено ${result}`
      );
    }
  },
  {
    description: "Парсинг простой строки",
    async test() {
      const input = "\"hello\"";
      const result = jsonParse(input);
      const expected = "hello";
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг строки с экранированной кавычкой",
    async test() {
      const input = "\"he\\\"llo\"";
      const result = jsonParse(input);
      const expected = "he\"llo";
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг булевых значений и null",
    async test() {
      assert(jsonParse("true") === true, `Ожидалось true, получено ${jsonParse("true")}`);
      assert(jsonParse("false") === false, `Ожидалось false, получено ${jsonParse("false")}`);
      assert(jsonParse("null") === null, `Ожидалось null, получено ${jsonParse("null")}`);
    }
  },
  {
    description: "Парсинг простого массива чисел",
    async test() {
      const input = "[1,2,3]";
      const result = jsonParse(input);
      const expected = [1, 2, 3];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг вложенных массивов",
    async test() {
      const input = "[1,[2,3],4]";
      const result = jsonParse(input);
      const expected = [1, [2, 3], 4];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг простого объекта с разными типами",
    async test() {
      const input = "{\"a\":1,\"b\":\"text\",\"c\":true}";
      const result = jsonParse(input);
      const expected = { a: 1, b: "text", c: true };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг вложенного объекта и массива в объекте",
    async test() {
      const input = "{\"nested\":{\"x\":-1.5,\"y\":[false,null]}}";
      const result = jsonParse(input);
      const expected = { nested: { x: -1.5, y: [false, null] } };
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Парсинг пустых коллекций",
    async test() {
      assert(
        JSON.stringify(jsonParse("[]")) === JSON.stringify([]),
        `Ожидалось [], получено ${JSON.stringify(jsonParse("[]"))}`
      );
      assert(
        JSON.stringify(jsonParse("{}")) === JSON.stringify({}),
        `Ожидалось {}, получено ${JSON.stringify(jsonParse("{}"))}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для jsonParse...");
  let hasErrors = false;

  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test();
      console.log(`✔️  Тест ${i + 1} пройден: ${tests[i].description}`);
    } catch (e) {
      hasErrors = true;
      console.error(`❌ Тест ${i + 1} не пройден: ${tests[i].description}`);
      // Выводим полную информацию об ошибке (сообщение и стек)
      console.error(e);
    }
  }

  if (hasErrors) {
    console.error("❗ Некоторые тесты завершились с ошибкой.");
  } else {
    console.log("🎉 Все тесты для jsonParse завершены успешно.");
  }
})();
