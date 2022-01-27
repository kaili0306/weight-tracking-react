import React, {useState,useEffect, useRef} from 'react';
import ViewWeightList from './ViewWeightList';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const HEIGHT_LOCAL = 'height_local';
const WEIGHT_LOCAL = 'weight_local';

//retrieve items from local storage
function loadHeightLocal(){
    const height = localStorage.getItem(HEIGHT_LOCAL);
    return JSON.parse(height);
}
function loadWeightsLocal(){
    const weightVals = localStorage.getItem(WEIGHT_LOCAL);
    return JSON.parse(weightVals);
}
export default function HomeComponent() {
    const heightRef = useRef();
    const [height,setHeight] = useState(loadHeightLocal);
    const weightRef = useRef();
    const [weights, setWeight] = useState(loadWeightsLocal);

    useEffect(()=>{
        //set items to local storage
        localStorage.setItem(HEIGHT_LOCAL,JSON.stringify(height));
        localStorage.setItem(WEIGHT_LOCAL,JSON.stringify(weights));
    },[height,weights]);

    //handle to submit height
    function submitHeight(){
        const heightVal = heightRef.current.value;
        if(heightVal <= 0 || heightVal >250) return;
        heightRef.current.value = null;
        setHeight(heightVal);
    }

    //handle to reset height, will reset all the weights as well
    function resetHeight(){
        setHeight(null);
        setWeight([]);
    }

    //handle to submit weight
    function submitWeight(){
        const weightVal = weightRef.current.value;
        if(weightVal < 1 || weightVal === '' || isNaN(weightVal)) return;
        setWeight(prevWeights=>{
            return [...prevWeights,{
                id:uuidv4(),
                weight: weightVal,
                bmi: calculateBMI(weightVal,height),
                date: moment().format('YYYY-MM-DD HH:mm'),
            }];
        });
        weightRef.current.value = null;
    }

    //handle to calculate BMI = weight / (height(m)*height(m))
    function calculateBMI(w,h){
        const heightSquared = Math.pow(h/100,2);
        return (w / heightSquared).toFixed(2);
    }

    //handle edit weight 
    function editWeight(id,updatedWeight){
        const updateWeight = weights.map(item=>(item.id === id ? {
            id,
            weight: updatedWeight,
            bmi: calculateBMI(updatedWeight,height),
            date: moment().format('YYYY-MM-DD HH:mm')
        }:item));
        setWeight(updateWeight);
    }

    //handle delete weight
    function deleteWeight(id){
        const filtered = weights.filter(item=>item.id !== id);
        setWeight(filtered);
    }
    function weightComment(){
        const currentBMI = weights[weights.length-1].bmi;
        if(currentBMI <18.5) return 'You are underweight, eat more';
        if(currentBMI >=18.5 && currentBMI <25) return 'You are in standard weight, keep it up';
        if(currentBMI >=25 && currentBMI <30) return 'You are slightly overweight, be aware';
        if(currentBMI >=30) return 'You are obese, keep an eye';
    }

  return (
    <>
        <div className='content'>
            {(!height) && <div className='height-input'> 
                <input ref={heightRef} type="number" placeholder="Enter your height (cm)" />
                <button onClick={submitHeight}> Submit </button> 
            </div>}
            {(height) && <div>
                <div className='height-content'>
                    <div>You are {height || 0} cm</div>
                    <button onClick={resetHeight}>Reset Height</button>
                </div>
                <div className='weight-input'>
                    <input ref={weightRef} type="number" placeholder="Enter current weight(kg)"/>
                    <button style={{marginLeft:'0'}} onClick={submitWeight}>Enter Weight</button>
                    <button style={{backgroundColor:'#FDCEB9',border: '2px solid #FDCEB9', borderRadius:'5px'}} onClick={()=>setWeight([])}>Clear List</button>
                </div>
                {/* {weights.length < 1 && <div>No Weight found!</div>} */}
                {weights.length > 0 &&
                <div className='weight-content'>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th  colSpan={2}>Weight(kg)</th>
                                <th>BMI</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ViewWeightList weightList={weights} editWeight={editWeight} deleteWeight={deleteWeight}/>
                        </tbody>
                    </table>
                    <div className='weight-content-comment'>Your current weight is {weights[weights.length-1].weight} kg: {weightComment()}</div>
                </div>
                }
            </div>}
        </div>
    </>
  );
}
