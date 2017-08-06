var childProcess = require('child_process');
var path = require('path');

exports.handler = function(event, context, callback) {

    // Set the path as described here: https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

    // Set the path to the phantomjs binary
    //	var phantomPath = path.join(__dirname, 'phantomjs_linux-x86_64');
    var casperPath = path.join(__dirname, 'node_modules/casperjs/bin/casperjs');

    var videoId = event.videoId;
    var pageName = event.pageName;

    // Arguments for the phantom script
    var processArgs = [
        path.join(__dirname, 'fetchviews.js'),
        '--videoId=' + videoId,
        '--pageName=' + pageName
    ];

    // Launch the child process
    childProcess.execFile(casperPath, processArgs, function(error, stdout, stderr) {
        if (error) {
            callback(error);
        }
        if (stderr) {
            callback(stderr);
        }
        var responseCode = 200;
        var responseBody = {
            // stdout appears to add \n to the end of the results.
            // Using parseInt to remove the \n character
            views: parseInt(stdout),
            videoId: videoId,
            pageName: pageName
        };
        var response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseBody)
        };
        callback(null, response);
    });
}
