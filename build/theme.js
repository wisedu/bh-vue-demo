var tb = require('theme-build');
var path = require('path');
var fs = require('fs');
var chokidar = require('chokidar');

var lessDir = path.join(__dirname, '../src/less/'),
    themeDir = path.join(__dirname, '../static/resources/themes/');

var build = function() {
    tb(lessDir, themeDir);
};

build();

var watcher = chokidar.watch(lessDir);

watcher.on('change', build);
