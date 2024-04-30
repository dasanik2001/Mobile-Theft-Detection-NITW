import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuth from "../utils/checkAuth";
import { TextField, Button, Grid, Typography, Switch, Box } from "@mui/material";
import Web3 from "web3";
import PhoneRegistryABI from "../contracts/PhoneRegistry.json";
import Layout from "../layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const uname = localStorage.getItem("jwt_token");
  const imei = localStorage.getItem("imei");
  const lost = localStorage.getItem("state");
  // console.log(localStorage.getItem('state'))
  const [toggleState, setToggleState] = useState(JSON.parse(lost));
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [phoneRegistryContract, setPhoneRegistryContract] = useState(null);
  const handleLoc = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const latitudeString = latitude.toString();
        const longitudeString = longitude.toString();
        const imei = localStorage.getItem('jwt_token');
        console.log("Latitude: " + latitudeString + " Longitude: " + longitudeString + "IMEI" + imei);

        const r = await phoneRegistryContract.methods.updateLocation(imei, latitudeString, longitudeString).send({ from: accounts[0] });



      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  const handleToggle = async () => {
    if (phoneRegistryContract) {
      try {
        if (toggleState === false) {
          console.log("hiii");
          const e = await phoneRegistryContract.methods
            .reportLost(JSON.parse(imei))
            .send({ from: accounts[0] });
          setToggleState((prevState) => !prevState);
          localStorage.setItem("state", toggleState);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    console.log("changed");
  };
  const handleLogout = () => {
    checkAuth.signout();
    navigate("/login");
  };

  
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
            deployedNetwork && deployedNetwork.address
          );
          setPhoneRegistryContract(contract);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }

    connectToBlockchain();
  }, []);

  useEffect(() => {
    const isAuthenticated = checkAuth.checkTokenValidity();
    console.log("Checking");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const isAuthenticated = checkAuth.checkTokenValidity();
  if (isAuthenticated) {
    return (
      <Layout>
        {" "}
        <h1>Welcome Back!! </h1>
        <h1>{uname}</h1>
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "space-between",
        }}>

          <Box
          sx={{
            display:'flex',
            flexDirection:'row',
            marginRight:"5px"
          }}
          >
         <Typography>Toggle Device Status</Typography> 
         <Switch
          checked={toggleState}
          sx={{
           marginRight:"5px"}}
          onChange={handleToggle}
          inputProps={{ "aria-label": "toggle" }}
        />
          </Box>
       
       <Box sx={{
        display:'flex',
        flexDirection:'row',
        // justifyContent:'space-between',
       }}>
        <Button variant="contained"  sx={{
           marginRight:"5px"}} color="primary" onClick={handleLoc}>
          Update Device Location
        </Button>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
        </Box>
        </Box>
      </Layout>
    );
  }
  return null;
};

export default Dashboard;
