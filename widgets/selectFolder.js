const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const ResoucePath = path.join(require('minecraft-folder-path'),"resourcepacks");
const MinecraftResourcePack =require('../Util/MinecraftResourcePack');
const Base = require('./Base');

module.exports = class SelectFolder extends Base {
	packs = [];
	constructor(screen, grid ) {
		super(screen, grid, grid.set(0, 0, 50, 30, blessed.list, {
			keys: true, // キー入力
			parent: screen, // 必ず指定
			label: 'SelectFolder', // 表示する名称
			selectedFg: 'black', // リストのアイテムを選択したときの文字色
			selectedBg: 'white', // リストのアイテムを選択したときの背景色
			align: 'left',
			border: { type: 'line' },
			style: {
				fg: 'white', // 通常時の文字色
				bg: 234, // 通常時の背景色
				border: {
					fg: 'cyan',
					bg: 234
				},
				label: {
					bg: 234
				}
			},
			noCellBorders: true,
			tags: true, // 色付けする場合
			wrap: false
		}));
		this.path = ResoucePath
		this.init();
	}
	async init() {
		this.element.focus();
		this.render();
	}
	async render() {
		this.packs = this.getResourcePacks();
		this.packs.forEach(pack => {
			this.element.addItem(`[${pack.loaded ? "o":"x"}]${pack.loaded?`[${pack.version.formatted}]`:''}${pack.name}`);
		});
		this.element.render();
	}
	getResourcePacks() {
		let packs = [];
		const files = fs.readdirSync(this.path,{
			withFileTypes: true
		});
		for(const file of files) {
			if(file.isDirectory()) {
				packs.push(new MinecraftResourcePack(path.join(this.path,file.name)));
			}
		}
		console.log(packs)
		return packs;
	}
}
