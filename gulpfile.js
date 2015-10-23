"use strict";

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del'),
    conf = {
        port: 9005,
        devBaseUrl: 'http://localhost',
        liveReload: true,
        root: ['dist'],
        index: 'index.html',
        js: {
            entry: './app/scripts/app.js',
            watch: './app/scripts/**/*.js',
            debug: true,
            output: 'bundle.js',
            destination: 'dist/js'
        },
        sass: {
            main: './app/scss/main.scss',
            path: './app/scss/**/*.scss',
            dist: './dist/css'
        },
        html: {
            path: './app/*.html',
            dist: './dist'
        }
    };

//Start a local development server
gulp.task('connect', function () {
    connect.server({
        root: conf.root[0],
        port: conf.port,
        base: conf.devBaseUrl,
        livereload: conf.liveReload
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src(conf.root[0] + '/' + conf.index)
        .pipe(open({uri: conf.devBaseUrl + ':' + conf.port + '/'}));
});

gulp.task('sass', function () {
    gulp.src(conf.sass.main)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(conf.sass.dist))


});

gulp.task('html', function () {
    gulp.src(conf.html.path)
        .pipe(gulp.dest(conf.html.dist));
    // .pipe(connect.reload());
});

gulp.task('es6Transform', function () {
    browserify({
        entries: conf.js.entry,
        debug: conf.js.debug
    })
        .transform(babelify)
        .on('error', gutil.log)
        .bundle()
        .on('error', gutil.log)
        .pipe(source(conf.js.output))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(conf.js.destination));
    //.pipe(connect.reload());
});

gulp.task('reload', function () {
    gulp.src(conf.html.path)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(conf.js.watch, ['es6Transform', 'reload']);
    gulp.watch(conf.html.path, ['html', 'reload']);
    gulp.watch(conf.sass.path, ['sass', 'reload']);

});

gulp.task('default', ['open', 'es6Transform', 'html', 'sass', 'watch']);