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
    APP_ENTRY  = './test/js/app.jsx',
    OUTPATH    = 'build/',
    DEBUG      = true;



var watchSrc=[
        'test/platform/atom/index.html','test/platform/atom/main.js','test/platform/atom/package.json',
        'test/platfom/node/index.html','test/platform/node/server.js','test/platform/node/package.json',
        'inst-driver/**/*.*','test/js/**/*.*','test/css/*.css',
        'index.js'
    ],
    testSrc = [
        'test/react/*.*',
        'test/js/jquery/*.*',
        'test/js/flot/*.*',
        'test/img/*.*',
        'test/semantic/**/*.*',
        'test/js/jquery.knob.min.js',
    ],
    platformAtomSrc = [
        'test/platform/atom/index.html',
        'test/platform/atom/main.js',
        'test/platform/atom/package.json',
	    'test/platform/atom/node_modules/**/*.*'
    ],
    platformNodeSrc = [
        'test/platform/node/index.html',
        'test/platform/node/server.js',
        'test/platform/node/package.json',
        'test/platform/node/node_modules/**/*.*',
    ],
    appSrc = [
        'inst-driver/**/*.*',
        'index.js'

    ];
var ATOMOUTPATH    = 'build/atom/',
    NODEOUTPATH    = 'build/node/',
    ATOMBASE    ='test/platform/atom',
    NODEBASE    ='test/platform/node';

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
    gulp.src('test/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME + '/css'));

    /* Copy rest app resources */
    gulp.src(platformAtomSrc,{ base: ATOMBASE })
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME));

    gulp.src(appSrc,{ base: './' })
        .pipe(gulp.dest(ATOMOUTPATH + APP_NAME));

    gulp.src(testSrc,{ base: 'test/' })
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
    gulp.src('test/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME + '/css'));


    /* Copy rest app resources */
    gulp.src(platformNodeSrc,{ base: NODEBASE })
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME));

    gulp.src(appSrc,{ base: './' })
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME));

    gulp.src(testSrc,{ base: 'test/' })
        .pipe(gulp.dest(NODEOUTPATH + APP_NAME));
});


gulp.task('watch',function(){
    gulp.watch(watchSrc,['build-node']);
});


gulp.task('default', ['build-atom','watch']);

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
