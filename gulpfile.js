var gulp       = require('gulp'),
    fs         = require('fs'),
    path       = require('path'),
    browserify = require('browserify'),
    reactify   = require('reactify'),
    uglify     = require('gulp-uglify'),
    minifycss  = require('gulp-minify-css'),
    concat     = require('gulp-concat'),
    transform  = require('vinyl-transform'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    del        = require('del'),
    sys        = require('sys'),
    exec       = require('child_process').exec;

var LIB_PATH   = './',
    APP_NAME   = path.basename(__dirname),
    APP_ENTRY  = './js/app.jsx',
    OUTPATH    = 'build/',
    DEBUG      = true;



var watchSrc=[
        'platform/atom/index.html','platform/atom/main.js','platform/atom/package.json',
        'platfom/node/index.html','platform/node/server.js','platform/node/package.json',
        'msoDriver/*.*','js/**/*.*',
        'img/*.*'
        ],
    platformAtomSrc=[
        'platform/atom/index.html',
        'platform/atom/main.js',
        'platform/atom/package.json',
	'platform/atom/node_modules/**/*.*'
        ],
    platformNodeSrc=[
        'platform/node/index.html',
        'platform/node/server.js',
        'platform/node/package.json',
        'platform/node/node_modules/**/*.*',
        ],
    appSrc=[
        'msoDriver/**/*.*',
        'react/*.*',
        'js/jquery/*.*',
        'js/flot/*.*',
        'img/*.*',
        'semantic/**/*.*',
        'js/jquery.knob.min.js'
        ];
var ATOMOUTPATH    = 'build/atom/',
    NODEOUTPATH    = 'build/node/',
    ATOMBASE    ='platform/atom',
    NODEBASE    ='platform/node';

gulp.task('build-atom',function() {
    var b = browserify({
            entries: [ APP_ENTRY ],
            paths: [ LIB_PATH ],
            debug: DEBUG
        })
        .transform(reactify)
        .bundle()
        .pipe(source('app.min.js'));

    if (!DEBUG)
        b = b.pipe(buffer()).pipe(uglify());

    b.pipe(gulp.dest(ATOMOUTPATH + APP_NAME + '/js/'));

    /* Build app css bundle */
    gulp.src('css**/*.css')
        .pipe(concat('app.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME + '/css'));

    /* Copy rest app resources */
    gulp.src(platformAtomSrc,{ base: ATOMBASE })
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME));

    gulp.src(appSrc,{ base: './' })
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME));
});

gulp.task('build-node',function() {
    var b = browserify({
            entries: [ APP_ENTRY ],
            paths: [ LIB_PATH ],
            debug: DEBUG
        })
        .transform(reactify)
        .bundle()
        .pipe(source('app.min.js'));

    if (!DEBUG)
        b = b.pipe(buffer()).pipe(uglify());

    b.pipe(gulp.dest(NODEOUTPATH + APP_NAME + '/js/'));

    /* Build app css bundle */
    gulp.src('css**/*.css')
        .pipe(concat('app.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME + '/css'));

    /* Copy rest app resources */
    gulp.src(platformNodeSrc,{ base: NODEBASE })
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME));

    gulp.src(appSrc,{ base: './' })
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME));
});


gulp.task('watch',function(){
    gulp.watch(watchSrc,['build-node','build-atom']);
});


gulp.task('default', ['build-node','build-atom','watch']);

// gulp.task('archive', function() {
//     process.chdir(OUTPATH);
//     exec('zip -r ' + APP_NAME + '.zip ' + APP_NAME + '/',
//         function(error, stdout, stderr) {
//             if (error)
//                 sys.print(stderr);
//             else
//                 sys.print(stdout);
//         }
//     );
// });

// gulp.task('clean', function(cb) {
//     del(OUTPATH, cb);
// });
