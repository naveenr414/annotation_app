 import * as React from 'react';
import Question from './Question';
import './Question.css';

export default class Annotation extends React.Component {  
  state = {
    value: '',
    current_tags: [],
  };
  
  
  
  constructor(props) {
    super(props);
  }
  
  getTags = () => {
    let indices = this.props.tags;
    let words = [];
    for(var i = 0;i<indices.length;i++) {
      words.push(this.props.question_text.replace("\xa0"," ").split(/[ ,]+/)[indices[i]);
    }
    
    return words.join(" ");
  }
  
  sub = () => {
    this.props.callbackFunction(this.state.value);
  }
  
  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  
  getInput = () => {
    if(this.props.tags.length>0){ 
      return <div> What entity is this:  <input onChange={this.handleChange}  type="text" /> <button onClick={this.sub}> Submit </button> </div> 
     }
  }
  
  render () {
    return (
      <div> 
        <h3> Tagged Words: {this.getTags()} </h3> 
          {this.getInput()}
        <br /> 
      </div> 
    );
  }
}

