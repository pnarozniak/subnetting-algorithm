const targets = document.getElementById('targets');
const resultContainer = document.getElementById('result');
const pasteMultipleContainer = document.getElementById('paste-multiple');
pasteMultipleContainer.tabIndex = 0;

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
        <input type="text" id="tName" required>
        <label for="tName" class="absolute-label">Name</label>
      </div>`;
      targetValue = `
      <div style="position: relative">
        <input type="number" id="tValue" required>
        <label for="tValue" class="absolute-label">Value</label>
      </div>`;
    } else {
      targetName = `<input type="text" id="tName" required>`;
      targetValue = `<input type="number" id="tValue" required>`;
    }

    const targetRemove = `<input type="button" id="tRemove" value="X" onclick="removeTarget(this)" class="close-button"/>`;

    li.innerHTML += `${targetName}${targetValue}${targetRemove}`;
    return li;
  };

  const target = createTarget();
  targets.insertBefore(target, document.getElementById('tAdd').closest('li'));

  return target;
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

const reloadTargets = () => {
  const nodesToRemove = [];
  for (let i = 0; i < targets.children.length; i++) {
    const id = targets.children[i].id;
    console.log(id);
    if (id) nodesToRemove.push(targets.children[i]);
  }

  nodesToRemove.forEach((node) => {
    targets.removeChild(node);
  });
};

const showMultiple = () => {
  pasteMultipleContainer.style.display = 'flex';
  pasteMultipleContainer.focus();
};

const closeMultiple = () => {
  pasteMultipleContainer.style.display = 'none';
};

pasteMultipleContainer.addEventListener('paste', (e) => {
  console.log('here');
  e.stopPropagation();
  e.preventDefault();

  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('Text');

  if (!pastedData) closeMultiple();

  const rSplitted = pastedData
    .split(')')
    .filter((val) => val.includes('(') && val.includes(','))
    .map((val) => {
      let rsVal = val.substring(val.indexOf('(') + 1);
      return rsVal.replaceAll(' ', '');
    })
    .filter((val) => {
      const splitted = val.split(',');
      if (splitted.length !== 2) return false;

      const [left, right] = splitted;
      if (!left || isNaN(right)) return false;

      return true;
    })
    .map((val) => val.split(','));

  if (!rSplitted || rSplitted.length === 0) return closeMultiple();

  reloadTargets();
  rSplitted.forEach((arr) => {
    const target = innerTarget();
    const tValue = target.querySelector('#tValue');
    const tName = target.querySelector('#tName');

    tName.value = arr[0];
    tValue.value = parseInt(arr[1]);
  });

  closeMultiple();
});
