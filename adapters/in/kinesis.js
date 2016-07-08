var kcl = require('aws-kcl');
const EventEmitter = require('events');

module.exports = class InputAdapter extends EventEmitter {
	constructor(options) {
		this.recordProcessor = {
			initialize: (initializeInput, completeCallback) => {
				this.shardId = initializeInput.shardId;
				completeCallback();
			},
			processRecords: (processRecordsInput, completeCallback) => {
				if (!processRecordsInput || !processRecordsInput.records) {
					completeCallback();
					return;
				}
				var records = processRecordsInput.records;
				var record, data, sequenceNumber;
				for each (record in records) {
					data = new Buffer(record.data, 'base64').toString();
					sequenceNumber = new Buffer(record.sequenceNumber).toString('base64');
					this.emit('data', sequenceNumber, data);
				}
				completeCallback();
				return;
			}
		};
	}

	start() {
		kcl(this.recordProcessor).run();
	}
};
