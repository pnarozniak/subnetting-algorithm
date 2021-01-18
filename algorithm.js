const binUtils = {
  getBin: (value) => {
    return value.toString(2);
  },
  getBinX: (value, X) => {
    let bin = binUtils.getBin(value);
    while (bin.length < X) {
      bin = `0${bin}`;
    }
    return bin;
  },
};

const resolve = (ipV4, networkMask, targets, { sizeSort, lexSort }) => {
  const splitIP = () => {
    const binIP = ipV4
      .split('.')
      .map((value) => binUtils.getBinX(parseInt(value), 8))
      .join('');
    const unmodifable = binIP.substring(0, networkMask);
    const modifable = binIP.substring(networkMask).replaceAll('1', '0');

    return {
      _unmodifable: unmodifable,
      modifable: modifable,
      get ip() {
        const bin = `${this._unmodifable}${this.modifable}`;
        const binArray = [
          bin.substring(0, 8),
          bin.substring(8, 16),
          bin.substring(16, 24),
          bin.substring(24, 32),
        ];
        return binArray.map((value) => parseInt(value, 2)).join('.');
      },
      setmodifable(value) {
        this.modifable = `${this.modifable.substring(
          0,
          this.modifable.length - value
        )}`;
        for (let i = 0; i < value; i++) {
          this.modifable += '1';
        }
      },
      increment() {
        let dec = parseInt(this.modifable, 2) + 1;
        this.modifable = binUtils.getBinX(dec, this.modifable.length);
      },
    };
  };

  const getMaskLength = (value) => {
    return 32 - binUtils.getBin(value + 2 - 1).length;
  };

  const sortTargets = () => {
    targets.forEach((target) => {
      target.maskLength = getMaskLength(target.value);
    });

    const sortByValue = () => {
      targets.sort(({ value: aValue }, { value: bValue }) => {
        let diff = aValue - bValue;
        if (sizeSort === 'max->min') {
          diff *= -1;
        }
        return diff;
      });
    };

    sortByLex = () => {
      targets.sort(
        (
          { maskLength: aMask, name: aName },
          { maskLength: bMask, name: bName }
        ) => {
          let diff = aMask - bMask;
          if (diff === 0) {
            let compareValue = aName.localeCompare(bName);
            if (lexSort === 'z->a') {
              compareValue *= -1;
            }
            return compareValue;
          }
          return 0;
        }
      );
    };

    sortByValue();
    sortByLex();
  };

  sortTargets();
  const result = [];
  const IP = splitIP();

  targets.forEach(({ name, value, maskLength }) => {
    const networkSize = Math.pow(2, 32 - maskLength);

    const sAddress = IP.ip;
    IP.setmodifable(32 - maskLength);
    const bAddress = IP.ip;

    result.push([name, value, sAddress, bAddress, maskLength, networkSize]);
    IP.increment();
  });

  showResult(result);
};
