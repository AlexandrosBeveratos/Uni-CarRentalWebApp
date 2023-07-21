import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router'





function Login() {
    const [user, setUserState] = useState(null);
    const [success, setSuccessSate] = useState(false);
    const sessionUser = sessionStorage.getItem('user');
    const navigate = useNavigate()
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

    const [formValue, setFormValue] = useState({ email: '', password: '' })

    //Makes error disappear after any change of the form
    useEffect(() => {
        setErrMsg('');
    }, [formValue])

    if (sessionUser !== null) {
        if(sessionUser !== undefined){
            if (sessionUser.email !== null) {
            return <Navigate to={'/dashboard'} replace />
            };
        }
        
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formValue),
    }
    //Getting the values from the form
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    }
    //Sending post request to the server
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3001/user/login`, requestOptions)
            .then(response =>{ 
                if(response.status === 201){
                    return response.json()
                }
                else if(response.status === 401){
                    throw new Error('Account not reviewed yet');
                }
                else if(response.status === 400){
                    throw new Error('Wrong Credentials');
                }
                
            })
            .then(json => {
                setUserState(json)
                setSuccessSate(true);
                sessionStorage.setItem('user', JSON.stringify(json));
                //Reloading page so NavBar is up-to-date
                navigate(0)
                navigate('/dashboard')
                console.log(sessionStorage.getItem('user'))
            })
            .catch(error => {
                console.log(error.message)
                if(error == 'TypeError: Failed to fetch'){
                    alert('Connection to server failed');
                    setErrMsg(error.message)
                }
                else if(error.message == 'Wrong Credentials'){
                    setErrMsg(error.message)
                }
                else if(error.message == 'Account not reviewed yet'){
                    setErrMsg(error.message)
                }            
            })       
    }


    return (
        <div className='container peugeotbg'>
            <div className='card-wrapper'>
                <div className='card'>
                    <h1 className="center">Log In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='email'>Email</label>
                        <input type={'email'} name="email" placeholder='johnsmith@example.com' className='field' onChange={handleInput} required />
                        <label htmlFor='password'>Password</label>
                        <input type={'password'} name="password" placeholder='****' className='field' onChange={handleInput} required />
                        <p ref={errRef} className={errMsg ? "error" : "hidden"} aria-live="assertive">{errMsg}</p>
                        <input type="submit" className="btn" value={'Login'} />
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login;