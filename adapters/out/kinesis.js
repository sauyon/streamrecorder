var aws = require('aws-sdk');

var kinesis = new aws.Kinesis();

module.exports = class OutputAdapter {
	constructor(options) {
		this.kinesis = new aws.Kinesis(options.kinesisConfig);
		this.stream = options.stream;
	}

	write(data, cb) {
		var params = { StreamName: this.stream, Data: data };
		this.kinesis.putRecord(params, (err, data) => {
			cb(err);
		});
	}
};
