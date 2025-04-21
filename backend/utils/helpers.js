// Map card value to number
function mapCardValueToNumber(value) {
  const valueMapping = {
    ACE: 1,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
  };
  return valueMapping[value] || parseInt(value, 10);
}

module.exports = {
  mapCardValueToNumber,
};
