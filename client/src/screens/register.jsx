import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Register() {
    const [countries, setCountries] = useState(null);
    const [isCountry, setIsCountry] = useState(false);
    const [cities, setCities] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formValue, setFormValue] = useState({ firstname:'', lastname:'', country: '', city:'', address: '', email: '', username: '', password: '' })
    const [user, setUserState] = useState(null);
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));

    const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/; //USERNAME VALIDATION
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; //PASSWORD VALIDATION
    const userRef = useRef();
    const errRef = useRef();

    const [validusername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    //For POST request
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formValue),
    }

    //Handling the value of fields on change
    const handleInput = (e) => {
        //Making variables with the value and name of the changed field
        const { name, value } = e.target;
        //Checking if field country is changed so that we can SET the Cities of the same country
        if(name === 'country'){
            var parsedValue = JSON.parse(value);
            setFormValue({ ...formValue, [name]: parsedValue.country });
            setCities(parsedValue.cities)
            setIsCountry(true);
        }
        else{
            setFormValue({ ...formValue, [name]: value });
        }
    }  

    //On render we call the country fetch from the api
    useEffect(() => {
        async function fetchCountries() {
            const res = await fetch('https://countriesnow.space/api/v0.1/countries');
            const { data: countriesList } = await res.json();
            setCountries(countriesList);
            setLoading(false);
        }
            fetchCountries()
                .catch(console.error);

    }, []);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(formValue.username));
    }, [formValue.username])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(formValue.password));
    }, [formValue.password])

    //Makes error disappear after any change of the form
    useEffect(() => {
        setErrMsg('');
    }, [formValue])

    //Send user to dashboard if he is logged in
    if(sessionUser !== null) return <Navigate to={'/dashboard'} replace />;

    //Sending post request to the server
    const  handleSubmit = (e) => {
        e.preventDefault();
        //Checking if password and username are written correctly
        const v1 = USERNAME_REGEX.test(formValue.username);
        const v2 = PWD_REGEX.test(formValue.password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        fetch(`http://localhost:3001/user/new`, requestOptions)
            .then(response => {
                if(response.status !== 201) throw new Error('Username or Email already exists');
                return response.json();
            } )
            .then(json => {
                console.log(json)
                setUserState(json)
                navigate('/login')  
            })
            .catch(error => {
                console.log(error)
                if(error == 'TypeError: Failed to fetch'){
                    alert('Connection to server failed');
                    setErrMsg("Connection to server failed")
                } 
                else if(error.message == 'Failed to Create Account'){
                    alert(error);
                    setErrMsg(error.message);
                }
                else setErrMsg(error.message)           
            })       
    }

    return(
        <div className='container peugeotbg'>
            <div className='card-wrapper'>
                <div className='card'>
                    <h1 className="center">Create an Account</h1>
                    <h3 className='center'>An admin will approve your request shortly after</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='firstname'>First Name</label>
                        <input type={'text'} name="firstname" placeholder='e.g. John' className='field' onChange={handleInput} required/>
                        <label htmlFor='lastname'>Last Name</label>
                        <input type={'text'} name="lastname" placeholder='e.g. Smith' className='field' onChange={handleInput} required/>

                        <label htmlFor='country'>Country</label>
                        <select name='country' className='field' onChange={handleInput} required>
                            <option selected disabled value={''}>Select Country</option>
                            {loading ? (<div className='loading'>
                            <p>Loading countries...</p>
                            <div className="loader"></div>
                        </div>) : (
                            countries.map((country) => (
                                <option value={JSON.stringify(country)}>{country.country}</option>
                            ))
                        )}
                        </select>
                        <label htmlFor='city'>City</label>
                        <select name='city' className='field' onChange={handleInput} required>
                            <option selected disabled >Select City</option>
                            {isCountry ? (cities.map((city) => (
                                <option value={city}>{city}</option>
                            ))): (<option disabled value={''}>Please Select Country</option>)}
                        </select>
                        
                        <label htmlFor='address'>Address</label>
                        <input type={'text'} name="address" placeholder='12 Victoria St.' className='field' onChange={handleInput} required/>

                        <label htmlFor='username'>
                            Username 
                            <FontAwesomeIcon icon={faCheck} className={validusername ? "valid" : "hidden"} />
                            <FontAwesomeIcon icon={faTimes} className={validusername || formValue.username === '' ? "hidden" : "invalid"} /></label>
                        <input type={'text'} name="username" placeholder='johnsmith' className={validusername || formValue.username === '' ? "field" : "field invalid-field"} aria-invalid={validusername ? "false" : "true"} aria-describedby="uidnote"
                         onChange={handleInput} onFocus={() => setUsernameFocus(true) } onBlur={() => setUsernameFocus(false)} autoComplete="off" required/>
                         <p id="uidnote" className={usernameFocus && formValue.username && !validusername ? "instructions" : "hidden"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor='email'>Email</label>
                        <input type={'email'} name="email" placeholder='johnsmith@example.com' className='field' onChange={handleInput} required />

                        <label htmlFor='password'>
                            Password
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hidden"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || formValue.password === '' ? "hidden" : "invalid"} />
                        </label>
                        <input type={'password'} name="password" placeholder='****' className={validPwd || formValue.password === '' ? "field" : "field invalid-field"} 
                        onChange={handleInput} onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} required />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "hidden"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <p ref={errRef} className={errMsg ? "error" : "hidden"} aria-live="assertive">{errMsg}</p>
                        <button type='submit' className="btn">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register;