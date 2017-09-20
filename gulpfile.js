var gulp = require("gulp");
var gutil = require("gulp-util");
var typescript = require("gulp-typescript");

var env = gutil.env.env || process.env.env || "dev";

var paths = {
    buildPath: "obj/build/" + env + "/",
    commonConfig: "config/*.json",
    envConfig: "config/" + env + "/*.json",
    htmlFiles: "src/*.html",
    publishPath: "dist/"
}

function copyToDest(src) {
    return src.pipe(gulp.dest(paths.buildPath));
}

gulp.task("html", function() {
    return copyToDest(gulp.src(paths.htmlFiles));
});

gulp.task("json-config", function() {
    return copyToDest(gulp.src([paths.commonConfig, paths.envConfig]));
});

gulp.task("json-config-common", function() {
    return copyToDest(gulp.src(paths.commonConfig));
});

gulp.task("json-config-env", function() {
    return copyToDest(gulp.src(paths.envConfig));
});

gulp.task("tscript", function() {
    var project = typescript.createProject("tsconfig.json");
    return gulp.src(project.config.include) 
        .pipe(project())
        .pipe(gulp.dest(paths.buildPath));
});

gulp.task("publish", ["build"], function() {
    return gulp.src(paths.buildPath + "**/*")
        .pipe(gulp.dest(paths.publishPath));
});

gulp.task("build", [ "html", "json-config", "tscript" ]);
gulp.task("default", ["build", "publish"]);
