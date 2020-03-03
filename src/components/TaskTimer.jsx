import React from 'react';
import { connect } from "react-redux";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Alert from './Alert';

import { start, stop } from '../redux/actionCreators';

import { getDiffInSeconds, formatTime } from '../utils';

class TaskTimer extends React.Component {
  constructor(props) {
    super(props);

    const { isStarted, startTime } = this.props;

    const counter = isStarted ? getDiffInSeconds(startTime) : 0;

    this.state = { input: '', counter, error: null };

    this.interval = null;
  }

  handleInput = event => {
    this.setState({ input: event.target.value });
  }

  handleError = () => this.setState(prev => ({ ...prev, error: null }));

  handleStart = () => {
    this.props.start();
    this.interval = setInterval(() => {
      this.setState(({ input, counter }) => ({ input, counter: counter + 1 }))
    }, 1000)
  };

  handleStop = () => {
    const { input } = this.state;
    if (!input) return this.setState(prev => ({
      ...prev,
      error: new Error('Task name couldn\'t be empty!')
    }));

    this.props.stop(input);

    this.setState({ input: '', counter: 0 });

    clearInterval(this.interval);
  }

  componentDidMount = () => {
    const { isStarted, startTime } = this.props;
    if (isStarted) {
      this.interval = setInterval(() => {
        const counter = Math.floor((Date.now() - startTime) / 1000);
        this.setState(({ input }) => ({ input, counter }))
      }, 1000)
    }
  }

  // TODO: replace it
  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  render() {
    console.log('render');
    const startButton = <Button variant="contained" onClick={this.handleStart}>START</Button>

    const stopButton = <Button variant="contained" onClick={this.handleStop}>STOP</Button>

    const { isStarted } = this.props;
    const { input, counter, error } = this.state;

    return (
      <div className="timer" >
        <Alert isOpen={!!error} message={error && error.message} onClick={this.handleError} />
        <TextField
          id="standard-basic"
          label="Your Task"
          onChange={this.handleInput}
          value={input}
        />
        <div className="clock" >{formatTime(counter)}</div>

        { isStarted ? stopButton : startButton}
      </div>
    );
  }
}

const mapStateToProps = ({ timer: { isStarted, startTime } }) => ({ isStarted, startTime });

export default connect(mapStateToProps, { start, stop })(TaskTimer);
