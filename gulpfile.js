const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
};

function css() {
    return src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));
}


function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(terser())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('build/js'));
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 }), { name: 'optimized-images' }))
        .pipe(dest('build/img'));
}

function versionWebp() {
    return src('src/img/**/*.{jpg,jpeg,png}')
        .pipe(cache(webp(), { name: 'webp-images' }))
        .pipe(dest('build/img'));
}


function watchArchivos() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch(paths.imagenes, parallel(imagenes, versionWebp));
}
  
const build = parallel(css, javascript, imagenes, versionWebp);

exports.build = build;
exports.css = css;
exports.javascript = javascript;
exports.imagenes = parallel(imagenes, versionWebp);
exports.default = series(build, watchArchivos);
