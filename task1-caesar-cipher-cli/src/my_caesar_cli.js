const { Command } = require('commander');
const fs = require('fs');
const { pipeline, Transform } = require('stream');

const program = new Command();

program.version('1.0.0');
program
  .option('-i, --input <inputFileName>', 'input file name (optional)')
  .option('-o, --output <outputFileName>', 'output file name (optional)')
  .option('-s, --shift <shiftValue>', 'shift value (required, should be integer)', '0')
  .option('-a, --action <actionType>', 'action (required, one of [encode, decode])', v => (v.match(/^(en|de)code$/) || [])[0], false)
  .parse();

let {
  actionType,
  source,
  destination,
  shiftNum,
} = getOptions(program.opts());

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const shifted = chunk.toString().replace(/[A-Za-z]/g, ch => {
      const code = [[65, 90], [97, 122]].reduce((acc, [min, max]) => (
        shiftInRange(acc, shiftNum, min, max, actionType)
      ), ch.charCodeAt(0));
      // console.log(ch.charCodeAt(0), '==>', code);
      return String.fromCharCode(code);
    });

    this.push(new Buffer.from(shifted, 'utf-8'));
    callback();
  }
});

pipeline(
  source,
  transform,
  destination,
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Success!');
  },
);

function shiftInRange(v, sh, min, max, action) {
  let shifted = v;
  if (v >= min && v <= max) {
    if (action === 'encode') {
      shifted = v + sh;
      shifted = shifted > max ? min + shifted - max - 1 : shifted
    } else if (action === 'decode') {
      shifted = v - sh;
      shifted = shifted < min ? min - shifted + max + 1 : shifted;
    }
  }

  return shifted;
}

function getOptions({ input, output, shift, action }) {
  let s = parseInt(shift, 10);
  let source = process.stdin;
  let destination = process.stdout;

  if (!action || typeof action !== 'string') {
    console.error('Error: argument action is required and should be one of [encode, decode]');
    process.exit(1);
  }

  if (!Number.isInteger(s)) {
    console.error('Error: argument shift is required and should be integer');
    process.exit(1);
  }

  s = s % 26;

  if (input) {
    if (!fs.existsSync(input)) {
      console.error(`Error: file ${input} does not exist`);
      process.exit(1);
    } else {
      source = fs.createReadStream(input);
    }
  }

  if (output) {
    /* if (!fs.existsSync(output)) {
      console.error(`Error: file ${output} does not exist`);
      process.exit(1)
    } */
    destination = fs.createWriteStream(output);
  }

  return {
    source,
    destination,
    shiftNum: s < 0 ? 27 + s : s,
    actionType: action,
  };
}
