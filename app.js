/* global toBinary, toHex */
const $$ = s => Array.from(document.querySelectorAll(s));
const $ = s => document.querySelector(s);

const tape = $('#tape');
const byteSizeEl = $('#byte-size');
let byteSize = byteSizeEl.value;
let signed = false;
let input = $('input');
let result = $('.result');

let ptr = 0;
let results = new DataView(new ArrayBuffer(1024));

byteSizeEl.onchange = () => {
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
    .join('') + `<span class="decimal">(${value} 0x${toHex(value)})</span>`
  );
}

const run = (e = { target: { nodeName: 'INPUT' } }) => {
  if (e.target.nodeName !== 'INPUT') {
    return;
  }

  const intType = signed ? 'Int' : 'Uint';

  try {
    results[`set${intType}${byteSize}`](ptr, eval(input.value));
  } catch (e) {
    console.error(e);
  }

  const value = results[`get${intType}${byteSize}`](ptr);
  console.log('%s: %s', `get${intType}${byteSize}`, value, intType, byteSize);

  result.innerHTML = printValue(value);
};

const body = document.body;
body.oninput = run;
body.onkeydown = e => {
  if (e.which === 13 && e.target.nodeName === 'INPUT') {
    const intType = signed ? 'Int' : 'Uint';
    const last = results[`get${intType}${byteSize}`](ptr);

    input.setAttribute('readonly', 'readonly');

    ptr++;
    const li = document.createElement('li');
    li.innerHTML += `<input autofocus value="${last}" class="input"><span class="result"></span>`;
    tape.appendChild(li);
    input = $$('input')[ptr];
    result = $$('.result')[ptr];
    input.focus();

    input.selectionStart = input.selectionEnd = input.value.length;

    results[`set${intType}${byteSize}`](ptr, last);
    run();
  }
};

run();
input.selectionStart = input.selectionEnd = input.value.length;
