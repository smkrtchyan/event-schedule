'use strict';

// Config object used by gulp

var config = {};

config.app = {
  dist: 'app/dist',
  src: 'app/src'
}

config.styles 		= config.app.src + '/styles/**/*.scss';
config.templates  = config.app.src + '/modules/**/*.template.html';

config.fonts = [
  'app/bower_components/font-awesome/fonts/**/*.{ttf,woff,woff2,otf,eof,eot,svg}',
  'app/bower_components/bootstrap-sass/assets/fonts/bootstrap/**/*.{ttf,woff,woff2,otf,eof,eot,svg}'
]

config.scripts = [
  "app/bower_components/jquery/dist/jquery.min.js",
  "app/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js",
  "app/bower_components/moment/moment.js",

  "app/bower_components/angular/angular.min.js",
  "app/bower_components/angular-sanitize/angular-sanitize.min.js",
  "app/bower_components/angular-route/angular-route.min.js",
  "app/bower_components/angular-moment/angular-moment.min.js",

  //"bower_components/angular-bootstrap/ui-bootstrap.min.js",
  //"bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",

  "app/bower_components/angular-ui-notification/dist/angular-ui-notification.min.js",
  "app/bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js",
  "app/bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js",

  config.app.src + '/modules/**/*.module.js',
  config.app.src + '/modules/**/*.service.js',
  config.app.src + '/modules/**/*.component.js',
  config.app.src + '/app.js',
  config.app.src + '/app.config.js'
  
]


module.exports = config;
