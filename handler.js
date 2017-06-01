const config = require('./config.js');

const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');
const AWS = require('aws-sdk');
const Slack = require('slack-node');

const logger = config.logger;
const S3 = new AWS.S3();

var webhookUri   = process.env.WEB_HOOK_URI;

slack = new Slack();
slack.setWebhook(webhookUri);

exports.hello =
  (event, context, callback) => {
    callback(null, { Message: 'Hello World!'});
  }

exports.html2pdf = function handler(event, context, callback) {
    if (!event.data) {
        logger.log().error('unable to get the data');
        callback('unable to get the data', {});
        return;
    }

    const filename = `${(event.filename || Math.random().toString(36).slice(2))}.pdf`;
    const pageSize = event.pagesize || 'a4';
    const data = event.data;

    logger.log({ data, pageSize, filename }).info('Variables');

    const output = `/tmp/${filename}`;
    const writeStream = fs.createWriteStream(output);
    // wkhtmltopdf('http://apple.com/', { output: '/tmp/out.pdf' });
    wkhtmltopdf(data, { pageSize }, () => {
        S3.putObject({
            Bucket: config.bucket,
            Key: filename,
            Body: fs.createReadStream(output),
            ACL: 'public-read',
            ContentType: 'application/pdf',
        }, (error) => {
            if (error != null) {
                logger.log({ error }).error('Unable to send file to S3');
                callback('Unable to send file to S3', {});
            } else {
                logger.log({ filename }).info('Upload done!');
                callback(null, { filename });
                slack.webhook({
                  channel: "#hackathon-2016",
                  username: "Lambda yo",
                  text: "https://s3-us-west-2.amazonaws.com" + "/" + config.bucket + "/" + filename
                }, function(err, response) {
                  console.log(response);
                });
            }
        });
    }).pipe(writeStream);
};