const fs = require('fs');
const path = require('path');

function getOptions({ input, output, shift, action }) {
  let s = parseInt(shift, 10);
  let source = process.stdin;
  let destination = process.stdout;

  if (!action || typeof action !== 'string') {
    process.stderr.write('Error: argument action is required and should be one of [encode, decode]');
    process.exit(1);
  }

  if (!Number.isInteger(s)) {
    process.stderr.write('Error: argument shift is required and should be integer');
    process.exit(1);
  }

  s = s % 26;

  if (input) {
    if (!fs.existsSync(input)) {
      process.stderr.write(`Error: file ${input} does not exist`);
      process.exit(1);
    } else {
      source = fs.createReadStream(input);
    }
  }

  if (output) {
    const filePath = path.dirname(output);
    try {
      if (!fs.lstatSync(filePath).isDirectory()) throw new Error('Error: output directory does not exist');
    } catch (e) {
      process.stderr.write(e.toString());
      process.exit(1);
    }

    if (fs.existsSync(output)) {
      try {
        fs.unlinkSync(output);
      } catch(e) {
        process.stderr.write(`Error: no access to the ${output}`);
        process.exit(1);
      }
    }

    destination = fs.createWriteStream(output);
  }

  return {
    source,
    destination,
    shiftNum: s < 0 ? 27 + s : s,
    actionType: action,
  };
}

module.exports = getOptions;
