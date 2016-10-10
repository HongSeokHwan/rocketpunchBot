var defaultDelay = 3000;

var click = function (selector) {
  $(selector)[0].click();
};

var wait = function (timeout, callback) {
  var callback = typeof (timeout) === 'function' ? timeout : callback;
  var timeout = typeof (timeout) === 'function' ? defaultDelay : timeout;
  return setTimeout(callback, timeout);
};

var log = function (msg) {
  console.log([new Date(), msg].join(' '));
};

var date = new Date();
date = date.toString();

var page = require('webpage').create();

page.viewportSize = {width: 768, height: 768};

page.onConfirm = function () {
  return true
};

page.onConsoleMessage = function (msg) {
  log('Inside: ', msg);
};

page.open('https://www.rocketpunch.com').then(function (status) {
  console.log(status);
  if (status != 'success') {
    log('Somthing went terribly wrong');
    slimer.exit();
  }
  log('Opend the main page');
  page.render('./img/00' + date + ' - init.png');

  page.evaluate(click, '[data-target="#loginModal"]');
  wait(function () {
    page.render('./img/01 - login opened.png');
    page.evaluate(function () {
      $('form#form_login_inline')
        .find('[name="email"]').val('wjlee@qoontree.com').end()
        .find('[name="password"]').val('Cjswosla1').end()
        .find('[type="submit"]').click();
    });

    wait(function () {
      log('Login succeded');
      page.render('./img/02 - login succeeded.png');

      page.open('https://www.rocketpunch.com/companies/qoontree/edit').then(function (status) {
        page.render('./img/03 - company edit opened.png');

        page.evaluate(click, '#id_description_save');

        wait(function () {
          log('Company information edited');
          page.render('./img/04 - company edit succeeded.png');

          page.open('https://www.rocketpunch.com/jobs/11850/edit').then(function (status) {
            page.render('./img/05 - job edit opened.png');

            page.evaluate(click, '#job_post_form [type="submit"]');
            wait(function () {
              log('Job information edited');
              page.render('./img/06 - job edit succeeded.png');

              slimer.exit();
            });
          });

          slimer.exit();

        });
      });
    });
  });
});
