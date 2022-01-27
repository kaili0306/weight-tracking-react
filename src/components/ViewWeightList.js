import React,{useState} from 'react';
import {Icon} from 'react-icons-kit';
import {trashO} from 'react-icons-kit/fa/trashO';
import {pencil} from 'react-icons-kit/fa/pencil'

export default function ViewWeightList({weightList,editWeight, deleteWeight}) {
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [updateWeight, setUpdateWeight] = useState(0);

  function updateisEdit(id,weight){
    setIsEdit(!isEdit);
    setUpdateId(id);
    setUpdateWeight(weight);
  }

  return weightList.map(item=>(
    <tr key={item.id}>
      <td>{item.date}</td>
      <td>
        {(isEdit && updateId === item.id) && <>
          <input className='updateWeight-input' type="number" onChange={(e)=>setUpdateWeight(e.target.value)} value={updateWeight}/>
        </>}
        { ( !isEdit|| updateId !== item.id) && <>{item.weight}</>}
      </td>
      <td>
      {(!isEdit|| updateId !== item.id) && 
        <div onClick={()=>updateisEdit(item.id,item.weight)}>
          <Icon icon={pencil}/>
        </div>}
        {(isEdit && updateId === item.id) && 
      <>
        <button className='updateWeight-btn' onClick={()=>{setIsEdit(!isEdit);editWeight(item.id,updateWeight)}}>Update</button>
      </>}
        
      </td>
      <td>{item.bmi}</td>
      <td style={{color:'#ff0000'}} onClick={()=>deleteWeight(item.id)}>
        <Icon icon={trashO}/>
      </td>
    </tr>
  ))
}
