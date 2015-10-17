
var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint");


var jsHintOptions = { boss: true }

gulp.task('app-js', function () {
    return gulp.src("app/**/*.js")
      .pipe(jshint(jsHintOptions))
      .pipe(jshint.reporter('default'))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/app/'));
});

gulp.task('client-js', function () {
    return gulp.src(['!client/main.js','client/setup.js', "client/**/*.js"])
      .pipe(jshint(jsHintOptions))
      .pipe(jshint.reporter('default'))
      .pipe(concat('app.js'))
      .pipe(gulp.dest('dist/client/'));
});

gulp.task('watch', function() {
    gulp.watch("app/**/*.js", ['app-js']);
    gulp.watch("client/**/*.js", ['client-js']);
});