import React, { useState, useEffect, useRef } from 'react';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router';

function Reservations() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [formValue, setFormValue] = useState({ customer: user.username, email: user.email, phonenum: '', reservedvehicle: '', fromdate: '', todate: '', price: '0', status: 'requested' });
  const [vehicle, setVehicle] = useState(null);
  const [validVehicle, setValidVehicle] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const errRef = useRef();
  const navigate = useNavigate();
  

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(formValue),
  }
  //Getting correct today date format for Date input
  let today; 
  var date = new Date()
  if(date.getMonth()+1 < 10) {
    today = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate();
  }
  else{
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  //Getting the values from the form
  const handleInput = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormValue({ ...formValue, [name]: value });
    console.log(formValue)
    if(name === 'todate'){
      if(vehicle !== null && formValue.fromdate !== ''){
        let datefrom = new Date(formValue.fromdate);
        let dateto = new Date(value);
        let difference = dateto.getTime() - datefrom.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24)+1);
        setFormValue({...formValue, price: String(totalDays*vehicle.stdprice), [name]: value});
      }
    }
  }

  const checkRegNum = (e) => {
    fetch(`http://localhost:3001/vehicleByReg/${formValue.reservedvehicle}`)
      .then(response => {
        if(response.status !== 201){
          throw new Error('No Vehicle Found');
        }
        return response.json(); 
      })
      .then(json => {
        setVehicle(json);
        setValidVehicle(true)
      })
      .catch(error => {
        setErrMsg(error.message);
        setValidVehicle(false)
      });
  }

  //Sending post request to the server
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/reservation/new`, requestOptions)
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
        else if(response.status === 422){
          throw new Error('Invalid Vehicle')
        }
        else if(response.status === 424){
          throw new Error('Cannot reserve same vehicle at the same date')
        }
        else{
          throw new Error('Internal Error')
        }
      })
      .then(json => {
        console.log(json)
        alert('Succesful Reservation Request');
        navigate('/fleet')
      })
      .catch(error => {
        console.log(error)
        if (error == 'TypeError: Failed to fetch') {
          alert('Connection to server failed');
          setErrMsg("Connection to server failed")
        }
        else if (error.message == 'Failed to Create Account') {
          alert(error);
          setErrMsg(error.message);
        }
        else setErrMsg(error.message)
      })
    }

    //Makes error disappear after any change of the form
    useEffect(() => {
      setErrMsg('');
    }, [formValue])

    return (
        <div className='container peugeotbg'>
          <h1 className='center' style={{color: 'white'}}>Reservations</h1>
          <div className='card-wrapper'>
            <div className='card'>
              <h1 className="center">Make a reservation</h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor='reservedvehicle'>
                  Vehicle Registration Number
                  <FontAwesomeIcon icon={faCheck} className={validVehicle ? "valid" : "hidden"} />
                  <FontAwesomeIcon icon={faTimes} className={validVehicle || formValue.reservedvehicle === '' ? "hidden" : "invalid"} />
                </label>
                <div style={{display: 'flex'}}>
                  <input type={'text'} name="reservedvehicle" placeholder='AKM 3943' className='field' onChange={handleInput} required />
                  <button type='button' onClick={checkRegNum} className="btn" style={{maxWidth: '120px'}}>Check</button>
                </div>
                <label htmlFor='fromdate'>Choose Date From</label>
                <input type={'date'} min={today} max={formValue.todate !== '' ? formValue.todate : null} name="fromdate" className='field' onChange={handleInput} required />
                <label htmlFor='todate'>Choose Date To</label>
                <input type={'date'} min={formValue.fromdate !== '' ? formValue.fromdate : today} name="todate" className='field' onChange={handleInput} required />
                <label htmlFor='phonenum'>Phone Number</label>
                <input type={'text'} name="phonenum" placeholder='693293593' className='field' onChange={handleInput} required />
                <p ref={errRef} className={errMsg ? "error" : "hidden"} aria-live="assertive">{errMsg}</p>
                <div style={{display: 'flex'}}>
                  <div style={{marginRight: '5px', fontWeight: 'bold'}}>Minimum price: {formValue.price}€</div>
                  <input type="submit" className="btn" value={'Reserve'} />
                </div>
                <p>Make a reservation request and we will contact you about the result of your request</p>
              </form>
            </div>

          </div>
        </div>
    );
  }

  export default Reservations;