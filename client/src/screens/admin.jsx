import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Admin() {
  const [formValue, setFormValue] = useState({ carmake: '', model: '', enginetype: '', enginesize: '', seats: '', availability: '', stdprice: '', regnumber: '' })
  const [updateValue, setUpdateValue] = useState({ enginetype: '', enginesize: '', seats: '', availability: '', stdprice: '', regnumber: '' })
  const formData = new FormData();
  const [regnumber, setRegNumber] = useState({licenseplate: ''});
  const [validVehicle, setValidVehicle] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const requestOptions = {
    method: 'POST',
    body: formData
  }
  const requestUpdateOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(updateValue),
  }

  //Getting the values from the form
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  }
  const handleUpdateInput = (e) => {
    const { name, value } = e.target;
    setUpdateValue({ ...updateValue, [name]: value });
  }
  const handleRegNumber = (e) => {
    const { name, value } = e.target;
    setRegNumber({...regnumber, [name]: value});
    console.log(regnumber.licenseplate)
  }
  //Specific handling for files
  const handleImg = (e) => {
    console.log(e.target.files[0])
    formData.set('vehicleImage', e.target.files[0]);
  }
  //Sending post request to the server
  const handleSubmit = (e) => {
    e.preventDefault();
    //Setting Formdata in order to send it as Body
    formData.set('carmake', formValue.carmake);
    formData.set('model', formValue.model);
    formData.set('enginetype', formValue.enginetype);
    formData.set('enginesize', formValue.enginesize);
    formData.set('seats', formValue.seats);
    formData.set('availability', formValue.availability);
    formData.set('stdprice', formValue.stdprice);
    formData.set('regnumber', formValue.regnumber);

    fetch(`http://localhost:3001/vehicle/new`, requestOptions)
      .then(response => {
        if (response.status !== 201) {
          throw new Error('Vehicle Creation Failed');
        }
        return response.json();
      })
      .then(json => {
        console.log(json.message);
        alert('Vehicle Creation Successful')
        navigate(0);
      })
      .catch(error => {
        console.log(error.message);
        if (error == 'TypeError: Failed to fetch') {
          alert('Connection to server failed');
          setErrMsg(error.message);
        }
        else if (error.message == 'Wrong Credentials') {
          setErrMsg(error.message);
        }
      })
  }
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/vehicle/update/${updateValue.regnumber}`, requestUpdateOptions)
      .then(response => {
        if (response.status !== 201) {
          throw new Error('Vehicle Update Failed');
        }
        return response.json();
      })
      .then(json => {
        console.log(json.message);
        alert('Vehicle Updated Successfully');
        navigate(0);
      })
      .catch(error => {
        console.log(error.message)
        if (error == 'TypeError: Failed to fetch') {
          alert('Connection to server failed');
          setErrMsg(error.message)
        }
        else {
          setErrMsg(error.message)
        }
      })
  }
  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/vehicle/delete/${regnumber.licenseplate}`, {method: 'POST'})
      .then(response => {
        if (response.status !== 201) {
          throw new Error('Vehicle Deletion Failed');
        }
        return response.json();
      })
      .then(json => {
        console.log(json.message);
        alert('Vehicle Deleted Successfully');
        navigate(0);
      })
      .catch(error => {
        console.log(error.message)
        if (error == 'TypeError: Failed to fetch') {
          alert('Connection to server failed');
          setErrMsg(error.message)
        }
        else {
          setErrMsg(error.message)
        }
      })
  }
  const checkRegNum = (e) => {
    fetch(`http://localhost:3001/vehicleByReg/${regnumber.licenseplate}`)
      .then(response => {
        if(response.status !== 201){
          throw new Error('No Vehicle Found');
        }
        return response.json(); 
      })
      .then(json => {
        setValidVehicle(true)
      })
      .catch(error => {
        setErrMsg(error.message);
        setValidVehicle(false)
      });
  }


  return (
    <div className='container'>
      <h1 className='center'>Admin Page</h1>
      <p className='center'>Here you can add or remove vehicle listings</p>
      <div className='card-wrapper'>
        <div className='card'>
          <h2>Add Vehicle</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor='carmake'>Vehicle Manufacturer</label>
            <input type={'text'} name="carmake" placeholder='e.g. Audi' className='field' onChange={handleInput} required />
            <label htmlFor='model'>Vehicle Model</label>
            <input type={'text'} name="model" placeholder='e.g. A3 2020' className='field' onChange={handleInput} required />
            <label htmlFor='enginetype'>Engine Type</label>
            <select name='enginetype' className='field' onChange={handleInput} required>
              <option selected disabled>Select Engine Type</option>
              <option value={'Petrol'}>Petrol</option>
              <option value={'Diesel'}>Diesel</option>
              <option value={'Electric'}>Electric</option>
              <option value={'LPG'}>LPG</option>
            </select>
            <label htmlFor='enginesize'>Engine Size CC</label>
            <input type={'text'} name="enginesize" placeholder='e.g. 1500' className='field' onChange={handleInput} required />
            <label htmlFor='seats'>Seats</label>
            <input type={'text'} name="seats" placeholder='e.g. 4' className='field' onChange={handleInput} required />
            <label htmlFor='availability'>Availability</label>
            <select name='availability' className='field' onChange={handleInput} required>
              <option selected disabled>Select Availability</option>
              <option value={'available'}>Available</option>
              <option value={'reserved'}>Reserved</option>
              <option value={'unoperational'}>Unoperational</option>
            </select>
            <label htmlFor='stdprice'>Standard Price per Day</label>
            <input type={'text'} name="stdprice" placeholder='e.g. 15' className='field' onChange={handleInput} required />
            <label htmlFor='regnumber'>Registration Number</label>
            <input type={'text'} name="regnumber" placeholder='e.g. SJA 2913' className='field' onChange={handleInput} required />
            <label htmlFor='image'>Image PNG/JPG</label>
            <input name='vehicleImage' type="file" onChange={handleImg} required/>
            <input type="submit" className="btn" value={'Add'} />
          </form>
        </div>
        <div className='card'>
          <h2>Update Vehicle</h2>
          <form onSubmit={handleUpdateSubmit}>
            <label htmlFor='enginetype'>Engine Type</label>
            <select name='enginetype' className='field' onChange={handleUpdateInput} required>
              <option selected disabled>Select Engine Type</option>
              <option value={'Petrol'}>Petrol</option>
              <option value={'Diesel'}>Diesel</option>
              <option value={'Electric'}>Electric</option>
              <option value={'LPG'}>LPG</option>
            </select>
            <label htmlFor='enginesize'>Engine Size CC</label>
            <input type={'text'} name="enginesize" placeholder='e.g. 1500' className='field' onChange={handleUpdateInput} required />
            <label htmlFor='seats'>Seats</label>
            <input type={'text'} name="seats" placeholder='e.g. 4' className='field' onChange={handleUpdateInput} required />
            <label htmlFor='availability'>Availability</label>
            <select name='availability' className='field' onChange={handleUpdateInput} required>
              <option selected disabled>Select Availability</option>
              <option value={'available'}>Available</option>
              <option value={'reserved'}>Reserved</option>
              <option value={'unoperational'}>Unoperational</option>
            </select>
            <label htmlFor='stdprice'>Standard Price per Day</label>
            <input type={'text'} name="stdprice" placeholder='e.g. 15' className='field' onChange={handleUpdateInput} required />
            <label htmlFor='regnumber'>Registration Number</label>
            <input type={'text'} name="regnumber" placeholder='e.g. SJA 2913' className='field' onChange={handleUpdateInput} required />
            <input type="submit" className="btn" value={'Update'} />
          </form>
        </div>
        <div className='card'>
          <h2>Delete Vehicle</h2>
          <form onSubmit={handleDeleteSubmit}>
            <label htmlFor='licenseplate'>
              Vehicle Registration Number
              <FontAwesomeIcon icon={faCheck} className={validVehicle ? "valid" : "hidden"} />
              <FontAwesomeIcon icon={faTimes} className={validVehicle || formValue.reservedvehicle === '' ? "hidden" : "invalid"} />
            </label>
            <div style={{ display: 'flex' }}>
              <input type={'text'} name="licenseplate" placeholder='AKM 3943' className='field' onChange={handleRegNumber} required />
              <button type='button' onClick={checkRegNum} className="btn" style={{ maxWidth: '120px' }}>Check</button>
            </div>
            <input type="submit" className="btn" value={'Delete'} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;