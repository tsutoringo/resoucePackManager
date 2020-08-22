const blessed = require('blessed');
const contrib = require('blessed-contrib');
const archiver = require('archiver');

const fs = require('fs');
const path = require('path');

const SelectFolder = require('./widgets/selectFolder');
const ViewLog = require('./widgets/viewLog');
const ViewModels = require('./widgets/viewModel');
const Control = require('./widgets/control');

// スクリーンを生成
const screen = blessed.screen({
	smartCSR: true,
	fullUnicode: true,
	title: 'ResoucePackmanager' // TUIのタイトル
})
const grid = new contrib.grid({
	rows: 100,
	cols: 100,
	screen
})

const selectFolder = new SelectFolder(screen, grid);
const viewModels = new ViewModels(screen, grid);
const viewLog = new ViewLog(screen, grid);
const control = new Control(screen, grid);

selectFolder.element.on('select item',function() {
	const data = selectFolder.packs[this.selected].models
	.map(model => ([
		model.name,
		model.parent === void 0?'no': model.parent
	]));
	viewModels.element.setData(
		[
			['name','parent'],
			...data,
		]
	)
});
selectFolder.element.key(['enter','space'], function() {
	control.element.focus();
});

control.element.key('escape', function() {
	selectFolder.element.focus();
});
viewModels.element.key('escape',function() {
	control.element.focus()
})
control.element.key('enter',function() {
	 switch (this.selected) {
		case 0:
			viewLog.element.log(`Start minify ${selectFolder.packs[selectFolder.element.selected].name}`);
			selectFolder.packs[selectFolder.element.selected].on("minify",(type) => {
				viewLog.element.log(`Minify ${type.name} at ${type.path}`);
			});
			selectFolder.packs[selectFolder.element.selected].save()
			viewLog.element.log(`End minify ${selectFolder.packs[selectFolder.element.selected].name}`);
			break;
		case 1:
			viewModels.element.focus()
			break;
		case 2:
			const stream = fs.createWriteStream(path.join(selectFolder.packs[selectFolder.element.selected].path+'.zip'));
			const archive = archiver('zip',{zlib: { level: 9 }})

			archive
				.directory(selectFolder.packs[selectFolder.element.selected].path, false)
				.on('error', err => {throw err})
				.pipe(stream)
			;
			stream.on('close', () => viewLog.element.log('Zipped'));
			archive.finalize();
			break;
		case 3:
			selectFolder.packs[selectFolder.element.selected].removeAllCredits();
			viewLog.element.log('removed credit');
			viewLog.element.log('You can save run minify')

	}
})

screen.render();



// TUIを終了するショートカットは必ず書かないと閉じられない
screen.key(['C-[', 'C-c'], () => process.exit(0));

screen.render()

