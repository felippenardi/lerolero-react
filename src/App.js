import React, { Component } from 'react';
import { mapState, matchesState } from 'xstate';
import './App.css';
import stateMachine from './stateMachine';
import generate from './generator';
import defaultSentences from './defaultSentences';
import psychoanalystSentences from './psychoanalystSentences';
import developerSentences from './developerSentences';
import Transition from 'react-transition-group/Transition'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = stateMachine.getInitialState();
  }

  trigger = (action) => {
    this.setState(
      stateMachine.transition(this.state, action).value
    );
  }

  triggerAndShake = (action) => {
    this.generateSentence();

    // Without the timeout, the stateMachine won't trigger
    setTimeout(() => {
      this.trigger(action);
    });
  }

  renderSentence = () => {
    const isStill = matchesState('sheep.still', this.state);
    const isCrazy = matchesState('sheep.shaking.crazy_shake', this.state);
    return (
      <Transition in={!isStill} timeout={50}>
        {(status) => (
          <div className={`sentence sentence-${status}`}>
            {this.sentence}
          </div>
        )}
      </Transition>
    );
  }

  sentenceGenerationMap = {
    'theme.generic': () => {
      return generate(defaultSentences)();
    },
    'theme.psychoanalyst': () => {
      return generate(psychoanalystSentences)();
    },
    'theme.developer': () => {
      return generate(developerSentences)();
    },
  }

  generateSentence = () => {
    var action = mapState(this.shakeActionMap, this.state);
    action && action();
  }

  shakeTimeout = null;

  sentence = '';

  disabledMap = {
    'sheep.shaking.crazy_shake': true
  }

  shakeActionMap = {
    'sheep.shaking.brief_shake': () => {
      clearTimeout(this.shakeTimeout);
      this.trigger('SHAKE')
      setTimeout(() => {
        this.trigger('TIMER');
        this.shakeTimeout = setTimeout(() => {
          this.trigger('FINISH_SHAKE');
        }, 500);
      }, 500);
    },
    'sheep.still': () => {
      this.trigger('SHAKE')
      this.shakeTimeout = setTimeout(() => {
        this.trigger('FINISH_SHAKE');
      }, 500);
    }
  }

  render() {
    const { sheep, theme } = this.state;

    if (matchesState('sheep.still', this.state)) {
      var generator = mapState(this.sentenceGenerationMap, this.state);
      this.sentence = generator();
    }

    const isCrazy = matchesState('sheep.shaking.crazy_shake', this.state);

    return (
        <div>
            <div className="wrapper">
                <div className="content" ng-controller="MainCtrl">

                    <div className="side">
                      <div className="ovelha">

                            <h1>Lero Lero</h1>

                            <a
                              onClick={() => this.generateSentence()} id="gerar-frase"
                              className={`${isCrazy ? 'crazy-shake' : ''}`}
                            >
                                Gerar frase
                            </a>

                        </div>
                    </div>

                    <article className="main">
                        <blockquote className="frase">
                            {this.renderSentence()}
                        </blockquote>
                    </article>

                </div>
            </div>

            <div className="generators">
              Modo:
              <span className="generators__option">
                <a className="generators__option__link" href="#" onClick={
                  () => this.triggerAndShake('SELECT_GENERIC')
                }>Original</a>
              </span>
              <span className="generators__option">
                <a className="generators__option__link" href="#" onClick={
                  () => this.triggerAndShake('SELECT_PSYCHOANALYST')
                }>Psicanalítico</a>
              </span>
              <span className="generators__option">
                <a className="generators__option__link" href="#" onClick={
                  () => this.triggerAndShake('SELECT_DEVELOPER')
                }>Programador</a>
              </span>
            </div>
        </div>
    );
  }
}

export default App;
