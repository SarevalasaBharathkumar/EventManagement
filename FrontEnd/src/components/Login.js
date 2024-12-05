import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function Login({ show, handleClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // State to manage the current step (1: sign-up, 2: OTP verification)
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!show) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUserType('');
      setErrorMessage('');
      setMobileNumber('');
      setName('');
      setOtp('');
      setStep(1);
    }
  }, [show]);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setUserType('');
    setErrorMessage('');
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/loginUser', {
        email,
        password,
      });
      alert('Login Successful');
      const { authToken, userData } = response.data;
      localStorage.setItem('authToken', authToken);
      const userArray = [userData.email, userData.name, userData.userType, userData.mobileNumber];
      localStorage.setItem('userData', JSON.stringify(userArray));
      handleClose();
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('Login Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/signup/createuser', {
        email,
        password,
        userType,
        mobileNumber,
        name
      });
      localStorage.setItem('signupEmail', email); // Store the email in local storage for OTP verification
      setStep(2); // Move to the OTP verification step
    } catch (error) {
      console.error('Sign Up Error:', error);
      setErrorMessage('Sign Up Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    const storedEmail = localStorage.getItem('signupEmail'); // Retrieve the email from local storage
    console.log(storedEmail);
    console.log(otp);
    try {
      await axios.post('http://localhost:5000/api/signup/verify', {
        email: storedEmail,
        otp
      });
      alert('Sign Up Successful');
      handleClose(); // Close modal on successful signup
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setErrorMessage('OTP Verification Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <Modal.Header closeButton>
        <Modal.Title>{isSignUp ? (step === 1 ? 'Sign Up' : 'Verify OTP') : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {isSignUp ? (
          step === 1 ? (
            <Form onSubmit={handleSubmitSignUp}>
              <Form.Group className="mb-3" controlId="signUpName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signUpEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signUpPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signUpConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signUpMobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your mobile number"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="userType">
                <Form.Label>Select User Type</Form.Label>
                <Form.Control
                  as="select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="event-manager">Event Manager</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Sign Up
              </Button>
              <Button variant="link" onClick={handleToggle}>
                Already have an account? Login
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSubmitOtp}>
              <Form.Group className="mb-3" controlId="otp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Verify OTP
              </Button>
            </Form>
          )
        ) : (
          <Form onSubmit={handleSubmitLogin}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
            <Button variant="link" onClick={handleToggle}>
              New user? Register
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default Login;