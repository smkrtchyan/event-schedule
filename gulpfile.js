'use strict';

var config = require('./config/build.config.js'),
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  lazypipe = require('lazypipe'),
  addStream = require('add-stream'),
  rimraf = require('rimraf');


//
// Reusable pipelines
//
var styles = lazypipe()
  .pipe($.sass)
  .pipe($.autoprefixer, 'last 2 version')
  .pipe(gulp.dest, config.app.dist + '/styles');


function prepareTemplates() {
  return gulp.src(config.templates)
    .pipe($.angularTemplatecache({
    	root : 'src/modules/',
      module: 'esCore.template'
    }));
}

//
// Tasks
//
gulp.task('styles', function() {
  return gulp.src(config.styles)
    .pipe($.plumber())
    .pipe(styles());
});

gulp.task('scripts', function() {
  return gulp.src(config.scripts)
    .pipe($.plumber())

  // append the template js onto app.js
  .pipe(addStream.obj(prepareTemplates()))
    .pipe($.concat('app.min.js'))
    //.pipe($.uglify())
    .pipe(gulp.dest(config.app.dist + '/scripts'))
});

gulp.task('fonts', function() {
   return gulp.src(config.fonts)
   .pipe(gulp.dest(config.app.dist + '/fonts'));
});

gulp.task('clean:dist', function (cb) {
  rimraf(config.app.dist, cb);
});


gulp.task('watch', ['fonts', 'styles', 'scripts'], function() {

  gulp.watch(config.styles, ['styles']);
  gulp.watch(config.scripts,['scripts']);
  gulp.watch(config.templates,['scripts']);
})

gulp.task('build', ['clean:dist', 'fonts', 'styles', 'scripts']);