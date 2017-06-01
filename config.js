process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

const hewer = require('hewer');

function Formatter() {
    this.format = (message, level, meta) => `${level} ${message} ${JSON.stringify(meta)}`;
}

module.exports = {
    bucket: 'serverless-hackweek',
    logger: new hewer.Logger(null, null, new Formatter()),
};