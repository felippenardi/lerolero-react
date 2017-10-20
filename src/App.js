import React, { Component } from 'react';
import { mapState, matchesState } from 'xstate';
import './App.css';
import stateMachine from './stateMachine';

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
      return 'generic sentence';
    },
    'theme.psychoanalyst': () => {
      return 'psychoanalyst sentence';
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
        <span style={{ visibility: matchesState('sheep.shaking', this.state) ? 'hidden' : 'visible'}}>
          {this.renderSentence()}
        </span>

        <button type="submit" disabled={
            mapState(this.disabledMap, this.state) ? 'disabled' : ''
          }
          onClick={() => this.generateSentence()}
        >
          Gerar Frase
        </button>

        {JSON.stringify(sheep)}
        {this.state.theme}
        <br/>
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
