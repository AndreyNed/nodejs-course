function shiftInRange(v, sh, min, max, action) {
  let shifted = v;
  if (v >= min && v <= max) {
    if (action === 'encode') {
      shifted = v + sh;
      shifted = shifted > max ? min + shifted - max - 1 : shifted
    } else if (action === 'decode') {
      shifted = v - sh;
      shifted = shifted < min ? max - min + shifted + 1 : shifted;
    }
  }

  return shifted;
}

module.exports = shiftInRange;
