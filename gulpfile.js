'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	browsersync = require('browser-sync'),
	reload = browsersync.reload,
	clean = require ('gulp-clean'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	prefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-cssmin'),
	sass = require('gulp-sass'),
	imageop = require('gulp-image-optimization'),
	uglify = require('gulp-uglify');


//Path
var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/main.js',
        scss: 'app/scss/main.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        scss: 'app/scss/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};


//Server task
gulp.task('server', function () {
	browsersync({
		port: 9000,
		server: {
			baseDir: 'dist'
		}
	});
});


//Clean task
gulp.task('clean', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});


//Html build
gulp.task('html:build', function () {
	gulp.src(path.app.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});


//Js build
gulp.task('js:build', function () {
    gulp.src(path.app.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});


//Style build
gulp.task('style:build', function () {
	gulp.src(path.app.scss)
	 .pipe(sourcemaps.init())
        .pipe(sass({
        	includePaths: require('node-normalize-scss').includePaths,
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});


//Fonts build
gulp.task('fonts:build', function () {
	gulp.src(path.app.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});


//Img build
gulp.task('img:build', function () {
	gulp.src(path.app.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});


//General build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build'
]);


//Watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.scss], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});



//Default task
gulp.task('default', ['build', 'server', 'watch']);
