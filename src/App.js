import React,{useEffect, useState} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import './App.css';

function App() {

  const [members, setMembers] = useState([]); 
  const [member, setMember] = useState({});
  const [forEditing, setForEditing] = useState(0);
  const [memberToUpdate, setMemberToUpdate] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(()=> {
    console.log("use effect");
    loadMembers();
  },
    [])

    const loadMembers = async () => {
      setLoading(true)
      const {data} = await axios.get("http://localhost:5000/members")
      console.log("response: ", data)
      setMembers(data)
      setLoading(false)
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

    const handleEditNameOnChange = ({currentTarget}) => {
      console.log(currentTarget.value)
      setMemberToUpdate({...memberToUpdate, name: currentTarget.value})
    }

    const handleEditAgeOnChange = ({currentTarget}) => {
      console.log(currentTarget.value)
      setMemberToUpdate({...memberToUpdate, age: currentTarget.value})
    }

    const handleAddMember = async () => {
      try{
        setLoading(true)
      const {data: createdMember} = await axios.post("http://localhost:5000/members", member)
      const newMemberCollection = [...members, createdMember]
      setMembers(newMemberCollection)
      setLoading(false)
    }
    catch (e) {
      alert(e.message)
    }
    }

    const handleEditMember = (member) => {
      setForEditing(member.id)
      setMemberToUpdate(member)
    }

    const previousMembers = [...members];

    const handleUpdateMember = async() => {
      const index = members.findIndex(m => m.id === memberToUpdate.id)
      const updatedMembers  = [...members]
      updatedMembers[index] = memberToUpdate;
      
      setMembers(updatedMembers)
      setForEditing(0)

      try{
        await axios.put(`http://localhost:5000/members/${memberToUpdate.id}`,memberToUpdate)
      }
      catch (e) {
        setMembers(previousMembers)
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
      <h3>
        <ul>
        {loading ? <h2>I'm loading... wait
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </h2> 
       
        : 
        members.map(m => 
        <li key={m.id}>
          {m.name}, {m.age} 
          {forEditing === m.id ? ( 
          <> 
            <input type="text" value={memberToUpdate.name} onChange={handleEditNameOnChange}></input>
            <input type="text" value={memberToUpdate.age} onChange={handleEditAgeOnChange}></input>
          </>
          ) : (`name: ${m.name}, age: ${m.age}`)}
          {forEditing === m.id ? (
          <button onClick={handleUpdateMember}>Update</button>
          ):
          <button onClick={() => handleEditMember(m)}>Edit</button>}
          <button onClick={() => deleteMembers(m.id)}>Delete</button>
        </li>)}
        </ul></h3>
        <p>
         says hello react
         <Button variant="contained" color="primary">
      Hello World
    </Button>
        </p>
        </header>
    </div>
  );
}

export default App;
