const _ = require('lodash');
const actions = {
  click: { aliases: ['left click', 'left-click', 'leftclick'] },
  rightclick: { aliases: ['right click', 'right-click'] },
  doubleclick: { aliases: ['double-click', 'double click'] },
  hover: { aliases: ['mouseover', 'mouse-hover', 'mouse hover'] },
  type: { aliases: [] },
  keypress: { aliases: ['press', 'key-press'] },
  open: { aliases: [] },
  browse: { aliases: ['browser', 'navigate', 'visit'] },
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
 * Indicates whether an action may include a value or not.
 * Actions that include a value are: open, browse, skip, delay, pause, type, and keypress
 *
 */
function actionHasValue(word) {
  const wordsWithValues = _.concat([], ['open', 'browse', 'skip', 'delay',
        'pause', 'type', 'keypress'], actions.open.aliases, actions.browse.aliases,
         actions.skip.aliases, actions.delay.aliases, actions.pause.aliases,
         actions.type.aliases, actions.keypress.aliases);
  return _.findIndex(wordsWithValues, (w) => word.startsWith(w)) > -1;
}
/**
 * Returns the action name.
 * @param {string} word - The word to lookup in the list of supported actions.
 * The action word is case-insensitive and all extra white spaces are removed.
 * @returns {string} The action name
 */
exports.lookup = function lookup(word) {
  const searchWord = word.toLowerCase().trim().replace(/\s\s+/g, ' ');
  const hasValue = actionHasValue(searchWord);
  if (hasValue) {
    const actionParts = searchWord.split(' ');
    const value = actionParts.length > 1 ? actionParts.slice(1).join(' ') : undefined;
    const name = actions[actionParts[0]] ? actionParts[0] :
      _.findKey(actions, (action) => _.indexOf(action.aliases, actionParts[0]) !== -1);
    return { name, value };
  }
  else if (actions[searchWord] && !hasValue) {
    return { name: searchWord, value: undefined };
  }
  return { name: _.findKey(actions, (action) =>
    _.indexOf(action.aliases, searchWord) !== -1
  ), value: undefined };
};

exports.getSupportedActions = function getSupportedActions() {
  const names = _.keys(actions, (key) => key);
  const values = _.chain(actions)
                  .map((val) => val.aliases)
                  .flattenDeep()
                  .value();
  return _.concat(names, values);
};
