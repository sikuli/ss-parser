/* eslint max-statements: ["off"] */
const expect = require('chai').expect;
const actionsInterpreter = require('../lib/interpreters/actionsInterpreter');

describe('Actions interpreter:', () => {
  it('interprets mouse actions using names and aliases', () => {
    // Left click
    expect(actionsInterpreter.lookup('click')).to.deep.equal(
      { name: 'click', value: undefined });
    expect(actionsInterpreter.lookup('left-click')).to.deep.equal(
      { name: 'click', value: undefined });
    expect(actionsInterpreter.lookup('leftClick')).to.deep.equal(
      { name: 'click', value: undefined });
    expect(actionsInterpreter.lookup('left click')).to.deep.equal(
      { name: 'click', value: undefined });
    // Right click
    expect(actionsInterpreter.lookup('right-click')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    expect(actionsInterpreter.lookup('rightClick')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    expect(actionsInterpreter.lookup('right click')).to.deep.equal(
      { name: 'rightclick', value: undefined });
    // Double click
    expect(actionsInterpreter.lookup('double-click')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    expect(actionsInterpreter.lookup('doubleClick')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    expect(actionsInterpreter.lookup('double click')).to.deep.equal(
      { name: 'doubleclick', value: undefined });
    // Drag
    expect(actionsInterpreter.lookup('drag')).to.deep.equal(
      { name: 'drag', value: undefined });
    // Drop
    expect(actionsInterpreter.lookup('drop')).to.deep.equal(
      { name: 'drop', value: undefined });
    // Mouseover
    expect(actionsInterpreter.lookup('mouseover')).to.deep.equal(
      { name: 'hover', value: undefined });
    expect(actionsInterpreter.lookup('hover')).to.deep.equal(
      { name: 'hover', value: undefined });
    expect(actionsInterpreter.lookup('mouse hover')).to.deep.equal(
      { name: 'hover', value: undefined });
    expect(actionsInterpreter.lookup('mouse-hover')).to.deep.equal(
      { name: 'hover', value: undefined });
  });

  it('interprets keyboard actions using names and aliases', () => {
    // Type
    expect(actionsInterpreter.lookup('type')).to.deep.equal(
      { name: 'type', value: undefined });
    // Keypress
    expect(actionsInterpreter.lookup('keypress')).to.deep.equal(
      { name: 'keypress', value: undefined });
    expect(actionsInterpreter.lookup('press')).to.deep.equal(
      { name: 'keypress', value: undefined });
    expect(actionsInterpreter.lookup('key-press')).to.deep.equal(
      { name: 'keypress', value: undefined });
  });

  it('interprets desktop actions using names and aliases', () => {
    // Open
    expect(actionsInterpreter.lookup('open http://example.com')).to.deep.equal(
      { name: 'open', value: 'http://example.com' });
    // Browse
    expect(actionsInterpreter.lookup('browse http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
    expect(actionsInterpreter.lookup('navigate http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
    expect(actionsInterpreter.lookup('visit http://example.com')).to.deep.equal(
      { name: 'browse', value: 'http://example.com' });
  });

  it('interprets custom actions using names and aliases', () => {
    // Exist
    expect(actionsInterpreter.lookup('exist')).to.deep.equal(
      { name: 'exist', value: undefined });
    expect(actionsInterpreter.lookup('exists')).to.deep.equal(
      { name: 'exist', value: undefined });
    // Not exist
    expect(actionsInterpreter.lookup('not exist')).to.deep.equal(
      { name: 'notexist', value: undefined });
    expect(actionsInterpreter.lookup('notExist')).to.deep.equal(
      { name: 'notexist', value: undefined });
    // Delay
    expect(actionsInterpreter.lookup('delay 20 seconds')).to.deep.equal(
      { name: 'delay', value: '20 seconds' }
    );
    // Wait
    expect(actionsInterpreter.lookup('wait')).to.deep.equal(
      { name: 'wait', value: undefined });
    // Skip
    expect(actionsInterpreter.lookup('skip')).to.deep.equal(
      { name: 'skip', value: undefined });
    expect(actionsInterpreter.lookup('ignore')).to.deep.equal(
      { name: 'skip', value: undefined });
    // Pause
    expect(actionsInterpreter.lookup('pause')).to.deep.equal(
      { name: 'pause', value: undefined });
    // Stop
    expect(actionsInterpreter.lookup('stop')).to.deep.equal(
      { name: 'stop', value: undefined });
  });

  it('should not interpret unknown actions', () => {
    expect(actionsInterpreter.lookup('unknown')).to.deep.equal(
      { name: undefined, value: undefined });
  });

  it('should return all action names', () => {
    const result = actionsInterpreter.getSupportedActions();
    expect(result).to.have.length(37);
    expect(result).to.include.members(['click', 'open']);
  });
});
