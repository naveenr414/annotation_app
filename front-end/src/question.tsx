import * as React from 'react';
import { Markup } from 'interweave';
import { Button } from '@material-ui/core';

export default class Question extends React.Component {  
  state = {
    question_text: "",
    question_id: 0
    tournament: "",
    entities: [],
    entity_locations: [],
    currently_tagged: [],
    preview: true,
    edit: false, 
  };
  
  constructor(props) {
    super(props);
    let question_id = props.question_id;
    this.state.question_id = question_id; 
    fetch("http://localhost:8000/api/qanta/v1/api/qanta/v1/"+question_id)
      .then(res=>res.json())
      .then((result) => {
        this.setState({
          question_text: result["text"].toString();
          tournament: result["tournament"].toString();
          entities: result["entities"];
          entity_locations: result["entity_locations"];
        });
        console.log(result);
      }
      (error) => {
        this.setState({
          name: "Error",
          tournament: "Error",
        });
      });
      );
  }
  
  /* Add another word to the current entity */ 
  addToTag = (i) => {
    this.state.currently_tagged.push(i);
  }
  
  get_question = () => {
    let words = this.state.question_text.split(" ");
    var entity_pointer = 0;
    var entity_length = this.state.entity_locations.length;
    
    let all_tags = [];
    
    // Loop through each of the words
    // Write it out as an HTML tag 
    let i = 0;
    while(i<words.length) {
      
      // If it's part of an entity, then combine the tags 
      if(entity_length>entity_pointer && 
          this.state.entity_locations[entity_pointer][0] == i) {

        // We let the ID for the tag be comma seperated version of each word #
        let all_locations = this.state.entity_locations[entity_pointer];
        let comma_seperated = all_locations.map(String);
        let comma_seperated = comma_seperated.join(",");
        
        let word = "";
        
        // Add the words in 
        for(var j = 0;j<this.state.entity_locations[entity_pointer].length;j++) {
          word+=words[i]+" ";
          i+=1;
        }
        
        // At the end, when we close, add in the actual entity 
        word+="(" + this.state.entities[entity_pointer]+ ")";
        entity_pointer+=1;
        
        console.log(word);
        
        let ret = <mark id={comma_seperated} style={{backgroundColor: "yellow"}}key={i}> {word}</mark>
        all_tags.push(<mark key={i+0.5} style={{backgroundColor: "white"}}> &nbsp;</mark>);        
        all_tags.push(ret);
      }
      else {
        let ret=<mark id={i} key={i+1} style={{backgroundColor: "white"}} onClick={(function(i,f) {return function() {f(i)}})(i,this.addToTag)}> {words[i]} </mark> ;
        i+=1;
        all_tags.push(ret);
      }
    }
    return all_tags;
  }
  
  write_entities = (question_id, word_locations,entity_list) => {
      var xhr = new XMLHttpRequest();
      console.log(entity_list);
     xhr.open('POST', 'http://localhost:8000/api/paste/v1/new_entity');
        xhr.send(JSON.stringify({ question_id: this.state.question_id,
        word_numbers:word_locations,
         entities: entity_list }));
      
  }

  editable = () => {
    if(this.state.edit) {
      return "Editable";
    }
    else{
      return "Not Editable"  ;
    }
  }
  
  switch_preview = () => {
    this.setState({
      preview: !this.state.preview
    });
  }
  
  switch_edit = () => { 
function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b)
};
    if(this.state.edit) {
      console.log(this.state.currently_tagged); 
      if(this.state.currently_tagged.length > 0) {
        let new_entity = prompt("What is the entity?");
        let new_array = this.state.currently_tagged.slice(0);
        new_array.sort();
        new_array = removeDuplicates(new_array);
        alert(new_array);
        // Write the new entity 
        // Find out where in the list to write it
        let found = false;
        for(var i = 0;i<this.state.entity_locations.length;i++) {
          if(this.state.entity_locations[i][0]>this.state.currently_tagged[0]) {
            this.state.entity_locations.splice(i,0,new_array);
            this.state.entities.splice(i,0,new_entity);
            found = true;
            break;
          }
        }
        if(!found) {
          this.state.entity_locations.push(new_array);
          this.state.entities.push(new_entity);
        }
        this.state.currently_tagged = [];
        
        this.write_entities(this.state.question_id,this.state.entity_locations,this.state.entities);
        

      }
    }
  
    this.setState({
      edit: !this.state.edit;
    });
  }
  
  render () {
    return (
      <div>
        <h3> {this.state.tournament} </h3> 
        <h4> {this.editable()} </h4> 
        <br /> 
        <b> Entities: </b> {this.state.entities.join(",")}
        <br /> 
        
        <div className="question">
        {this.get_question() }       
        </div>
        
        <br /> 
        <Button onClick={this.switch_preview}> Toggle Question </Button> 
        <Button onClick={this.switch_edit}> Toggle Edit </Button> 
      </div>
    );
  }
}

