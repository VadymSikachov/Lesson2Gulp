import pkg from 'gulp';
const { src, dest, series, parallel, watch: _watch } = pkg;
import pug from 'gulp-pug';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import rename from "gulp-rename";
import webp from 'gulp-webp';
// const browserSync = require('browser-sync').create();
import browserSync from 'browser-sync';
const browser = browserSync.create()
import {deleteAsync}  from "del";
import ghPages from 'gulp-gh-pages';

const html = () => {
  return src('src/pug/*.pug')
    .pipe(pug( { pretty:true } ))
    .pipe(dest('build'))
}
const css = () => {
  return src('src/styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({ suffix: '-min' }))
    .pipe(dest('build/css'))
}
const images = () => {
  return src('src/styles/images/**/*.*')
    .pipe(webp())
    .pipe(dest('build/image'))
}
const server = () => {
  browser.init({
    server: {
      baseDir: './build'
    },
    notify: false
  });
  browser.watch('build', browser.reload)
}
const deleteBuild = (cb) => {
  // return del('build/**/*.*').then(() => { cb() })
  return deleteAsync('build/**/*.*');
}
const watch = () =>{
  _watch('src/pug/**/*.pug', html)
  _watch('src/styles/**/*.scss', css)
  _watch('src/styles/images/**/*.*', images)
}
const _default = series(
  deleteBuild,
  parallel(html, css, images),
  parallel(watch, server)
);
export { _default as default };
pkg.task('deploy', function() {
  return pkg.src('./build/**/*')
    .pipe(ghPages());
});