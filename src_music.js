const { readdir, stat } = require('fs');
const { promisify } = require('util');
const path = require('path');


exports.sourceMusicFrom = (path) => {
	return new Promise((resolve, reject) => {
		getFiles(path)
			.then(flatten)
			.then(filterHidden)
			.then(strip)
			.then(files => JSON.stringify(files, null, 4))
			.then(resolve)
			.catch(reject)
	});
}

async function getFiles(directory) {
	const readdirPromise = promisify(readdir);
	const statPromise = promisify(stat);

	const files = await readdirPromise(directory);

	return Promise.all(files
		.map(f => path.join(directory, f))
			.map(async f => {
				const stats = await statPromise(f);
				return stats.isDirectory() ? getFiles(f) : f;
	}));
}

const flatten = array => {
  return array.reduce((flat, toFlatten) => 
  				flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}

const filterHidden = list => {
	return list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
}

const strip = list => {
	let stripped = [];

	list.forEach(item => {
		let data = item.split('/');
		let artist = data[data.length-3];
		let album = data[data.length-2];
		let song = data[data.length-1];

		stripped.push(objectify(`${artist}/${album}/${song}`));
	})

	return stripped;
}

const objectify = data => {
	let object = data.split('/');

	let artist = object[0];
	let album = object[1];
	let filename = object[2];
	let title = filename.substr(0, filename.lastIndexOf('.'));


	if (!isNaN(title.split(' ')[0])) {
		title = title.substr(title.indexOf(" ") + 1);
	}


	let song = {
		artist: artist,
		album: album,
		filename: filename,
		title: title
	}


	return song;
}

