var gulp = require('gulp'),
    del = require("del"),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    WebpackDevServer = require("webpack-dev-server"),
    webpackConfig = require("./webpack.config.js"),
    path = require('path'),
    fs = require('fs');

const config = {
    appDir: './app',
    imagesDir: './images',
    npmDir: './node_modules',
    publicDir: './dist'
};
const DEV_PORT = 3001;
const DEV_HOST = '0.0.0.0';

gulp.task('clean', (cb) => {
    return del([config.publicDir], cb);
});

gulp.task('static', () => {
    var static = gulp.src([
        `${config.appDir}/index.html`,
        `${config.appDir}/app.css`,
        `${config.npmDir}/bootstrap/dist/css/bootstrap.css`
    ]).pipe(gulp.dest(config.publicDir));
});

gulp.task('images', () => {
    var static = gulp.src([
        `${config.imagesDir}/*.*`,
    ]).pipe(gulp.dest(`${config.publicDir}/images`));
});

gulp.task('webpack-dev', (cb) => {
    var config = webpackConfig(true);
    new WebpackDevServer(webpack(config), config.devServer).listen(DEV_PORT, DEV_HOST, function(err) {
        if (err) {
            throw new gutil.PluginError("webpack-dev-server", err);
        }
        gutil.log("[webpack-dev-server]", `http://${DEV_HOST}:${DEV_PORT}/`);
        cb();
    });
});

gulp.task('webpack-prod', (cb) => {
    webpack(webpackConfig(false), (err) => {
        if (err) {
            throw err;
        }
        cb();
    });
});

gulp.task('build', ['static', 'images', 'webpack-prod']);
gulp.task('default', ['static', 'images', 'webpack-dev']);