const targets = document.getElementById('targets');
const resultContainer = document.getElementById('result');

const onResolve = () => {
  const { value: ipV4 } = document.getElementById('IPv4');
  const { value: networkMask } = document.getElementById('network-mask');

  const items = Array.from(targets.querySelectorAll('li'));
  items.pop();
  const targetsArr = items.map((child) => {
    const { value: tName } = child.querySelector('#tName');
    const { value: tValue } = child.querySelector('#tValue');

    return {
      name: tName,
      value: parseInt(tValue),
    };
  });

  const minMaxRadios = Array.from(document.getElementsByName('min-max'));
  const { id: minMax } = minMaxRadios.find((radio) => radio.checked);

  const aZRadios = Array.from(document.getElementsByName('a-z'));
  const { id: aZ } = aZRadios.find((radio) => radio.checked);

  const sortOptions = {
    sizeSort: minMax,
    lexSort: aZ,
  };

  resolve(ipV4, networkMask, targetsArr, sortOptions);
};

const innerTarget = () => {
  const createTarget = () => {
    const id = targets.childElementCount + 1;

    const li = document.createElement('li');
    li.id = id;

    let targetName = '';
    let targetValue = '';
    if (id == '2') {
      targetName = `
      <div style="position: relative" id="test">
        <input type="text" id="tName" onpaste="nameInputPaste(event)" required>
        <label for="tName" class="absolute-label">Name</label>
      </div>`;
      targetValue = `
      <div style="position: relative">
        <input type="number" id="tValue" required>
        <label for="tValue" class="absolute-label">Value</label>
      </div>`;
    } else {
      targetName = `<input type="text" id="tName" onpaste="nameInputPaste(event)" required>`;
      targetValue = `<input type="number" id="tValue" required>`;
    }

    const targetRemove = `<input type="button" id="tRemove" value="X" onclick="removeTarget(this)" class="close-button"/>`;

    li.innerHTML += `${targetName}${targetValue}${targetRemove}`;
    return li;
  };

  const target = createTarget();
  targets.insertBefore(target, document.getElementById('tAdd').closest('li'));
};

const removeTarget = (src) => {
  const li = src.closest('li');
  targets.removeChild(li);
};

const showResult = (result) => {
  const tbody = resultContainer.querySelector('tbody');

  const innerRow = (rsRow) => {
    const row = tbody.insertRow();
    rsRow.forEach((value, index) => {
      const cell = row.insertCell(index);
      cell.innerHTML = `${value}`;
    });
  };

  result.forEach((rsRow) => {
    innerRow(rsRow);
  });

  resultContainer.style.display = 'flex';
};

const closeResult = () => {
  resultContainer.style.display = 'none';
  resultContainer.querySelector('tbody').innerHTML = '';
};

const nameInputPaste = (e) => {
  setTimeout(() => {
    const { target } = e;
    let { value } = target;
    const lIndex = value.indexOf('(');
    const rIndex = value.indexOf(')');

    value = value.substring(lIndex, rIndex);
    console.log(value);

    value = value.replaceAll(' ', '').replaceAll(')', '').replaceAll('(', '');

    let [left, right] = value.split(',');
    if (!left.match('[a-zA-Z]+')) return;
    if (isNaN(right)) return;

    target.value = left;
    const li = target.closest('li');
    const tValue = li.querySelector('#tValue');
    tValue.value = right;

    innerTarget();
    targets.scrollTop = targets.scrollHeight;
  }, 0);
};
