const { Transform } = require('stream');

const shiftInRange = require('./shift-in-range');

function createTransform(shiftNum, actionType) {
  return new Transform({
    transform(chunk, encoding, callback) {
      const shifted = chunk.toString().replace(/[A-Za-z]/g, ch => {
        const code = [[65, 90], [97, 122]].reduce((acc, [min, max]) => (
          shiftInRange(acc, shiftNum, min, max, actionType)
        ), ch.charCodeAt(0));
        return String.fromCharCode(code);
      });

      this.push(new Buffer.from(shifted, 'utf-8'));
      callback();
    }
  });
}

module.exports = createTransform;
