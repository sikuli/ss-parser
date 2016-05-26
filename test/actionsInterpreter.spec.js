/* eslint max-statements: ["off"] */
const expect = require('chai').expect;
const actionsInterpreter = require('../lib/interpreters/actionsInterpreter');

describe('Actions interpreter:', () => {
  it('interprets mouse actions using names and aliases', () => {
    // Left click
    expect(actionsInterpreter('click')).to.equal('click');
    expect(actionsInterpreter('left-click')).to.equal('click');
    expect(actionsInterpreter('leftClick')).to.equal('click');
    expect(actionsInterpreter('left click')).to.equal('click');
    // Right click
    expect(actionsInterpreter('right-click')).to.equal('rightclick');
    expect(actionsInterpreter('rightClick')).to.equal('rightclick');
    expect(actionsInterpreter('right click')).to.equal('rightclick');
    // Double click
    expect(actionsInterpreter('double-click')).to.equal('doubleclick');
    expect(actionsInterpreter('doubleClick')).to.equal('doubleclick');
    expect(actionsInterpreter('double click')).to.equal('doubleclick');
    // Drag
    expect(actionsInterpreter('drag')).to.equal('drag');
    // Drop
    expect(actionsInterpreter('drop')).to.equal('drop');
    // Mouseover
    expect(actionsInterpreter('mouseover')).to.equal('hover');
    expect(actionsInterpreter('hover')).to.equal('hover');
    expect(actionsInterpreter('mouse hover')).to.equal('hover');
    expect(actionsInterpreter('mouse-hover')).to.equal('hover');
  });

  it('interprets keyboard actions using names and aliases', () => {
    // Type
    expect(actionsInterpreter('type')).to.equal('type');
    // Keypress
    expect(actionsInterpreter('press')).to.equal('keypress');
    expect(actionsInterpreter('key-press')).to.equal('keypress');
    expect(actionsInterpreter('key press')).to.equal('keypress');
    expect(actionsInterpreter('keyPress')).to.equal('keypress');
  });

  it('interprets desktop actions using names and aliases', () => {
    // Open
    expect(actionsInterpreter('open')).to.equal('open');
    // Browse
    expect(actionsInterpreter('browse')).to.equal('browse');
    expect(actionsInterpreter('browser')).to.equal('browse');
    expect(actionsInterpreter('navigate')).to.equal('browse');
    expect(actionsInterpreter('navigate-to')).to.equal('browse');
    expect(actionsInterpreter('navigate to')).to.equal('browse');
  });

  it('interprets custom actions using names and aliases', () => {
    // Exist
    expect(actionsInterpreter('exist')).to.equal('exist');
    expect(actionsInterpreter('exists')).to.equal('exist');
    // Not exist
    expect(actionsInterpreter('not exist')).to.equal('notexist');
    expect(actionsInterpreter('notExist')).to.equal('notexist');
    // Delay
    expect(actionsInterpreter('delay')).to.equal('delay');
    // Wait
    expect(actionsInterpreter('wait')).to.equal('wait');
    // Skip
    expect(actionsInterpreter('skip')).to.equal('skip');
    expect(actionsInterpreter('ignore')).to.equal('skip');
    // Pause
    expect(actionsInterpreter('pause')).to.equal('pause');
    // Stop
    expect(actionsInterpreter('stop')).to.equal('stop');
  });

  it('should not interpret unknown actions', () => {
    expect(actionsInterpreter('unknown')).to.equal(undefined);
  });
});
