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
    if (!fs.existsSync(output)) {
      process.stderr.write(`Error: ${output} does not exist`);
    }

    try {
      fs.accessSync(output, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      console.error(`Error: no access to ${output}`);
    }

    destination = fs.createWriteStream(output, { flags: 'a' });
  }

  return {
    source,
    destination,
    shiftNum: s < 0 ? 27 + s : s,
    actionType: action,
  };
}

module.exports = getOptions;
