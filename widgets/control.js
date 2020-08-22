const Base = require('./Base');
const blessed = require('blessed')

class Control extends Base {
	constructor(screen, grid) {
		super(screen, grid, grid.set(0, 30, 50, 40, blessed.list, {
			keys: true, // キー入力
			parent: screen, // 必ず指定
			label: 'Control', // 表示する名称
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
			wrap: false,
			items: [
				'Minify',
				'viewModels',
				'zipping',
				'removeCredit'
			]
		}));
	}
}

module.exports = Control;