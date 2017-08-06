var fs = require('fs');

var casper = require('casper').create();

var videoId = casper.cli.raw.get('videoId');
var pageName = casper.cli.get('pageName');
var views = '';
var url = "https://www.facebook.com/" + pageName + "/videos/" + videoId + "/";

casper.start(url, function() {
    //	this.viewport(1200, 400);
    casper.waitForSelector(views, function() {
        views = this.evaluate(function() {
            var views = document.querySelector('.commentable_item .fcg');
            return views.innerText;
        });
    });
});

casper.run(function() {
    // return number of views to the console
    this.echo(views);
    this.exit();
});
