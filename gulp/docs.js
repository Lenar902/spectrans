const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const groupmedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sassglob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const htmlclean = require('gulp-htmlclean');

const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}

gulp.task('clean:docs', function(done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', {read: false}).pipe(clean({force: true}));
    }
    done();
});


gulp.task('html:docs', function() {
    return gulp.src(['./src/html/**/*.html','!./src/html/blocks/**/*'])  
        .pipe(changed('./docs/'))  
        .pipe(plumber(plumberNotify('Html')))
        .pipe(fileInclude( {
            prefix: '@@',
            basepath: '@file'        
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});


gulp.task('sass:docs', function() {
    return gulp.src(['./src/sass/*.scss', './src/sass/libs/bootstrap.scss'])
      .pipe(changed('./docs/css/'))
      .pipe(plumber(plumberNotify('Styles')))
      .pipe(sourcemaps.init())      
      .pipe(sassglob())
      .pipe(sass())
      .pipe(groupmedia())
      .pipe(sourcemaps.write())
      .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
        }))
      .pipe(csso())
      .pipe(gulp.dest('./docs/css'));
});

gulp.task('images:docs', function() {
    return gulp.src('./src/img/**/*')
      .pipe(changed('./docs/img/'))
      .pipe(imagemin({ verbose: true}))   
      .pipe(gulp.dest('./docs/img'));
});

gulp.task('js:docs', function() {
    return gulp.src('./src/js/**/*')   
      .pipe(changed('./docs/js/'))
      .pipe(gulp.dest('./docs/js'));
});

gulp.task('libs:docs', function() {
    return gulp.src('./src/libs/**/*')  
        .pipe(changed('./docs/libs/')) 
        .pipe(gulp.dest('./docs/libs'));
});

gulp.task('fonts:docs', function() {
    return gulp.src('./src/fonts/**/*') 
        .pipe(changed('./docs/fonts/'))  
        .pipe(gulp.dest('./docs/fonts'));
});

gulp.task('server:docs', function() {
    return gulp.src('./docs/').pipe(server({
        livereload: true,
        open: true
    }))
});