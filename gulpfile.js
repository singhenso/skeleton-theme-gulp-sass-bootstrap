/* Needed gulp config */
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var neat = require('node-neat');
var reload = browserSync.reload;

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    // 'assets/js/vendor/example.js',
    'assets/js/app.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});

/* CSS vendor task */
gulp.task('css-vendor', function () {
    gulp.src([
      /* Add your CSS files here, they will be combined in this order */

      //Bootstrap
      'assets/css/vendor/bootstrap.min.css',

      //Vendor
      'assets/css/vendor/example.css'
      ])
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('dist/assets/css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('dist/assets/css'));
});


/* CSS vendor task */
gulp.task('fonts', function () {
    gulp.src([
      /* fonts */
      // 'assets/fonts/et-lineicons/css/style.css',
      ])
      .pipe(concat('fonts.css'))
      .pipe(gulp.dest('dist/assets/fonts'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest('dist/assets/fonts'));
});

/* Responsive CSS that goes after SCSS Build*/
gulp.task('responsive', function() {
  gulp.src([/* Add your CSS files here, they will be combined in this order */
    'assets/css/vendor/responsive.css'])
    .pipe(concat('responsive.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'));
});


/* Sass task */
gulp.task('sass', function () {
    gulp.src('assets/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['dist/assets/css/*.css', 'dist/assets/js/*.js'], {
        /*
        I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
        */
        //proxy: 'your_dev_site.url'
        /* For a static server you would use this: */

        server: {
            baseDir: 'dist'
        }

    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['css-vendor' , 'fonts', 'responsive','sass', 'browser-sync'], function () {
  /* Watch CSS, run the sass task on change. */
    gulp.watch(['assets/css/*.css', 'assets/css/**/*.css'], ['css-vendor'])
    /* Watch scss, run the sass task on change. */
    gulp.watch(['assets/scss/*.scss', 'assets/scss/**/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['assets/js/app.js'], ['scripts'])
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['dist/**/*.html'], ['bs-reload']);
});
