var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
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
        html: {
            path: './app/*.html',
            dist: './dist'
        }
    };

//Start a local development server
gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        port: conf.port,
        base: conf.devBaseUrl,
        livereload: conf.liveReload
    });
});

gulp.task('open', ['connect'], function () {
    gulp.src(conf.root[0] + '/' + conf.index)
        .pipe(open({uri: conf.devBaseUrl + ':' + conf.port + '/'}));
});

gulp.task('html', function () {
    gulp.src(conf.html.path)
        .pipe(gulp.dest(conf.html.dist))
        .pipe(connect.reload());
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
        .pipe(gulp.dest(conf.js.destination))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(conf.js.watch, ['es6Transform']);
    gulp.watch(conf.html.path, ['html']);
});

gulp.task('default', ['open', 'watch']);