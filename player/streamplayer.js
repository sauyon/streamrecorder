var conf = require('./config.json');

const Store = require('../adapters/store/'+conf.store.name+'.js');
const OutputAdapter = require('../adapters/store/'+conf.out.name+'.js');

var store = new Store(conf.store.session, conf.store.options);
var output = new OutputAdapter(conf.out.options);

store.on('data', (data) => {
	output.write(data, (err) => {
		if (err) console.error(err);
	});
});

store.playback();
