var gulp = require('gulp');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var sass = require('gulp-sass');


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json', 'templates/**']

,
	'style': {
		all: ['./public/styles/**/*.scss', './public/styles/**/*.sass'],
		output: './public/styles/'
	}

};

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: 'localhost:3000',
        port: 8000
    });
});


// gulp.task('watch:sass', function () {
// 	gulp.watch(paths.style.all, ['sass']);
// });

// gulp.task('watch:src', function () {
// 	gulp.watch(paths.src, ['src-reload']);
// });

// gulp.task('src-reload', reload);

gulp.task('sass', function(){
	gulp.src(paths.style.all)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.style.output))
		.pipe(browserSync.stream());
});



gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'keystone.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});


//gulp.task('runKeystone', shell.task('nodemon keystone.js'));
gulp.task('watch', function(){
	gulp.watch(paths.style.all, ['sass']);
	gulp.watch(paths.src, reload);
});


//gulp.task('default', ['watch', 'runKeystone', 'browser-sync']);
gulp.task('default', ['browser-sync', 'watch']);
