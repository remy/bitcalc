const $$ = s => Array.from(document.querySelectorAll(s));
const $ = s => document.querySelector(s);

const tape = $('#tape');
const byteSizeEl = $('#byte-size');
let byteSize = byteSizeEl.value;
let input = $('input');
let result = $('.result');

let ptr = 0;
let results = new DataView(new ArrayBuffer(1024));

byteSizeEl.onchange = () => {
  console.log(byteSizeEl.value);
  byteSize = parseInt(byteSizeEl.value, 10);
  run();
};

const run = (e = { target: { nodeName: 'INPUT' } }) => {
  if (e.target.nodeName !== 'INPUT') {
    return;
  }

  try {
    results[`setUint${byteSize}`](ptr, eval(input.value));
  } catch (e) {
    console.error(e);
  }

  const value = results[`getUint${byteSize}`](ptr);
  console.log(value.toString(2));

  result.innerHTML =
    value
      .toString(2)
      .padStart(byteSize, '0')
      .split('')
      .reduce((acc, curr, i) => {
        if (i > 0 && i % 4 === 0) {
          acc.push(' ');
        }
        acc.push(curr);
        return acc;
      }, [])
      .join('') + `<span class="decimal">(${value})</span>`;
};

const body = document.body;
body.oninput = run;
body.onkeydown = e => {
  if (e.which === 13 && e.target.nodeName === 'INPUT') {
    const last = results[`getUint${byteSize}`](ptr);

    input.setAttribute('readonly', 'readonly');

    ptr++;
    const li = document.createElement('li');
    li.innerHTML += `<input autofocus value="${last}" class="input"><span class="result"></span>`;
    tape.appendChild(li);
    input = $$('input')[ptr];
    result = $$('.result')[ptr];
    input.focus();

    results[`setUint${byteSize}`](ptr, last);
    run();
  }
};

run();
