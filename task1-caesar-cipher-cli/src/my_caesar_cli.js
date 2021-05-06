const { Command } = require('commander');
const fs = require('fs');

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

console.log({ actionType, source, destination, shiftNum });

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
    if (!fs.existsSync(output)) {
      console.error(`Error: file ${output} does not exist`);
      process.exit(1)
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
