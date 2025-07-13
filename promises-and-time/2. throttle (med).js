/*
  throttle(f, ms) - При многократном вызове он передает вызов f не чаще одного раза в ms миллисекунд.

  Задача: https://learn.javascript.ru/task/throttle
  Песочница с тестами: https://plnkr.co/edit/16I58Uk0GmAG7wNW?p=preview&preview
*/


function f(a) {
  console.log(a)
}

function throttle(f, ms) {
  //Решение
}

// f1000 передаёт вызовы f максимум раз в 1000 мс
let f1000 = throttle(f, 1000);

f1000(1); // показывает 1
f1000(2); // (ограничение, 1000 мс ещё нет)
f1000(3); // (ограничение, 1000 мс ещё нет)

// когда 1000 мс истекли ...
// ...выводим 3, промежуточное значение 2 было проигнорировано



/*
Вызов throttle(func, ms) возвращает wrapper.

1. Во время первого вызова обёртка просто вызывает func и устанавливает состояние задержки (isThrottled = true).

2. В этом состоянии все вызовы запоминаются в saveArgs / saveThis. Обратите внимание, что контекст и аргументы одинаково важны и должны быть запомнены. Они нам нужны для того, чтобы воспроизвести вызов позднее.

3. Затем по прошествии ms миллисекунд срабатывает setTimeout. Состояние задержки сбрасывается (isThrottled = false). И если мы проигнорировали вызовы, то «обёртка» выполняется с последними запомненными аргументами и контекстом.

На третьем шаге выполняется не func, а wrapper, потому что нам нужно не только выполнить func, но и ещё раз установить состояние задержки и таймаут для его сброса.
*/




/*
  function throttle(func, ms) {

    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) {
        // запоминаем последние аргументы для вызова после задержки
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      // в противном случае переходим в состояние задержки
      func.apply(this, arguments);

      isThrottled = true;

      // настройка сброса isThrottled после задержки
      setTimeout(function() {
        isThrottled = false;
        if (savedArgs) {
          // если были вызовы, savedThis/savedArgs хранят последний из них
          // рекурсивный вызов запускает функцию и снова устанавливает время задержки
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

*/
