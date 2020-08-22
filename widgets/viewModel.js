const Base = require('./Base');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

class ViewModels extends Base {
	constructor(screen, grid) {
		super(screen, grid, grid.set(50, 0, 50, 30, blessed.ListTable, {
			rows: [
				['name','parent']
			],
			keys: true, // キー入力
			parent: screen,
			label: 'Models', 
			selectedFg: 'black',
			selectedBg: 'white',
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
	}
}

module.exports = ViewModels;