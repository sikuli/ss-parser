const _ = require('lodash');
const actions = {
  click: { aliases: ['left click', 'left-click', 'leftclick'] },
  rightclick: { aliases: ['right click', 'right-click'] },
  doubleclick: { aliases: ['double-click', 'double click'] },
  hover: { aliases: ['mouseover', 'mouse-hover', 'mouse hover'] },
  type: { aliases: [] },
  keypress: { aliases: ['press', 'key-press', 'key press'] },
  open: { aliases: [] },
  browse: { aliases: ['browser', 'navigate', 'navigate-to', 'navigate to'] },
  exist: { aliases: ['exists'] },
  notexist: { aliases: ['not exist'] },
  delay: { aliases: ['sleep'] },
  wait: { aliases: [] },
  drag: { aliases: [] },
  drop: { aliases: [] },
  skip: { aliases: ['ignore'] },
  pause: { aliases: [] },
  stop: { aliases: ['stop'] }
};
/**
 * Returns the action name.
 * @param {string} word - The word to lookup in the list of supported actions.
 * The action word is case-insensitive and all extra white spaces are removed.
 * @returns {string} The action name
 */
module.exports = function lookup(word) {
  const searchWord = word.toLowerCase().trim().replace(/\s\s+/g, ' ');
  if (actions[searchWord]) {
    return searchWord;
  }
  return _.findKey(actions, (o) =>
    _.indexOf(o.aliases, searchWord) !== -1
  );
};
