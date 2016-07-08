var conf = require('./config.json');

const InputAdapter = require('../adapters/in/'+conf.in.name+'.js');
const Store = require('../adapters/store/'+conf.store.name+'.js');

var input = new InputAdapter(conf.in.options);
var store = new Store(conf.store.session, conf.store.options);
var inProg = 0;
var recordCount = 0;
var exiting = false;

input.on('data', (id, data) => {
	recordCount += 1;
	inProg += 1;
	store.store(id, data, (err) => {
		if (err) console.error(err);
		inProg -= 1;
		if (inProg === 0 && exiting) process.exit(0);
	});
});

input.start();

function cleanup() {
	input.removeAllListeners('data');
	exiting = true;
}

if (conf.termination.type === 'time') {
	setTimeout(cleanup, conf.termination.num);
} else if (conf.termination.type === 'records') {
	input.on('data', (id, data) => {
		if (recordCount === conf.termination.num) {
			process.exit(0);
		}
	});
}

process.on('SIGTERM', cleanup);
