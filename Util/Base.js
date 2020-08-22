const path = require('path');
const fs = require('fs');
const JSONStringify = require('./JSONStringify');

class Base {
	#data = void 0;
	constructor(_path, _client) {
		this. _client = _client;
		this.path = _path;
		this.name = path.parse(_path).name;
	}
	get data() {
		if(this.#data === void 0) {
			this.#data = JSON.parse(fs.readFileSync(this.path,{encoding: 'utf8'}));
		}
		return this.#data;
	}
	set data(data) {
		this.#data = data;
	}
	$save() {
		this._client.emit("minify",this);
		fs.writeFileSync(this.path, JSONStringify(this.data,false));
	}
}

module.exports = Base;