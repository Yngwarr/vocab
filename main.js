const VOCAB_FILE = './vocab.txt';

// all the possible questions for all the cats
let DATA = [];
// questions to answer (idx)
let QS = [];
// list of failed questions (idx)
let FAILED = [];

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
	let strs = txt.split('\n').filter((x) => {
		return x !== '';
	});
	strs.forEach((s) => {
		if (s[0] === '#') {
			DATA.push({
				'n': s.substr(3),
				'qs': []
			});
		} else {
			let [info, def] = s.split('--');
			let [w, p] = info.split('(');
			// get rid of last space
			w = w.substr(0, w.length-1);
			p = p.substr(0, p.length-2);
			DATA[DATA.length-1]['qs'].push({
				'w': w,
				'p': p,
				'def': def
			});
		}
	});
	console.log(DATA);
	renderList();
}

function renderList() {
	let ul = document.getElementById('cat-list');

	DATA.forEach((cat, idx) => {
		let li = document.createElement('button');
		li.classList.add('btn');
		li.classList.add('btn-default');
		li.innerHTML = `${cat.n} `
			+ `<span class='badge'>${cat.qs.length}</span>`;
		li.dataset['idx'] = idx;
		li.addEventListener('click', startQuiz);
		ul.appendChild(li);
	});

	document.getElementById('cat-layout')
		.classList.remove('hidden');
}

function startQuiz(evt) {
	let cat_idx = parseInt(evt.target.dataset['idx']);
	QS = genSeq(DATA[cat_idx]['qs'].length);
	FAILED = [];

	// write the name of the category
	document.getElementById('cat-name').innerHTML
		= `${DATA[cat_idx]['n']} <small id='counter'><span id='cnt-curr'>1` +
		`</span>/<span id='cnt-sum'>${DATA[cat_idx].qs.length}</span></small>`;
	/*document.getElementById('cnt-curr').innerHTML = '1';
	document.getElementById('cnt-sum').innerHTML =
		`${DATA[cat_idx].qs.length}`;*/

	nextQuest(cat_idx);
	//document.getElementById('answer').addEventListener(
	//'change', () => {
	document.querySelector('form').addEventListener(
	'submit', (e) => {
		e.preventDefault();
		checkAnswer(cat_idx);
		return false;
	});

	document.getElementById('cat-layout')
		.classList.add('hidden');
	document.getElementById('quest-layout')
		.classList.remove('hidden');
}

function checkAnswer(cat_idx) {
	let input = document.getElementById('answer');
	let ans = input.value;
	let correct = DATA[cat_idx].qs[QS[QS.length - 1]].w;
	let span = document.getElementById('correct');
	span.innerHTML = ans.indexOf(correct) < 0
		? `<span class='glyphicon glyphicon-remove-circle'></span> ${correct}`
		: `<span class='glyphicon glyphicon-ok-circle'></span> ${correct}`;
	input.value = '';
	if (QS !== []) {
		QS.pop();
		nextQuest(cat_idx);
	}
}

function nextQuest(cat_idx) {
	let q_idx = QS[QS.length-1];
	let p = document.getElementById('part');
	let def = document.getElementById('definition');

	document.getElementById('cnt-curr').innerHTML =
		`${DATA[cat_idx].qs.length - QS.length + 1}`;
	
	p.innerHTML = DATA[cat_idx].qs[q_idx].p;
	def.innerHTML = DATA[cat_idx].qs[q_idx].def;
}

function genSeq(len) {
	let arr = [...Array(len).keys()];
	for (let i = len - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
