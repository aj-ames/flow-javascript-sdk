var gulp = require('gulp');
var typescript = require('gulp-tsc');
var mocha = require('gulp-mocha');
var webpack = require('webpack-stream');
var rename = require("gulp-rename");
var uglify = require('gulp-uglifyjs');
var shell = require('gulp-shell');
var clean = require('gulp-clean');

var tsc = () => {
    return typescript({
        "module": "commonjs",
        "sourceMap": true,
        "target": "es5",
        "experimentalDecorators": true,
        "preserveConstEnums": true,
        "declaration": true
    });
};

// Tests
gulp.task('pre-test', () => {
    process.env.BASE_URL = 'http://test/';
    return gulp.src(['./typings/*.d.ts', './src/**/*.ts', './test/**/*.ts'])
        .pipe(tsc())
        .pipe(gulp.dest('.'));
});

gulp.task('mocha', ['pre-test'], () => {
    return gulp.src(['test/**/*.js'])
        .pipe(mocha());
});

gulp.task('test', ['pre-test', 'mocha']);
// -----------

// Build
gulp.task('clean-lib', () => {
    return gulp.src('./lib')
        .pipe(clean({force: true}));
});
gulp.task('compile-lib', ['clean-lib'], () => {
    return gulp.src(['./typings/tsd.d.ts', './src/**/*.ts'])
        .pipe(tsc())
        .pipe(rename(function (path) {
            path.dirname = path.dirname.split('/').slice(1).join('/');
        }))
        .pipe(gulp.dest('./lib'));
});

gulp.task('webpack', ['compile-lib'], () => {
    return gulp.src('lib/Scandit.js')
        .pipe(webpack({
            output: {
                filename: 'scandit.js',
                library: 'Scandit',
                libraryTarget: 'umd',
                umdNamedDefine: true
            },
            externals: [
                {
                    './node/SessionStorage': 'var undefined',
                    './node/LocalStorage': 'var undefined'
                }
            ],
            devtool: 'source-map'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['webpack'], () => {
    return gulp.src('dist/scandit.js')
        .pipe(uglify('scandit.min.js', {
            outSourceMap: true,
            mangle: false
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean-lib', 'compile-lib', 'webpack', 'uglify']);

gulp.task('watch', ['build'], () => {
    gulp.watch(['package.json', 'src/**/*.ts', 'typings/**/*.ts'], ['build'])
});
// --------------

// Documentation
gulp.task('pre-doc', () => {
    return gulp.src('./doc')
        .pipe(clean({force: true}));
});

gulp.task('doc', ['build', 'pre-doc'], shell.task([
    'node_modules/.bin/jsdoc -c doc_template/jsdoc_config.json -d doc lib ./doc_template/index.md'
]));
// --------------

gulp.task('default', ['build']);
