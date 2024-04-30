import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../utils/checkAuth';
import PhoneRegistryABI from '../contracts/PhoneRegistry.json'; // Import the ABI of your smart contract
import Web3 from 'web3';
import Layout from '../layout';
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const initialValues = {
  username: '',
  password: ''
};

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [phoneRegistryContract, setPhoneRegistryContract] = useState(null);
  const [IMEI, setIMEI] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!phoneRegistryContract) {
      console.error('Smart contract not deployed to detected network.');
      return;
    }

    try {
      const result = await phoneRegistryContract.methods.login(initialValues.username, initialValues.password).call({ from: accounts[0] });
      // console.log(result)
      // localStorage.setItem('imei', result[0])
      // localStorage.setItem('state', result[1])
      // localStorage.setItem('uname', username)


      // if (result) {
      //   const username = 'your_username'; // Replace with actual username
      //   const password = 'your_password'; // Replace with actual password

      //   checkAuth.authenticate(username, password, (result) => {
      //     console.log('Login successful:', result);
      //     // navigate('/dashboard');
      //   });
      // }
      if (result) {

        checkAuth.authenticate(result[0], () => {
          // console.log('Login successful:', result);
          navigate('/dashboard');
        });
      }
      // console.log('Login successful:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <Layout>

      <Grid container justifyContent="center" alignItems="center" height="100vh">
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={3} p={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>


          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                // label="Outlined secondary" color="secondary" 
                type="username"
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {loginError && (
              <Grid item xs={12}>
                <Typography color="error" variant="body1">
                  {loginError}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} >
              <Button onClick={handleSubmit} sx={{
              margin:"5px"
            }} type="submit" variant="contained" color="primary" >
                Login
              </Button>
              <Button onClick={handleHome} type="submit" variant="contained" color="primary" >
                Return to HomePage
              </Button>
            </Grid>
          </Grid>
          {/* </Form>
          )}
        </Formik> */}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Login;
