# Caezar Cipher CLI

1. Start of application:
   node src/my_caezar_cli.js -s \<shift> -a \<action> -i \<inputFile> -o \<outputFile>
   
2. Parameters for application:
   
   -a (--action) - one of [encode, decode]
   
   -s (--shift) - value of shift (negative or positive)
   
   -i (--input) - source file name (if not passed - stdin)
   
   -o (--output) - source file name (if not passed - stdout)

3. For test of application it is possible to use files in folder `data`. Package.json contains scripts for decode/encode these files.
`npm run encode:bigFile` - will read info from `data/decoded/bigFile-decoded.txt` and will write encoded text to `data/encoded/bigFile-encoded.txt`
