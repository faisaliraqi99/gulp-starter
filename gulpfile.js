const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoPrefixer = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const fileinclude = require('gulp-file-include');
const uglify = require('gulp-uglify');

const path = {
  sass: './src/sass/**/*.{sass,scss}',
  css: {
    dev: './src/css',
    dist: './dist/css'
  },
  fonts: {
    dev: './src/fonts/**/*',
    dist: './dist/fonts'
  },
  img: {
    dev: './src/img/**/*',
    dist: './dist/img',
  },
  js: {
    common: './src/js/common.js',
    dev: './src/js',
    dist: './dist/js'
  },
  html: {
    dev: './src/*.html',
    dist: './dist/'
  },
  base: './src/'
};

function styles() {
  return gulp.src(path.sass)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: 'Sass task',
          message: err.message
        };
      })
    }))
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(autoPrefixer([
      'last 15 versions', '> 5%', 'ie 8'
    ]))
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(path.css.dev))
    .pipe(gulp.dest(path.css.dist));
}

gulp.task('styles', styles);

function scripts() {
  return gulp.src(path.js.common)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: 'JavaScript task',
          message: err.message
        };
      })
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(path.js.dev))
    .pipe(gulp.dest(path.js.dist));
}

gulp.task(('scripts', scripts));

function fonts() {
  return gulp.src(path.fonts.dev)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: 'Fonts task',
          message: err.message
        };
      })
    }))
    .pipe(gulp.dest(path.fonts.dist));
}

gulp.task('fonts', fonts);

function images() {
  return gulp.src(path.img.dev)
    .pipe(imagemin())
    .pipe(gulp.dest(path.img.dist));
}

gulp.task('images', images);

function site() {
  return gulp.src(path.html.dev)
    .pipe(gulp.dest(path.html.dist));
}

gulp.task('html', site);

function watch() {
  gulp.watch(path.sass, styles)
  gulp.watch(path.js.dev, scripts)
  gulp.watch(path.img.dev, images)
  gulp.watch(path.html.dev, site)
}

gulp.task('html', site);

gulp.task('watch', gulp.series(gulp.parallel(styles, scripts, fonts, images, site), watch));
gulp.task('default', gulp.series(gulp.parallel(styles,scripts,fonts,images,site)));