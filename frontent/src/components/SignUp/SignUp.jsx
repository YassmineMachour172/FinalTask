import React, { useRef,useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { signUpSchema } from 'Validations/FormsValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import md5 from 'md5';
import ReCAPTCHA from 'react-google-recaptcha';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import '../../css/sb-admin-2.css';

import Popup from 'reactjs-popup';
import { Modal, Button } from "react-bootstrap";

/* SignUp Component */
const SignUp = () => {

    const navigate = useNavigate(); /* define hook to navigate to other pages */
    const [showModal, setShow] = useState(false);/*define state for the modal box */
    const [msgModal, setMsgModal] = useState('');/*define state for the message modal box */
    const [reCAPTCHAValue, setReCAPTCHAValue] = useState(0);
    const captchaRef = useRef(null); /* define ref for the reCAPTCHA */
    const [status, setStatus] = useState("");

    /* function that close the modal and reset the message modal*/
    const handleClose = () =>{
        setShow(false);
        setMsgModal('');
   }
   /* function that open the modal and displays it*/
   const handleShow = () =>{
       setShow(true);
   }

    /* function that navigates to the home page */
    const handleClickHome = () => {
        navigate('/');
    };


    /* function that navigates to the log in page */
    const handleClickLogIn = () => {
        navigate('/logIn');
    };
    
    const onChangeRecap=(value)=> {
        setReCAPTCHAValue(value);
    }

    /* define useForm for the signUp form */
    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(signUpSchema), /* validate the form with the schema */
        mode: "onChange" /* validate the form on change */
    });

    /* function that submit the form and send the data to the server*/
    const submitForm = async (data, e) => {
        e.preventDefault();

        // if(reCAPTCHAValue===0){
        //     setStatus("ReCAPTCHA verification failed");
        //     setMsgModal('ReCAPTCHA verification failed')
        //    handleShow()

        //     return;
        // }
        /* get the token from the reCAPTCHA */
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();

        /* define the recaptch request message */
        const reCAPTCHMsg = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    title:     'reCAPTCHA',
                    token:     token
                })
        };
        
        console.log("requesting");

        const reCaptchaResponse = await fetch('https://final-task-server.vercel.app/reCaptchaValidation', reCAPTCHMsg) /* send the token to the server to validate it */
        console.log(reCaptchaResponse);
        if (!reCaptchaResponse.ok) { /* if the recaptcha is not valid, alert the user */
            setMsgModal('ReCAPTCHA verification failed');/* if the response is not ok, alert the user */
            handleShow();
            return;
        }

        /* define the signUp request message */
        const requestMsg = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    title:     'SignUp',
                    email:     data.email,
                    firstName: data.firstName,
                    lastName:  data.lastName,
                    password:  md5(data.password)
                })
        };

        console.log("requesting");

        const response = await fetch('https://final-task-server.vercel.app/signUp', requestMsg) /* send the data to the server to register the user */
        console.log(response);
        if (!response.ok) {
            setMsgModal('Invalid Registration Details');/* if the response is not ok, alert the user */
            handleShow();
            return;
        }
        const responseData = await response.json(); /* get the response data */
        console.log(responseData);
        /* alert the user that the registration was successful */
        setMsgModal('Registered! Please login.');
        handleShow();
        handleClickHome(); /* navigate to the home page */
    };
    
    return (
        <div className="container">

            <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
                        <div className="col-lg-7">
                            <div className="p-3">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                                </div>
                                <form className="user" onSubmit={handleSubmit(submitForm)}>
                                    <div className="form-group row">
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" name="firstName"
                                                placeholder="First Name" {...register('firstName')}/>
                                            {errors.firstName ? <p className='error-msg'>{errors.firstName?.message}</p> : <br/>} {/* display error message if the first name is not valid */}
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control form-control-user" name="lastName"
                                                placeholder="Last Name" {...register('lastName')}/>
                                            {errors.lastName ? <p className='error-msg'>{errors.lastName?.message}</p> : <p className='space'>{'.'}</p>} {/* display error message if the last name is not valid */}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user" name="email"
                                            placeholder="Email Address" {...register('email')}/>
                                        {errors.email ? <p className='error-msg'>{errors.email?.message}</p> : <br/>} {/* display error message if the email is not valid */}
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user"
                                                name="password" placeholder="Password" {...register('password')}/>
                                            {errors.password ? <p className='error-msg'>{errors.password?.message}</p> : <br/>} {/* display error message if the password is not valid */}
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control form-control-user"
                                                name="repeatPassword" placeholder="Repeat Password" {...register('repeatPassword')}/>
                                            {errors.repeatPassword ? <p className='error-msg'>{errors.repeatPassword?.message}</p> : <p className='space2'>{'.'}</p>} {/* display error message if the repeat password is not valid */}
                                        </div>
                                    </div>
                                    <center className='margin-bottom-ReCAPTCHA'><ReCAPTCHA /* display the reCAPTCHA */
                                        sitekey="6LcJBykkAAAAAOxj6YIRBE3aSGS3GCj3gszHMEGN"
                                        /*onChange={onChangeRecap}*/
                                        ref={captchaRef}/>
                                    </center>
                                    <input type="submit" className="btn btn-primary btn-user btn-block" value={'Register Account'}></input> 
                                </form>
                                <hr/>
                                <div className="text-center">
                                    <a className="small cursor-pointer" onClick={handleClickLogIn}>Already have an account? Login!</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='msg-modal-title'>ALERT!</Modal.Title>
                </Modal.Header>
                <Modal.Body><p className='msg-modal'>{msgModal}</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SignUp;