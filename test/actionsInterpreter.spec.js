/* eslint max-statements: ["off"] */
const expect = require('chai').expect;
const actionsInterpreter = require('../lib/interpreters/actionsInterpreter');

describe('Actions interpreter:', () => {
  it('interprets mouse actions using names and aliases', () => {
    // Left click
    expect(actionsInterpreter('click')).to.deep.equal({ name: 'click', value: undefined });
    expect(actionsInterpreter('left-click')).to.deep.equal({ name: 'click', value: undefined });
    expect(actionsInterpreter('leftClick')).to.deep.equal({ name: 'click', value: undefined });
    expect(actionsInterpreter('left click')).to.deep.equal({ name: 'click', value: undefined });
    // Right click
    expect(actionsInterpreter('right-click')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    expect(actionsInterpreter('rightClick')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    expect(actionsInterpreter('right click')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    // Double click
    expect(actionsInterpreter('double-click')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    expect(actionsInterpreter('doubleClick')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    expect(actionsInterpreter('double click')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    // Drag
    expect(actionsInterpreter('drag')).to.deep.equal({ name: 'drag', value: undefined });
    // Drop
    expect(actionsInterpreter('drop')).to.deep.equal({ name: 'drop', value: undefined });
    // Mouseover
    expect(actionsInterpreter('mouseover')).to.deep.equal({ name: 'hover', value: undefined });
    expect(actionsInterpreter('hover')).to.deep.equal({ name: 'hover', value: undefined });
    expect(actionsInterpreter('mouse hover')).to.deep.equal({ name: 'hover', value: undefined });
    expect(actionsInterpreter('mouse-hover')).to.deep.equal({ name: 'hover', value: undefined });
  });

  it('interprets keyboard actions using names and aliases', () => {
    // Type
    expect(actionsInterpreter('type')).to.deep.equal({ name: 'type', value: undefined });
    // Keypress
    expect(actionsInterpreter('keypress')).to.deep.equal({ name: 'keypress', value: undefined });
    expect(actionsInterpreter('press')).to.deep.equal({ name: 'keypress', value: undefined });
    expect(actionsInterpreter('key-press')).to.deep.equal({ name: 'keypress', value: undefined });
  });

  it('interprets desktop actions using names and aliases', () => {
    // Open
    expect(actionsInterpreter('open http://example.com')).to.deep.equal(
      { name: 'open', value: 'http://example.com' });
    // Browse
    expect(actionsInterpreter('browse http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
    expect(actionsInterpreter('navigate http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
    expect(actionsInterpreter('visit http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
  });

  it('interprets custom actions using names and aliases', () => {
    // Exist
    expect(actionsInterpreter('exist')).to.deep.equal({ name: 'exist', value: undefined });
    expect(actionsInterpreter('exists')).to.deep.equal({ name: 'exist', value: undefined });
    // Not exist
    expect(actionsInterpreter('not exist')).to.deep.equal({ name: 'notexist', value: undefined });
    expect(actionsInterpreter('notExist')).to.deep.equal({ name: 'notexist', value: undefined });
    // Delay
    expect(actionsInterpreter('delay 20 seconds')).to.deep.equal(
      { name: 'delay', value: '20 seconds' }
    );
    // Wait
    expect(actionsInterpreter('wait')).to.deep.equal({ name: 'wait', value: undefined });
    // Skip
    expect(actionsInterpreter('skip')).to.deep.equal({ name: 'skip', value: undefined });
    expect(actionsInterpreter('ignore')).to.deep.equal({ name: 'skip', value: undefined });
    // Pause
    expect(actionsInterpreter('pause')).to.deep.equal({ name: 'pause', value: undefined });
    // Stop
    expect(actionsInterpreter('stop')).to.deep.equal({ name: 'stop', value: undefined });
  });

  it('should not interpret unknown actions', () => {
    expect(actionsInterpreter('unknown')).to.deep.equal({ name: undefined, value: undefined });
  });
});
