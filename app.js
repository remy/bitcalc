/* global toBinary, toHex */
const $$ = s => Array.from(document.querySelectorAll(s));
const $ = s => document.querySelector(s);

const tape = $('#tape');
const byteSizeEl = $('#byte-size');
const endianEl = $('#endian');
let bigEndian = true;
let byteSize = byteSizeEl.value;
let signed = false;
let input = $('input');
let result = $('.result');

let ready = false;
let ptr = 0;
let results = new DataView(new ArrayBuffer(1024));

endianEl.onchange = () => {
  const v = (localStorage.endian = endianEl.value);
  bigEndian = v === 'big';
  run();
};

byteSizeEl.onchange = () => {
  localStorage.byteSize = byteSizeEl.value;
  byteSize = parseInt(byteSizeEl.value, 10);
  signed = byteSizeEl.selectedOptions[0].dataset.signed === '1';
  run();
};

function printValue(value) {
  return (
    toBinary(value, byteSize)
      .split('')
      .reduce((acc, curr, i) => {
        if (i > 0 && i % 4 === 0) {
          acc.push(' ');
        }
        acc.push(curr);
        return acc;
      }, [])
      .join('') +
    `<span class="decimal">(${value} 0x${toHex(value, byteSize)})</span>`
  );
}

const run = (e = { target: { nodeName: 'INPUT' } }) => {
  if (!ready) {
    return;
  }

  if (e.target.nodeName !== 'INPUT') {
    return;
  }

  const intType = signed ? 'Int' : 'Uint';

  try {
    let res = eval(input.value);
    if (typeof res === 'string') {
      res = res.charCodeAt(0);
    }
    results[`set${intType}${byteSize}`](ptr, res, !bigEndian);
  } catch (e) {
    console.error(e);
  }

  const value = results[`get${intType}${byteSize}`](ptr);

  result.innerHTML = printValue(value);

  const history = $$('input').map(v => v.value);
  const query = new URLSearchParams();
  query.append('history', JSON.stringify(history));
  query.append('endian', endianEl.value);
  query.append('byte-size', byteSize);
  window.history.replaceState(null, '', '?' + query.toString());
};

function addLine() {
  const intType = signed ? 'Int' : 'Uint';
  const last = results[`get${intType}${byteSize}`](ptr);

  input.setAttribute('readonly', 'readonly');

  ptr++;
  const li = document.createElement('li');
  li.innerHTML += `<input autofocus value="${last}" class="input"> <span class="result"></span>`;
  tape.appendChild(li);
  input = $$('input')[ptr];
  result = $$('.result')[ptr];
  input.focus();

  input.selectionStart = input.selectionEnd = input.value.length;

  results[`set${intType}${byteSize}`](ptr, last);
  run();
}

function init() {
  ptr = 0;
  results = new DataView(new ArrayBuffer(1024));

  $(
    '#tape'
  ).innerHTML = `<li><input autofocus value="" class="input"> <span class="result"></span></li>`;

  result = $('.result');

  const query = new URLSearchParams(window.location.search.slice(1));
  const history = JSON.parse(query.get('history'));
  byteSizeEl.value = query.get('byte-size');
  endianEl.value = query.get('endian');

  history.forEach((value, i) => {
    input = $$('input').pop();
    input.value = value;
    run();
    if (i < history.length - 1) addLine();
  });

  if (history.length) {
    run();
  }
}

const body = document.body;
body.oninput = run;
body.onkeydown = e => {
  if (e.which === 13 && e.target.nodeName === 'INPUT') {
    addLine();
  }
};

if (localStorage.byteSize) {
  byteSizeEl.value = localStorage.byteSize;
  byteSizeEl.onchange();
}

if (localStorage.endian) {
  endianEl.value = localStorage.endian;
  endianEl.onchange();
}

$('#reset').onclick = () => {
  window.location = '/';
};

window.onpopstate = init;

ready = true;
if (window.location.search) {
  init();
} else {
  run();
}

input.selectionStart = input.selectionEnd = input.value.length;
