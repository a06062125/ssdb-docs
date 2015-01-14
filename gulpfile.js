var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var markdown = require('gulp-markdown');
var markdowndocs = require('gulp-markdown-docs');


/**
 * 定义静态文件路径
 */
var staticPaths = {
    admin: getStaticPaths('admin'),
    front: getStaticPaths('front')
};

var blackLessNames = {
    'default': ['variables'],
    'public': ['bootstrap-flatly-variables']
};

/**
 * @desc 获取静态资源路径
 * @method getStaticPaths
 * @params {sysName: 系统名称} [admin, front]
 */
function getStaticPaths(language) {
    var staticDir = './docs/' + language ;
    var lessDir = staticDir + '/other/less';
    var cssDir = staticDir + '/css';
    var jsDir = staticDir + '/js';
    var tplDir = staticDir + '/html';

    var staticPaths = {
        staticDir: staticDir,
        lessDir: lessDir,
        cssDir: cssDir,
        jsDir: jsDir,
        tplDir: tplDir
    };

    return staticPaths;
};

/**
 * @desc 获取LESS任务的src路径
 * @method makeAppLessGlobs
 * @params {sysName: 系统名称} [admin, front]
 * @params {appId: 应用id} [default, public]
 */
var makeAppLessGlobs = function(sysName, appId) {
    if (blackLessNames[appId] && blackLessNames[appId].length > 0) {
        return staticPaths[sysName].lessDir + '/app/' + appId + '/**/!(' + blackLessNames[appId].join(' | ') + ').less ';
    }
    return staticPaths[sysName].lessDir + '/app/' + appId + '/**/*.less ';
};

/**
 * @desc 编译less文件任务
 * @method less2css
 * @params {sysName: 系统名称} [admin, front]
 * @params {appId: 应用id} [default, public]
 */
var less2css = function(sysName, appId) {
    gulp
        .src(makeAppLessGlobs(sysName, appId))
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer('last 10 versions', 'ie 8'))
        .pipe(gulp.dest(staticPaths[sysName].cssDir + '/app/' + appId + '/'))
};

/**
 * @desc markdown 编译成 html 文件任务
 * @method md2html
 * @desc src/目录下的都要编译
 * */
var md2html = function() {

};

/**
 * less2css
 * */
gulp.task('less2css', function() {
    less2css();
});

/**
 * md2html
 * */
gulp.task('md2html', function() {
    md2html();
});

/**
 * 监听
 */
gulp.task('watch', function() {
    gulp.watch(staticPaths.lessDir + '/**/*.less', ['less2css-admin']);
});


gulp.task('default', ['less2css-admin',  'watch']);

