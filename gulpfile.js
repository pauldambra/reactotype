'use strict';

var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sourceFile = './app/scripts/app.js';
var destFolder = './dist/scripts';
var destFileName = 'app.js';
var mocha = require('gulp-mocha');

// Styles
gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10,
			loadPath: ['app/bower_components']
		}))
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('dist/styles'))
		.pipe($.size());
});

// Scripts
gulp.task('scripts', ['test'], function () {
	var bundler = watchify(browserify({
		entries: [sourceFile],
		insertGlobals: true,
		cache: {},
		packageCache: {},
		fullPaths: true
	}));

	function rebundle() {
		return bundler.bundle()
			// log errors if they happen
			.on('error', $.util.log.bind($.util, 'Browserify Error'))
			.pipe(source(destFileName))
			.pipe(gulp.dest(destFolder));
	}

	bundler.on('update', rebundle);

	return rebundle();
});

gulp.task('test', function() {
    //require this here so that mocha can transform jsx
	require('./tests/compiler.js');
	return gulp.src(['tests/*Spec.js'], { read: false })
	.pipe(mocha({
		reporter: 'spec',
		globals: {
		should: require('should')
		}
	}));
});

// HTML
gulp.task('html', function () {
	return gulp.src('app/*.html')
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

// Images
gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});

// Clean
gulp.task('clean', function (cb) {
	cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function(){
	return gulp.src('./app/*.html')
				 .pipe($.useref.assets())
				 .pipe($.useref.restore())
				 .pipe($.useref())
				 .pipe(gulp.dest('dist'));
});

// Webserver
gulp.task('serve', function () {
	gulp.src('./dist')
		.pipe($.webserver({
			livereload: true,
			port: 9000
		}));
});

// Bower helper
gulp.task('bower', function() {
	gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
		.pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
	gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
		.pipe(gulp.dest('dist/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
	return gulp.src(['app/*.txt', 'app/*.ico'])
		.pipe(gulp.dest('dist/'))
		.pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

	// Watch .json files
	gulp.watch('app/scripts/**/*.json', ['json']);

	// Watch .html files
	gulp.watch('app/*.html', ['html']);
	
	// Watch .scss files
	gulp.watch('app/styles/**/*.scss', ['styles']);

	// Watch image files
	gulp.watch('app/images/**/*', ['images']);
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras']);

// Default task
gulp.task('default', ['clean', 'build']);