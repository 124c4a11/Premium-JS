/*
  debounce(f, ms) – это обёртка, которая откладывает вызовы f, пока не пройдёт ms миллисекунд бездействия (без вызовов, «cooldown period»), а затем вызывает f один раз с последними аргументами.

  Задача: https://learn.javascript.ru/task/debounce
  Песочница с тестами: https://plnkr.co/edit/n6tFb51VqoL8H3Qb?p=preview&preview
*/













/*
function debounce(func, ms) {
  let timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}
*/
