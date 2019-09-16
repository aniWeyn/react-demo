import React,{useEffect, useState} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {

  const [members, setMembers] = useState([]); 
  const [member, setMember] = useState({});

  useEffect(()=> {
    console.log("use effect");
    loadMembers();
  },
    [])

    const loadMembers = async () => {
      const {data} = await axios.get("http://localhost:5000/members")
      console.log("response: ", data)
      setMembers(data)
    } 

    //pessimistic update
    /*const deleteMembers =  async (id) => {
      try{
      await axios.delete(`http://localhost:5000/members/${id}`)
      const newMembers = members.filter(m => m.id !== id);
      //console.log(newMembers)
      setMembers(newMembers)
    }catch(e) {
      alert(e.message)
    }
    }*/

    //optimistic update
    const deleteMembers =  async (id) => {
      const previousMembers = [...members];
      const newMembers = members.filter(m => m.id !== id);
      setMembers(newMembers)
      try{
      await axios.delete(`http://localhost:5000/members/${id}`)
      
      //console.log(newMembers)
      
    }catch(e) {
      //rollback
      setMembers(previousMembers)
      alert(e.message)
    }
    }

    const handleNameOnChange = ({currentTarget}) => {
      setMember({...member, name: currentTarget.value})
    }

    const handleAgeOnChange = ({currentTarget}) => {
      setMember({...member, age: currentTarget.value})
    }

    const handleAddMember = async () => {
      try{
      const {data: createdMember} = await axios.post("http://localhost:5000/members", member)
      const newMemberCollection = [...members, createdMember]
      setMembers(newMemberCollection)
    }
    catch (e) {
      alert(e.message)
    }
    }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="text" onChange={(e) => {console.log(e.currentTarget.value)}}></input>
      <input type="text" onChange={handleNameOnChange}></input>
      <input type="text" onChange={handleAgeOnChange}></input>
      <button onClick={handleAddMember}>Add</button>
      <h3><ul>{members.map(m => <li key={m.id}>
          {m.name}, {m.age} <button onClick={() => deleteMembers(m.id)}>Delete</button>
        </li>)}
        </ul></h3>
        <p>
         says hello react
        </p>
        </header>
    </div>
  );
}

export default App;
