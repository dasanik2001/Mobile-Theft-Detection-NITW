// import React from 'react'

// function Register() {
//   return (
//     <div>
//       Register
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PhoneRegistryABI from '../contracts/PhoneRegistry.json'; // Import the ABI of your smart contract
import Web3 from 'web3';
import Layout from '../layout';
import { useNavigate } from 'react-router-dom';



const Register = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [phoneRegistryContract, setPhoneRegistryContract] = useState(null);
  const [IMEI, setIMEI] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();

  // const [submit, setSubmit] = useState()
  useEffect(() => {
    async function connectToBlockchain() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = PhoneRegistryABI.networks[networkId];
          const contract = new web3.eth.Contract(
            PhoneRegistryABI.abi,
            deployedNetwork && deployedNetwork.address,
          );
          setPhoneRegistryContract(contract);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }
    connectToBlockchain();
  }, []);


  const handleHome = async (event) => {
    event.preventDefault();
    navigate('/')
  }
  // const handleSubmit = (values) => {

  //   console.log(values);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      IMEI,
      username,
      password,
      confirmPassword
    };
    console.log(formData)
    if (!phoneRegistryContract) {
      console.error('Smart contract not deployed to detected network.');
      return;
    }

    try {
      const result = await phoneRegistryContract.methods.registerPhone(IMEI, username, password).send({ from: accounts[0] });
      console.log('Transaction successful:', result);
      navigate('/')
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Layout>
      <Grid container justifyContent="center" alignItems="center" height="100vh">
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={3} p={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>

          {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="imei"
                    label="IMEI"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setIMEI(e.target.value)}
                   
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setUsername(e.target.value)}
                   
                  />
                </Grid>
                
              
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="password"
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                   
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setConfirmPassword(e.target.value)}
                   
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={()=> handleSubmit} variant="contained" color="primary" fullWidth>
                    Register
                  </Button>
                </Grid>
              </Grid> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="IMEI"
                variant="outlined"
                fullWidth
                value={IMEI}
                onChange={(e) => setIMEI(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleSubmit} sx={{
              margin:"5px"
            }} variant="contained" color="primary" >
                Register
              </Button>
              <Button onClick={handleHome} type="submit" variant="contained" color="primary" >
                Return to HomePage
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Register;
