import React ,{useState}from 'react'

export default function CreateGroup() {
    const [data,setData]=useState(null)
    const [print,setPrint]=useState(false)

    function getData(val)
    {
      console.warn(val.target.value)
      setData(val.target.value)
      setPrint(false)
    }
    return (
        <div className="App">
     {
       print?
       <h1> {data}</h1>
       :null
     }
    <h1>Choose a group name</h1>
    <input type="text" onChange={getData} />
    <button onClick={()=>setPrint(true)} >Create</button>
    </div>
        // <div>
        // <h1>Choose a group name</h1>
        // <input type = "text" onChange={getData} />
        
        // </div>
    );
}