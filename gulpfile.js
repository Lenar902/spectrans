const gulp = require('gulp');
require('./gulp/dev.js');
require('./gulp/docs.js');


gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'images', 'js', 'libs', 'fonts'),
    gulp.parallel('server', 'watch')
));

gulp.task('docs', gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'js:docs', 'libs:docs', 'fonts:docs'),
    'server:docs'
));
