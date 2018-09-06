'use strict';

var gulp        = require('gulp');
var isparta     = require('isparta');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var server      = require('gulp-develop-server' );
var webpack     = require("webpack");
var exec        = require('child_process').exec;
var fs          = require("fs");
 
gulp.task('default', ['build']);

gulp.task('build', function(done) {
  runSequence('clean', 'node', done);
});

gulp.task('node', function() {
    return gulp.src('src/**/*.js')
        .pipe(plugins.babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('clean', function () {
  return gulp.src('lib', { read: false })
      .pipe(plugins.rimraf());
});

gulp.task('watch', ['build'], function() {
  gulp.watch('lib/**/*', ['build']);
});

