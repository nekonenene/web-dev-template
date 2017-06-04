var gulp = require('gulp');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var del = require('del');

// JS plugins
var babel  = require('gulp-babel');
var uglify = require('gulp-uglify');

// CSS plugins
var sass    = require('gulp-sass');
var postCss = require('gulp-postcss');
var cssNext = require('postcss-cssnext');
var csso    = require('postcss-csso');

// HTML plugins
var pug  = require('gulp-pug');
var htmlMin = require('gulp-htmlmin');

// Images plugins
var imageMin = require('gulp-imagemin');

// Live Reload
var connect = require('gulp-connect');

var buildTasks = [
  'copy',
  'compile',
  'minify',
];

var defaultTasks = [
  'build',
  'sourceServer',
  'distServer',
  'watch',
];

/* gulp とコマンドを打つと実行される */
gulp.task('default', defaultTasks);

/* gulp build */
gulp.task('build', buildTasks);

/* watch 系まとめ : gulp watch */
gulp.task('watch', function() {
  // gulp.watch(['./source/**/*'], ['copy']);
  gulp.watch(['./source/**/*.pug'],  ['pug']);
  gulp.watch(['./source/**/*.es6'],  ['babel']);
  gulp.watch(['./source/**/*.scss'], ['sass']);
  // gulp.watch(['./source/**/*.{gif,jpg,png,svg}'], ['imageMinify']);
  gulp.watch(['./source/**/*.js']   , ['jsMinify']);
  gulp.watch(['./source/**/*.css']  , ['cssMinify']);
  gulp.watch(['./source/**/*.html'] , ['htmlMinify']);
});


/* Live Reload!! */
gulp.task('sourceServer', function() {
  connect.server({
    root       : './source/',
    name       : 'Server(Source)',
    port       : 8013,
    livereload : true,
  });
});

gulp.task('distServer', function() {
  connect.server({
    root       : './optimized/',
    name       : 'Server(Dist)',
    port       : 8014,
    livereload : true,
  });
});

/* COPY : HTML, CSS, JS などでないファイルを optimized にコピー */
gulp.task('copy', function() {
  var ignoreSuffixes = '{html,css,js,pug,es6,scss,gif,jpg,png,svg}';
  var ignoreFolders  = '{pug,es6,plugins,sass}';

  gulp.src(['./source/**/*', '!./source/**/*.'+ignoreSuffixes, '!./source/'+ignoreFolders])
    .pipe(gulp.dest('./optimized/'));

  // .DS_Store は削除
  del(['./**/.DS_Store']);
});

/* **********
 *  Compile 系 : .html, .css, .js ファイルへ変換
 **********   */
gulp.task('compile', ['babel', 'sass', 'pug']);

/* JS Babel : ES6への対応 */
gulp.task('babel', function(callback) {
  pump([
    gulp.src('./source/es6/**/*.es6'),
    sourcemaps.init(),
    replace(/\t/g, '  '), // babel でネストが深くなるのでタブ文字を2文字スペースに
    babel({
      presets: ['es2015']
    }),
    sourcemaps.write(),
    gulp.dest('./source/'),
  ], callback);
});

/* Sass + Scss , and PostCSS */
gulp.task('sass', function() {
  var postCssTasks = [
    cssNext({ browsers: ['last 2 version'] }),
  ];

  gulp.src(['./source/sass/**/*.{sass,scss}'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      indentType: 'tab',
      indentWidth: 1,
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(postCss(postCssTasks))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./source/'));
});

/* Pug : Jade の新しい名前。HTML へコンパイル */
gulp.task('pug', function() {
  gulp.src('./source/pug/**/*.pug')
    .pipe(pug({
      pretty : '  ', // indent style
    }).on('error', function(e) { console.log(e.message); }))
    .pipe(gulp.dest('./source/'));
});

/* HTML Copy : ただコピーしたい場合に使う */
gulp.task('copyHtml', function() {
  gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./optimized/'));
});

/* **********
 *  Minify 系 : ファイルの圧縮
 **********   */
gulp.task('minify', ['jsMinify', 'cssMinify', 'htmlMinify', 'imageMinify']);
gulp.task('codeMinify', ['jsMinify', 'cssMinify', 'htmlMinify']);

/* JavaScript Min */
gulp.task('jsMinify', function(callback) {
  pump([
    gulp.src('./source/**/*.js'),
    uglify(),
    gulp.dest('./optimized/'),
    connect.reload(),
  ], callback);
});

/* CSS Min */
gulp.task('cssMinify', function(callback) {
  var postCssTasks = [
    csso(),
  ];

  pump([
    gulp.src('./source/**/*.css'),
    postCss(postCssTasks),
    gulp.dest('./optimized/'),
    connect.reload(),
  ], callback);
});

/* HTML Min */
gulp.task('htmlMinify', function(callback) {
  var htmlMinOptions = {
    removeComments               : true,
    removeCommentsFromCDATA      : true,
    removeCDATASectionsFromCDATA : true,
    collapseWhitespace           : true,
    preserveLineBreaks           : true,
    collapseBooleanAttributes    : true,
    removeTagWhitespace          : true,
    removeAttributeQuotes        : true,
    removeRedundantAttributes    : true,
    preventAttributesEscaping    : true,
    useShortDoctype              : true,
    removeEmptyAttributes        : true,
  };

  pump([
    gulp.src('./source/**/*.html'),
    htmlMin(htmlMinOptions),
    gulp.dest('./optimized/'),
    connect.reload(),
  ], callback);
});

/* ImageMin : 画像圧縮 */
gulp.task('imageMinify', function(callback) {
  pump([
    gulp.src('./source/**/*.{gif,jpg,png,svg}'),
    imageMin({
      progressive : true,
      interlaced  : true,
    }),
    gulp.dest('./optimized/'),
  ], callback);
});
