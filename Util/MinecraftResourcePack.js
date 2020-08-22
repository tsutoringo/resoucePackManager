const fs = require('fs');
const path = require('path');
const Base = require('./Base');
const JSONStringify = require('./JSONStringify');
const {EventEmitter} = require('events')

const versions = [
	"Unknown",
	{
		from: "1.6.1",
		to: "1.8.9"
	},{
		from: "1.9",
		to: "1.10.2"
	},{
		from: "1.11",
		to: "1.12.2"
	},{
		from: "1.13",
		to: "1.14.4"
	},{
		from: "1.15",
		to: "1.16.1"
	},{
		from: "1.16.2",
		to: false
	}
];

class MinecraftResourcePack extends EventEmitter {
	#models = void 0;
	#langs = void 0;
	#sounds = void 0;
	constructor(Path) {
		super();
		this.path = Path;
		this.name = path.parse(this.path).name;
		this.loaded = false;

		const pathToMCmeta = path.join(this.path, 'pack.mcmeta');
		if(this._isExist(pathToMCmeta)) {
			const mcmeta = JSON.parse(fs.readFileSync(pathToMCmeta, 'utf8'));
			if(mcmeta.pack && mcmeta.pack.pack_format && mcmeta.pack.description !== void 0) {
				this.version = new MinecraftResoucepackFormatVersion(mcmeta.pack.pack_format);
				this.description = mcmeta.pack.description;
				this.loaded = true;
			}
		}
	}
	get models() {
		if(this.#models === void 0) {
			this.#models = [];
			this.#models = this.#fileExplorer(path.join(this.path,'assets/minecraft/models'), (_path) => new ResourcePackModel(_path,this))
		}
		return this.#models;
	}
	get langs() {
		if(this.#langs === void 0) {
			this.#langs = [];
			this.#langs = this.#fileExplorer(path.join(this.path,'assets/minecraft/lang'),(_path)=> new ResourcePackLang(_path,this))
		}
		return this.#langs;
	}
	get sounds() {
		if(this.#sounds === void 0) {
			this.#sounds = {}
			try {
				this.#sounds = JSON.parse(fs.readFileSync(path.join(this.path,'assets/minecraft/sounds.json'),{encoding: 'utf8'}));
			} catch (e) {
			}
		}
		return this.#sounds;
	}
	save() {
		

		for(const model of this.models) model.save();
		for(const lang of this.langs) lang.save();

		try {
			fs.writeFileSync(path.join(this.path,'assets/minecraft/sounds.json'), JSONStringify(this.sounds))
			this.emit('minify',{name:'sounds',path:path.join(this.path,'assets/minecraft/sounds.json')})
		} catch(err) {}

		fs.writeFileSync(path.join(this.path,'pack.mcmeta'), JSONStringify(JSON.parse(fs.readFileSync(path.join(this.path,'pack.mcmeta'),{encoding: 'utf8'}))))
		this.emit('minify',{name:'pack',path:path.join(this.path,'pack.mcmeta')})
	}
	removeAllCredits() {
		for(const model of this.models) model.removeCredit();
	}
	#fileExplorer(_path,c,a=[]) {
		try {
			const files = fs.readdirSync(_path,{
				withFileTypes: true
			});
			for(const file of files) {
				if(file.isDirectory()) {
					this.#fileExplorer(path.join(_path,file.name),c,a)
				} else if(file.isFile() && path.parse(path.join(_path,file.name)).ext == '.json') {
					a.push(c(path.join(_path,file.name)))
				}
			}
		} catch(err) {
			a = []
		}
		return a;
	}
	_isExist() {
		var isExist = false;
		try {
			fs.statSync(this.path);
			isExist = true;
		} catch(err) {
			isExist = false;
		}
		return isExist;
	}
}

class MinecraftResoucepackFormatVersion {
	constructor(format) {
		this.format = format;
	}
	get formatted() {
		if(versions[this.format] === void 0) return "Unknown"
		if(versions[this.format].to) {
			return `${versions[this.format].from}~${versions[this.format].to}`;
		} else {
			return versions[this.format].to;
		}
	}
}

class ResourcePackModel extends Base {
	constructor(_path, _client) {
		super(_path, _client);
	}
	get credit() {
		return this.data.credit;
	}
	get parent() {
		return this.data.parent;
	}
	get overrides() {
		return this.data.overrides;
	}
	removeCredit() {
		if(this.data.credit !== void 0) delete this.data.credit;
	}
	save() {
		this.$save()
	}
}
class ResourcePackLang extends Base {
	constructor(_path, client) {
		super(_path, client);
	}
	save() {
		const data = this.data;
		try {
			const vanilla = JSON.parse(fs.readFileSync(path.join(__dirname,`../assets/lang/${this.name}.json`),{encoding: 'utf8'}));
			for(const key in data) {
				if(!!vanilla[key] && data[key] == vanilla[key]) delete data[key];
			}
		} catch (e) {
			console.log(e);
		}
		this.data = data;
		this.$save();
	}
	getProperty(name) {
		return this.data[name];
	}
}
module.exports = MinecraftResourcePack;