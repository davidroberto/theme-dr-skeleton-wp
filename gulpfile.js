var gulp = require('gulp');

var acss	= require('gulp-atomizer'), // create css atomic file by watching the classes used in html, js or php files
	watch	= require('gulp-watch'), // watch the change in files in order to launch gulp plugin
	plumber = require("gulp-plumber"), // plumber allows to see errors without  break the run (watch etc)
	cssnano = require('gulp-cssnano'), // minify css
	sass    = require('gulp-sass'), // Gulp pluign for Sass compilation
	notify	= require('gulp-notify'), // notify error in gulp error bubble
	cleanCSS = require('gulp-clean-css'), // minify css
	sourcemaps = require('gulp-sourcemaps'), // create a source map
	concat = require('gulp-concat'), // concat multiple file into one
	rename = require('gulp-rename'), //rename files
	jshint = require('gulp-jshint'),  // hint the syntax issue in javascript files
	uglify = require('gulp-uglifyjs'), //minify the js and generate sourcemap
	imagemin = require('gulp-imagemin'); //minify img

var acssConf = {
    "breakPoints": {
		'xs': '@media screen and (max-width: 600px)',
        'sm': '@media screen and (max-width: 769px)',
        'minsm': '@media screen and (min-width: 769px)',
        'smdsmall' : '@media screen and (max-width: 815px)',
        'smd': '@media screen and (max-width: 991px)',
        'xsmd': '@media screen and (max-width: 1100px)',
        'md': '@media screen and (max-width: 1200px)',
        'lg': '@media screen and (min-width: 1200px)'
    }
};

//define the paths to differents kind of files
var paths = {

	phpfiles: '*.php',
	phpfilesfunction: './functions/*.php',
	twigfiles: './views/*.twig',
    twigsubfolderfiles: './views/*/*.twig',

	stylesPartials: ['./gulp-assets/css/src/sass/partials/*.scss'],
	stylesSassMain: ['./gulp-assets/css/src/sass/main.scss'],
	stylesSassDestination: './gulp-assets/css/src/sass/',
	stylesAtomicDestination: './gulp-assets/css/src/atomic/',
	stylesDestination: './gulp-assets/css/dist/',
	stylesAtomicSRC: './gulp-assets/css/src/atomic/atomic.css',
	stylesSassSRC: './gulp-assets/css/src/sass/main.css',
	stylesSRC: './gulp-assets/css/dist/style.css',

	jsSRC: './gulp-assets/js/src/*/*.js',
	jsMainSRC: './gulp-assets/js/src/custom.js',
	jsDestination: './gulp-assets/js/dist/',

	imagesSRC: './gulp-assets/img/src/*.{png,jpg,gif,svg}', // Source folder of images which should be optimized.
	imagesSRCFolder: './gulp-assets/img/src/**',
	imagesDestination: './gulp-assets/img/dist/', // Destination folder of optimized images. Must be different from the imagesSRC folder.
};


// create an atomic css file with the atomic class used in all the html files
gulp.task('acss', function() {
  return gulp.src( [paths.phpfiles, paths.phpfilesfunction, paths.twigfiles, paths.twigsubfolderfiles] )
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")})) // use notify as errorsHandler for plumber, so that we can see errors in bubble without breaking the run
    .pipe(acss('atomic.css', acssConf))
    .pipe(gulp.dest(paths.stylesAtomicDestination))
    .pipe( notify( { message: 'TASK: "acss" Completed!', onLast: true } ) );
});


// compile the main sass file into a css file
gulp.task('sass', function() {
	return gulp.src( paths.stylesSassMain )
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")})) // use notify as errorsHandler for plumber, so that we can see errors in bubble without breaking the run
	.pipe(sass())
	.pipe(gulp.dest( paths.stylesSassDestination ) )
	.pipe( notify( { message: 'TASK: "sass" Completed!', onLast: true } ) );
});


// takes the atomic final css and sass final css and concat them
gulp.task('concatCSS', ['sass', 'acss'], function() {
	return gulp.src( [paths.stylesAtomicSRC, paths.stylesSassSRC] )
		.pipe(concat('styles.css'))
		.pipe(gulp.dest ( paths.stylesDestination ) )
		// .pipe(sourcemaps.init())
			.pipe(cleanCSS())
		// .pipe(sourcemaps.write())
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest ( paths.stylesDestination ) )
		.pipe( notify( { message: 'TASK: "concatCSS" Completed!', onLast: true } ) );
});



// hint concat, minify the js files and generate a sourcemap
gulp.task('js', function(){
	gulp.src(paths.jsSRC)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(jshint())
		// Use gulp-notify as jshint reporter
		.pipe(notify(function (file) {
			if (file.jshint.success) {
				// Don't show something if success
				return false;
			}

			var errors = file.jshint.results.map(function (data) {
				if (data.error) {
					return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
				}
			}).join("\n");
			return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
		}))
		.pipe(uglify('global.min.js', {
			outSourceMap: true
		}))
		.pipe(gulp.dest ( paths.jsDestination ) )
		.pipe( notify( { message: 'TASK: "js" Completed!', onLast: true } ) );
});

// optimize the image inside the src folder
gulp.task( 'images', function() {
	return gulp.src( paths.imagesSRC )
		.pipe( imagemin( {
					progressive: true,
					optimizationLevel: 3, // 0-7 low-high
					interlaced: true,
					svgoPlugins: [{removeViewBox: false}]
				} ) )
		.pipe(gulp.dest( paths.imagesDestination ))
		.pipe( notify( { message: 'TASK: "images" Completed!', onLast: true } ) );
});

// watch the change and run tasks
gulp.task('watch', function() {
  gulp.watch([paths.phpfiles, paths.phpfilesfunction, paths.twigfiles, paths.twigsubfolderfiles], ['acss', 'concatCSS']); // watch the change in the html file and run acss
  gulp.watch(paths.stylesPartials, ['sass', 'concatCSS']); // watch the change in the sass partials files and run sass
  gulp.watch(paths.jsSRC, ['js']); // watch the change in the sass partials files and run sass
  // gulp.watch(['sass/**/*.scss', 'sass/**/**/*.scss'], ['sassps']); // watch the change in the sass prestashop files and run sassps
});


// lauch the acss and watch tasks when the gulp command is executed
gulp.task('default',['acss', 'sass', 'concatCSS', 'js', 'images', 'watch']);
gulp.task('deploy',['acss', 'sass', 'concatCSS', 'js', 'images']);


