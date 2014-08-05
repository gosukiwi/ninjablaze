'use strict';

var gulp = require('gulp');

var less = require('gulp-less');
//var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var paths = {
  less: 'res/less/**/*.less',
  lessMain: 'res/less/style.less',
  scripts: 'res/js/**/*.js',
  images: 'res/img/**/*',
  fonts: 'res/fonts/**/*',
  bower: 'bower_components/**/*',
};

gulp.task('bower', function() {
  return gulp.src(paths.bower)
    .pipe(gulp.dest('web/vendor'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    //.pipe(uglify())
    .pipe(gulp.dest('web/js'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    // Pass in options to the task
    .pipe(gulp.dest('web/fonts'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('web/img'));
});

gulp.task('less', function() {
  return gulp.src(paths.lessMain)
    // Pass in options to the task
    .pipe(less())
    .pipe(gulp.dest('web/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.bower, ['bower']);
  gulp.watch(paths.fonts, ['images']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'less', 'scripts', 'images', 'bower', 'fonts']);
