/*
  LeetCode 2700: Difference Between Two Objects

  Описание:
  Напишите функцию, которая принимает два глубоко вложенных объекта или массива — obj1 и obj2, и возвращает новый объект, представляющий их различия. Функция должна сравнить свойства двух объектов и выявить изменения. Возвращаемый объект должен содержать только те ключи, у которых значение в obj1 отличается от значения в obj2. Для каждого изменённого ключа значение должно представляться в виде массива: [значение из obj1, значение из obj2]. Ключи, которые существуют только в одном из объектов, не должны включаться в результирующий объект. При сравнении двух массивов индексы элементов рассматриваются как их ключи. Итоговый результат — это глубоко вложенный объект, где каждое "лиственное" значение является массивом с описанием различий. Можно считать, что оба объекта являются результатом вызова JSON.parse.

  Пример 1:
  Входные данные:
    obj1 = {}
    obj2 = { "a": 1, "b": 2 }
  Выходные данные:
    {}
  Пояснение: В obj1 не было изменений. Новые ключи "a" и "b" присутствуют только в obj2 и поэтому не сравниваются.

  Пример 2:
  Входные данные:
    obj1 = { "a": 1, "v": 3, "x": [], "z": { "a": null } }
    obj2 = { "a": 2, "v": 4, "x": [], "z": { "a": 2 } }
  Выходные данные:
    { "a": [1, 2], "v": [3, 4], "z": { "a": [null, 2] } }
  Пояснение: Значения по ключам "a", "v" и "z" изменились. Например, "a" изменилось с 1 на 2, а в объекте "z" значение по ключу "a" изменилось с null на 2.

  Пример 3:
  Входные данные:
    obj1 = { "a": 5, "v": 6, "z": [1, 2, 4, [2, 5, 7]] }
    obj2 = { "a": 5, "v": 7, "z": [1, 2, 3, [1]] }
  Выходные данные:
    { "v": [6, 7], "z": { "2": [4, 3], "3": { "0": [2, 1] } } }
  Пояснение: Ключ "a" не изменился, поэтому он не включается в результат. Изменения обнаружены в ключе "v" (6 → 7) и в массиве "z": элемент с индексом 2 изменился с 4 на 3, а в элементе с индексом 3 под индексом 0 значение изменилось с 2 на 1.

  Пример 4:
  Входные данные:
    obj1 = { "a": { "b": 1 } }
    obj2 = { "a": [5] }
  Выходные данные:
    { "a": [{ "b": 1 }, [5]] }
  Пояснение: Значения по ключу "a" имеют разные типы (объект против массива), поэтому их различия представлены непосредственно в виде массива [значение из obj1, значение из obj2].

  Пример 5:
  Входные данные:
    obj1 = { "a": [1, 2, {}], "b": false }
    obj2 = { "b": false, "a": [1, 2, {}] }
  Выходные данные:
    {}
  Пояснение: Несмотря на разное расположение ключей, объекты считаются идентичными, поэтому возвращается пустой объект.

  Ограничения:
  - obj1 и obj2 являются корректными JSON-объектами или массивами.
  - 2 <= JSON.stringify(obj1).length <= 10^4
  - 2 <= JSON.stringify(obj2).length <= 10^4
*/


// Функция objDiff сравнивает два объекта или массива и возвращает новый объект,
// содержащий только те ключи, значения которых отличаются в обоих сравниваемых структурах.
function objDiff(obj1, obj2) {
  // Если типы переданных значений отличаются, то изменения очевидны.
  // Например, один аргумент — массив, а другой — объект или примитив,
  // поэтому возвращаем их как массив [значение из obj1, значение из obj2].
  if (type(obj1) !== type(obj2)) return [obj1, obj2];

  // Если значение не является объектом (то есть это примитив, например число, строка, boolean),
  // сравниваем их напрямую.
  // Если значения равны, значит изменений нет — возвращаем пустой объект.
  // Если же значения различны, возвращаем массив с обоими значениями.
  if (!isObject(obj1)) {
    return obj1 === obj2 ? {} : [obj1, obj2];
  }

  // Определяем ключи, которые присутствуют в obj1 и также есть в obj2.
  // Согласно условию задачи, ключи, присутствующие только в одном объекте, игнорируются.
  const commonKeys = [];
  for (const key in obj1) {
    if (!Object.hasOwn(obj1, key)) continue;
    if (!Object.hasOwn(obj2, key)) continue;
    
    commonKeys.push(key);
  }

  // Создаем объект diff для накопления найденных различий.
  const diff = {};

  // Итерируемся по найденным общим ключам.
  for (const key of commonKeys) {
    // Рекурсивно вычисляем разницу для значений, соответствующих этому ключу.
    //   1. Если значения равны: Если для данного ключа obj1[key] и obj2[key] равны
    //      (например, оба числа, строки, или даже идентичные объекты), функция objDiff
    //      возвращает пустой объект {}. В этом случае subDiff становится пустым объектом,
    //      сигнализируя, что различий по этому ключу нет.
    //   2. Если значения отличаются: Если значения не совпадают, функция objDiff возвращает
    //      описание различий. Это может быть:
    //        - Массив вида [значение из obj1, значение из obj2], если сравниваются
    //          примитивные значения.
    //        - Объект с рекурсивно вложенными отличиями, если значения сами являются
    //          объектами или массивами, содержащими различные данные на каком-либо уровне
    //          вложенности.
    const subDiff = objDiff(obj1[key], obj2[key]);

    // Если subDiff содержит хотя бы один ключ, значит, были найдены изменения во вложенной структуре.
    // Если условие истинно (то есть, subDiff не пустой), происходит присваивание: diff[key] = subDiff;.
    // Таким образом, в результирующем объекте diff для текущего ключа сохраняется описание обнаруженных различий.
    if (!isObjectEmpty(subDiff)) {
      diff[key] = subDiff;
    }
  };

  // Возвращаем объект, содержащий все различия.
  return diff;
}

// Функция type возвращает строковое представление точного типа переданного значения,
// используя метод Object.prototype.toString. Например, для массива вернется "Array",
// для объекта — "Object", для числа — "Number" и т.д.
function type(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

// Функция isObject проверяет, является ли переданное значение объектом, исключая null.
// Это важно, так как typeof null возвращает "object", а null не является валидным объектом для сравнения.
// Обратите внимание: данная функция возвращает true для любых объектов, включая массивы.
// Это сделано специально, так как в JavaScript массивы имеют тип "object". 
// Для задачи сравнения двух объектов (и массивов) нам нужно обрабатывать вложенные структуры рекурсивно, 
// поэтому массивы также проходят эту проверку.
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// isObjectEmpty вернёт true как для «пустого» объекта, так и для «пустого» массива — 
// ведь в JS массивы по сути обычные объекты со строковыми индексами.
//
// Под капотом:
// - В случае пустого массива у него нет собственных перечислимых свойств-индексов 
//   (и свойство length неперечислимое), значит цикл не найдёт ни одного key 
//   и функция отработает return true.
// - Если в массиве есть хотя бы один элемент (или вы вручную добавили свойство, 
//   например arr.foo = 5), цикл остановится на первом же ключе и вернёт false.
function isObjectEmpty(obj) {
  for (const _ in obj) return false;
  return true;
}







// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Тестовые кейсы для функции objDiff.
const tests = [
  {
    description: "Примитивы: одинаковые числа",
    async test() {
      const result = objDiff(1, 1);
      const expected = {};
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Примитивы: разные числа",
    async test() {
      const result = objDiff(1, 2);
      const expected = [1, 2];
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Примитивы: одинаковые строки",
    async test() {
      const result = objDiff("hello", "hello");
      const expected = {};
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Примитивы: разные строки",
    async test() {
      const result = objDiff("hello", "world");
      const expected = ["hello", "world"];
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Одинаковые объекты: простая структура",
    async test() {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };
      const result = objDiff(obj1, obj2);
      const expected = {};
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Объекты с различными значениями",
    async test() {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const result = objDiff(obj1, obj2);
      const expected = { b: [2, 3] };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Вложенные объекты",
    async test() {
      const obj1 = { a: { b: 3, c: 4 } };
      const obj2 = { a: { b: 3, c: 5 } };
      const result = objDiff(obj1, obj2);
      const expected = { a: { c: [4, 5] } };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Массивы с примитивными значениями: одинаковые массивы",
    async test() {
      const obj1 = [1, 2, 3];
      const obj2 = [1, 2, 3];
      const result = objDiff(obj1, obj2);
      const expected = {};
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Массивы с примитивными значениями: различия в элементах",
    async test() {
      const obj1 = [1, 2, 3];
      const obj2 = [1, 4, 3];
      const result = objDiff(obj1, obj2);
      // Разница обнаружена в индексе "1"
      const expected = { "1": [2, 4] };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Массивы с вложенными объектами",
    async test() {
      const obj1 = [{ a: 1 }, { b: 2 }];
      const obj2 = [{ a: 1 }, { b: 3 }];
      const result = objDiff(obj1, obj2);
      const expected = { "1": { b: [2, 3] } };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Разные типы для одного ключа",
    async test() {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: [5] };
      const result = objDiff(obj1, obj2);
      const expected = { a: [{ b: 1 }, [5]] };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Сложная структура (из условия задачи)",
    async test() {
      const obj1 = { a: 1, v: 3, x: [], z: { a: null } };
      const obj2 = { a: 2, v: 4, x: [], z: { a: 2 } };
      const result = objDiff(obj1, obj2);
      const expected = { a: [1, 2], v: [3, 4], z: { a: [null, 2] } };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Ключи, присутствующие только в одном объекте",
    async test() {
      const obj1 = { a: 1 };
      const obj2 = { a: 2, b: 3 };
      const result = objDiff(obj1, obj2);
      // Ключ "b" игнорируется, поскольку отсутствует в obj1
      const expected = { a: [1, 2] };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
  {
    description: "Сложная вложенная структура с объектами и массивами",
    async test() {
      const obj1 = {
        a: 1,
        b: {
          c: 3,
          d: [1, { e: 5 }, 3],
        },
        f: "test",
      };
      const obj2 = {
        a: 1,
        b: {
          c: 4,            // Изменилось
          d: [1, { e: 7 }, 3], // Изменения во вложенном объекте по индексу 1
        },
        f: "test",
      };
      const result = objDiff(obj1, obj2);
      const expected = {
        b: {
          c: [3, 4],
          d: { "1": { e: [5, 7] } }
        }
      };
      assert(JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`);
    },
  },
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для функции objDiff...");
  let hasErrors = false;
  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i].test(); // тесты асинхронные, даже если функция objDiff работает синхронно
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
    console.log("🎉 Все тесты для функции objDiff завершены успешно.");
  }
})();
