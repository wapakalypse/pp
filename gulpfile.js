let gulp         = require('gulp'),
	sass         = require('gulp-sass'),
    babel        = require('gulp-babel'),
	watch        = require('gulp-watch'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'), 
	autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() { 
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({ stream: true }))
});


gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(cssnano())
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
	    .pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app'));
});

gulp.task('img', function() {
	return gulp.src('app/images/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true
		}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('clean', async function() {
	return del.sync('dist');
});

gulp.task('prebuild', async function() {

	var buildCss = gulp.src('app/main.css')
	.pipe(gulp.dest('dist'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/scripts.js')
	.pipe(gulp.dest('dist'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
	gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('app/*.html', gulp.parallel('code'));
//	gulp.watch('app/*.js', gulp.parallel('scripts'));
});

gulp.task('serve', gulp.parallel('sass', 'scripts', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'scripts'));