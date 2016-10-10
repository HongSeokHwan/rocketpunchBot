var defaultDelay = 3000;
​
var click = function (selector) {
  $(selector)[0].click();
};

var wait = function (timeout, callback) {
  var callback = typeof(timeout) === 'function' ? timeout : callback;
  var timeout = typeof(timeout) === 'function' ? defaultDelay : timeout;
  return setTimeout(callback, timeout);
};

var log = function (msg) {
  console.log([new Date(), msg].join(' '));
};
​
var page = require('webpage').create();
​
page.viewportSize = {width: 1366, height: 768};
page.onConfirm = function () { return true; };
page.onConsoleMessage = function(msg) {
  // log('Inside: ', msg);
};
​
page.open('https://www.rocketpunch.com').then(function (status) {
  if (status != 'success') {
    log('Something went terribly wrong!');
    slimer.exit()
  }
  log('Opened the main page');
  page.render('00 - init.png');
​
  page.evaluate(click, '.nav .login a');
  wait(function () {
    page.render('01 - login opened.png');
​
    page.evaluate(function () {
      $('form#form_login_inline')
        .find('[name="email"]').val('EMAIL').end()
        .find('[name="password"]').val('PASSWORD').end()
        .find('[type="submit"]')[0].click();
    });
​
    wait(function () {
      log('Login succeeded');
      page.render('02 - login succeeded.png');
​
      page.open('https://www.rocketpunch.com/companies/tppartners/edit').then(function (status) {
        page.render('03 - company edit opened.png');
​
        page.evaluate(click, '#id_description_save');
​
        wait(function () {
          log('Company information edited');
          page.render('04 - company edit succeeded.png');
​
          page.open('https://www.rocketpunch.com/jobs/9505/edit').then(function (status) {
            page.render('05 - job edit opened.png');
​
            page.evaluate(click, '#job_post_form [type="submit"]');
            wait(function () {
              log('Job information edited');
              page.render('06 - job edit succeeded.png');
​
              slimer.exit();
            });
          });
        });
      });
    });
  });
});