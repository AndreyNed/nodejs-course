const { Command } = require('commander');
const { pipeline } = require('stream');

const getOptions = require('./utils/get-options');
const createTransform = require('./utils/create-transform');

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

pipeline(
  source,
  createTransform(shiftNum, actionType),
  destination,
  (err) => {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    process.stdout.write('Success!');
  },
);
