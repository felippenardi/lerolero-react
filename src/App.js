import React, { Component } from 'react';
import { mapState, matchesState } from 'xstate';
import './App.css';
import stateMachine from './stateMachine';
import generate from './generator';
import defaultSentences from './defaultSentences';
import psychoanalystSentences from './psychoanalystSentences';

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
    var generator = mapState(this.sentenceGenerationMap, this.state);
    if (generator) {
      return <div className="sentence">{generator()}</div>;
    } else {
      return <div className="sentence">deu ruim...</div>;
    }
  }

  sentenceGenerationMap = {
    'theme.generic': () => {
      return generate(defaultSentences)();
    },
    'theme.psychoanalyst': () => {
      return generate(psychoanalystSentences)();
    },
    'theme.astronomer': () => {
      return 'astronomer sentence';
    },
  }

  generateSentence = () => {
    var action = mapState(this.shakeActionMap, this.state);
    action && action();
  }

  shakeTimeout = null;

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

    return (
        <div>
            <div className="wrapper">
                <div className="content" ng-controller="MainCtrl">

                    <div className="side">
                        <div className="ovelha">

                            <h1>Lero Lero</h1>

                            <a onClick={() => this.generateSentence()} id="gerar-frase" href="#">
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

            <br/>
            {JSON.stringify(sheep)}
            {this.state.theme}
            <br/>
            <ul>
                <li><a href="#" onClick={() => this.trigger('SELECT_GENERIC')}>Generic</a></li>
                <li><a href="#" onClick={() => this.trigger('SELECT_PSYCHOANALYST')}>Freud glasses</a></li>
                <li><a href="#" onClick={() => this.trigger('SELECT_ASTRONOMER')}>Telescope</a></li>
            </ul>
        </div>
    );
  }
}

export default App;
