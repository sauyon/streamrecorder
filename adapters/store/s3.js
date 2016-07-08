var aws = require('aws-sdk');

module.exports = class OutputAdapter extends EventEmitter {
	constructor(options) {
		this.s3 = new aws.S3(options.s3Config);
		this.bucket = options.bucket;
		this.prefix = options.session+'/';
	}

	store(id, data, cb) {
		var params = { Bucket: this.bucket, Key: this.prefix+id, Body: data };
		this.s3.putObject(params, (err, data) => {
			cb(err);
		});
	}

	playback() {
		var params = { Bucket: this.bucket, Prefix: this.prefix };
		function cb(err, data) {
			if (err) console.error(err);
			for (var objs in data.Contents) {
				var objParams = { Key: objs.Key };
				this.s3.getObject(objParams, (err, data) => {
					this.emit('data', data);
				});
			}
			if (data.IsTruncated) {
				params.ContinuationToken = data.NextContinuationToken;
				this.s3.listObjectsV2(params, cb);
			}
		}
		this.s3.listObjectsV2(params, cb);
	}
};
