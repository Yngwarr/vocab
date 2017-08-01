const VOCAB_FILE = './vocab.txt';

function init() {
	reqData(VOCAB_FILE);
}

function reqData(url) {
	let req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.send(null);
	req.onreadystatechange = () => {
		if (req.readyState !== 4
		|| req.status !== 200
		|| req.getResponseHeader('Content-Type')
		.indexOf("text") < 0) return;

		req.responseText !== ''
			&& procJson(req.responseText);
	}
}

function procJson(txt) {
	let data = [];
	let strs = txt.split('\n').filter((x) => {
		return x !== '';
	});
	strs.forEach((s) => {
		if (s[0] === '#') {
			data.push({
				'n': s.substr(3),
				'qs': []
			});
		} else {
			let [info, def] = s.split('--');
			let [w, p] = info.split('(');
			// get rid of last space
			w = w.substr(0, w.length-1);
			p = p.substr(0, p.length-2);
			data[data.length-1]['qs'].push({
				'w': w,
				'p': p,
				'def': def
			});
		}
	});
	console.log(data);
}
