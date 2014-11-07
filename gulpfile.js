'use strict';

var gulp      = require('gulp');
var less      = require('gulp-less');
var prefixer  = require('gulp-autoprefixer');
var csscomb   = require('gulp-csscomb');
//var uglify = require('gulp-uglify');
var imagemin  = require('gulp-imagemin');

var paths = {
  less: 'frontend/src/less/**/*.less',
  lessMain: 'frontend/src/less/style.less',
  scripts: 'frontend/src/js/**/*',
  images: 'frontend/src/img/**/*',
  fonts: 'frontend/src/fonts/**/*',
  bower: 'bower_components/**/*',
};

gulp.task('bower', function() {
  return gulp.src(paths.bower)
    .pipe(gulp.dest('frontend/build/vendor'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    //.pipe(uglify())
    .pipe(gulp.dest('frontend/build/js'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    // Pass in options to the task
    .pipe(gulp.dest('frontend/build/fonts'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('frontend/build/img'));
});

gulp.task('less', function() {
  return gulp.src(paths.lessMain)
    // Pass in options to the task
    .pipe(less())
    .pipe(prefixer([
      'Android 2.3',
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24', // Firefox 24 is the latest ESR
      'Explorer >= 8',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6']))
    .pipe(csscomb())
    .pipe(gulp.dest('frontend/build/css'));
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
