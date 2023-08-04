const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassglob = require('gulp-sass-glob');

const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

gulp.task('clean', function(done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', {read: false}).pipe(clean({force: true}));
    }
    done();
});


gulp.task('html', function() {
    return gulp.src(['./src/html/**/*.html','!./src/html/blocks/**/*'])
        // .pipe(changed('./build/'))
        .pipe(plumber(plumberNotify('Html')))
        .pipe(fileInclude( {
            prefix: '@@',
            basepath: '@file'        
        }))
        .pipe(gulp.dest('./build/'))
});


gulp.task('sass', function() {
    return gulp.src(['./src/sass/*.scss', './src/sass/libs/bootstrap.scss'])
      .pipe(changed('./build/css/'))
      .pipe(plumber(plumberNotify('Styles')))
      .pipe(sourcemaps.init())
      .pipe(sassglob())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./build/css'));
});

gulp.task('images', function() {
    return gulp.src('./src/img/**/*')
      .pipe(changed('./build/img/'))
      .pipe(imagemin({ verbose: true}))   
      .pipe(gulp.dest('./build/img'));
});

gulp.task('js', function() {
    return gulp.src('./src/js/**/*')   
      .pipe(changed('./build/js/'))
      .pipe(gulp.dest('./build/js'));
});

gulp.task('libs', function() {
    return gulp.src('./src/libs/**/*')  
        .pipe(changed('./build/libs/')) 
        .pipe(gulp.dest('./build/libs'));
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')  
        .pipe(changed('./build/fonts/'))  
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('server', function() {
    return gulp.src('./build/').pipe(server({
        livereload: true,
        open: true
    }))
});


gulp.task('watch', function() {
    gulp.watch(['./src/sass/**/*.scss', '!./src/sass/libs/**/*.scss'], gulp.parallel('sass'));
    gulp.watch('./src/html/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
});