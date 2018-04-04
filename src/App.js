import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import logo from './d6-6-glow.svg';
import Random from 'random-js';

import './App.css';

import Die from './components/die';
import SelectorForm from './components/selectorForm';

// create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
var engine = Random.engines.mt19937().autoSeed();
var distribution = Random.integer(1, 6);

function roll() {
  return distribution(engine);
}

function rollDice(baseCount, skillCount, gearCount) {
  let result = [];

  let index = 0;

  for (let i = 0; i < baseCount; i++) {
    result.push(<Die value={roll()} type="base" key={index} />);
    index++;
  }

  for (let i = 0; i < skillCount; i++) {
    result.push(<Die value={roll()} type="skill" key={index} />);
    index++;
  }

  for (let i = 0; i < gearCount; i++) {
    result.push(<Die value={roll()} type="gear" key={index} />);
    index++;
  }
  return result;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      baseCount: 0,
      skillCount: 0,
      gearCount: 0,
      dice: rollDice(0, 0, 0),
      pushDisabled: 'disabled',
    };

    this.handleRoll = e => {
      let { baseCount, skillCount, gearCount } = e;
      baseCount = parseInt(baseCount, 10);
      skillCount = parseInt(skillCount, 10);
      gearCount = parseInt(gearCount, 10);
      this.setState({
        baseCount,
        skillCount,
        gearCount,
        dice: rollDice(baseCount, skillCount, gearCount),
        pushDisabled: '',
      });
    };

    this.handlePush = e => {
      let newDice = [];
      for (let die of this.state.dice) {
        if (
          die.props.value === 6 ||
          (die.props.value === 1 && die.props.type !== 'skill')
        ) {
          // keep symbol dice
          newDice.push(die);
        } else {
          // reroll others
          newDice.push(
            <Die value={roll()} type={die.props.type} key={die.key} />
          );
        }
      }
      this.setState({ dice: newDice, pushDisabled: 'disabled' });
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <h1 className="App-title">Welcome to MYZ Roller</h1>
          </div>
        </header>

        <main>
          <div className="container">
            <div className="row">
              <div className="col s3">
                <SelectorForm
                  baseCount={this.state.baseCount}
                  skillCount={this.state.skillCount}
                  gearCount={this.state.gearCount}
                  handleRoll={this.handleRoll}
                  handlePush={this.handlePush}
                  pushDisabled={this.state.pushDisabled}
                />
              </div>
              <div className="col s9">{this.state.dice}</div>
            </div>
          </div>
        </main>

        <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col s12">
                Icons from{' '}
                <a
                  href="http://game-icons.net"
                  rel="noopener noreferrer"
                  target="_blank">
                  game-icons.net
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
