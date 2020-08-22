const Base = require('./Base');
const blessed = require('blessed');
const contrib = require('blessed-contrib')

class ViewLog extends Base {
	constructor(screen, grid) {
		super(screen, grid, grid.set(0, 70, 100, 30, contrib.log, {
			keys: true, // キー入力
			parent: screen, // 必ず指定
			label: 'Logs', // 表示する名称
			selectedFg: 'black', // リストのアイテムを選択したときの文字色
			selectedBg: 'white', // リストのアイテムを選択したときの背景色
			align: 'left',
			height: '100%',
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
	}
}

module.exports = ViewLog;