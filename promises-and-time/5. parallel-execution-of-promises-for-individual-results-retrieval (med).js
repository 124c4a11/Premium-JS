/*
  LeetCode 2795. Parallel Execution of Promises for Individual Results Retrieval

  Дан массив functions, требуется вернуть промис.  
  functions — массив функций, каждая из которых возвращает промис fnPromise.  
  Каждый fnPromise может быть разрешён или отклонён.  

  Если fnPromise разрешается успешно:  
      obj = { status: "fulfilled", value: <значение> }  

  Если fnPromise отклоняется:  
      obj = { status: "rejected", reason: <причина отклонения> }  

  Итоговый промис должен разрешиться массивом таких объектов obj в том же порядке, что и функции в исходном массиве.  

  Реализовать без использования встроенного метода Promise.allSettled().  

  Пример 1:
      Input: functions = [
          () => new Promise(resolve => setTimeout(() => resolve(15), 100))
      ]
      Output: {"t":100,"values":[{"status":"fulfilled","value":15}]}

  Пример 2:
      Input: functions = [
          () => new Promise(resolve => setTimeout(() => resolve(20), 100)),
          () => new Promise(resolve => setTimeout(() => resolve(15), 100))
      ]
      Output:
      {
          "t":100,
          "values": [
              {"status":"fulfilled","value":20},
              {"status":"fulfilled","value":15}
          ]
      }

  Пример 3:
      Input: functions = [
          () => new Promise(resolve => setTimeout(() => resolve(30), 200)),
          () => new Promise((resolve, reject) => setTimeout(() => reject("Error"), 100))
      ]
      Output:
      {
          "t":200,
          "values": [
              {"status":"fulfilled","value":30},
              {"status":"rejected","reason":"Error"}
          ]
      }

  Ограничения:
      1 <= functions.length <= 10
*/


function promiseAllSettled(functions) {
  return new Promise((resolve) => {
    if (!Array.isArray(functions) || !functions.length) {
      return resolve([]);
    }

    const n = functions.length;
    const results = [];

    let completedCount = 0;
    for (let i = 0; i < n; i++) {
      functions[i]()
        .then((value) => ({ status: 'fulfilled', value }))
        .catch((reason) => ({ status: 'rejected', reason }))
        .then((result) => {
          results[i] = result;
          completedCount++;

          if (completedCount === n) {
            resolve(results);
          }
        });
    }
  });
}









// Вспомогательная функция assert, выбрасывающая ошибку, если условие не выполнено.
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/*
  Тестовые кейсы для функции promiseAllSettled.
*/
const tests = [
  {
    description: "Аргумент не является массивом",
    async test() {
      // Проверяем на число (можно заменить на строку, null и т.д.)
      const functions = 123;
      const result = await promiseAllSettled(functions);
      const expected = [];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Пустой массив функций",
    async test() {
      const functions = [];
      const result = await promiseAllSettled(functions);
      const expected = [];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Одиночный успешно выполненный промис",
    async test() {
      const functions = [() => Promise.resolve(1)];
      const result = await promiseAllSettled(functions);
      const expected = [{ status: "fulfilled", value: 1 }];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Одиночный отклонённый промис",
    async test() {
      const functions = [() => Promise.reject("error")];
      const result = await promiseAllSettled(functions);
      const expected = [{ status: "rejected", reason: "error" }];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Несколько успешно выполненных промисов с разной задержкой",
    async test() {
      const functions = [
        () => new Promise(res => setTimeout(() => res(10), 50)),
        () => new Promise(res => setTimeout(() => res(20), 10))
      ];
      const start = Date.now();
      const result = await promiseAllSettled(functions);
      const duration = Date.now() - start;
      const expected = [
        { status: "fulfilled", value: 10 },
        { status: "fulfilled", value: 20 }
      ];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
      assert(
        duration >= 50,
        `Ожидалось время ≥ 50ms, получено ${duration}ms`
      );
    }
  },
  {
    description: "Порядок результата сохраняется независимо от порядка завершения",
    async test() {
      const functions = [
        () => new Promise(res => setTimeout(() => res("first"), 30)),
        () => new Promise((_, rej) => setTimeout(() => rej("fail"), 10))
      ];
      const result = await promiseAllSettled(functions);
      const expected = [
        { status: "fulfilled", value: "first" },
        { status: "rejected", reason: "fail" }
      ];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  },
  {
    description: "Смешанные промисы: немедленное, отложенное разрешение и отклонение",
    async test() {
      const functions = [
        () => Promise.resolve("a"),
        () => new Promise((_, rej) => setTimeout(() => rej("b error"), 20)),
        () => new Promise(res => setTimeout(() => res("c"), 10))
      ];
      const result = await promiseAllSettled(functions);
      const expected = [
        { status: "fulfilled", value: "a" },
        { status: "rejected", reason: "b error" },
        { status: "fulfilled", value: "c" }
      ];
      assert(
        JSON.stringify(result) === JSON.stringify(expected),
        `Ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(result)}`
      );
    }
  }
];

// Запуск тестов.
(async () => {
  console.log("Запуск тестов для promiseAllSettled...");
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
    console.log("🎉 Все тесты для promiseAllSettled завершены успешно.");
  }
})();
