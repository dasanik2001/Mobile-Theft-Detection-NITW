import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PhoneRegistryABI from '../contracts/PhoneRegistry.json'; 
import { ethers } from 'ethers';
import Layout from "../layout/index";
import {
  Box,
  InputAdornment,
  InputBase,
  Paper,
  Typography,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchedDevice from '../components/searchedDevice';
import DeviceCard from '../components/deviceCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [phoneRegistryContract, setPhoneRegistryContract] = useState(null);
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [deviceStates, setDeviceStates]= useState([])
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [lat,setLat] = useState([])
  const [long,setLong] = useState([])
  // useEffect(() => {
  //   async function connectToBlockchain() {
  //     console.log("start")
  //     if (window.ethereum) {
  //       const web3 = new Web3(window.ethereum);
  //       try {
  //         await window.ethereum.enable();
  //         setWeb3(web3);
  //         const accounts = await web3.eth.getAccounts();
  //         setAccounts(accounts);
  //         const networkId = await web3.eth.net.getId();
  //         const deployedNetwork = PhoneRegistryABI.networks[networkId];
  //         const contract = new web3.eth.Contract(
  //           PhoneRegistryABI.abi,
  //           deployedNetwork && deployedNetwork.address,
  //         );
  //         setPhoneRegistryContract(contract);
  //         // console.log(contract)
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } else {
  //       console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  //     }
  //   }
  //   connectToBlockchain();
  // }, []);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const newList = registeredDevices.filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(newList);

    setSearchList(newList);
    // console.log(searchList);
  };
  const handleLogin = () => {
    navigate('/login');
    console.log("Login clicked");
  };

  const handleRegister = () => {
    navigate('/register');
    console.log("Register clicked");
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


 useEffect(() => {
    async function fetchRegisteredDevices() {
      if (phoneRegistryContract) {
        try {
          const result = await phoneRegistryContract.methods.getAllRegisteredPhones().call({ from: accounts[0] });
          setRegisteredDevices(result[0]);
          setDeviceStates(result[1]);
          setLat(result[2])
          setLong(result[3])
          console.log('Registered Phones:', result);
        } catch (error) {
          console.error('Error:', error);
        }
       
      }
    }
    fetchRegisteredDevices();
  }, [phoneRegistryContract]);
  // console.log(registeredDevices)
  return (
    <Layout>  
      <Box>
      
     
         
        <Paper
          component="form"
          sx={{
            display: "flex",
            // flexDirection:"row",
            alignItems: "center",
            borderRadius: "default",
            padding: 1,
            backgroundColor: "#10141F",
            border: "none",
          }}
        >
          {/* <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: "white",
              border: "none",
            }}
            placeholder="Search for devices .."
            value={search}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon color="inherit" />
              </InputAdornment>
            }
          /> */}
        </Paper>
      </Box>
    
      <Box py={2} px={4}>
        {search === "" ? (
          <Box width="100%" >
            <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
            <Typography variant="h5" component="h1" my={6} fontWeight={400}>
                All Registered Devices 
              </Typography>

              <div sx={{
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                // margin: "2px"

                // padding: '2px'
              }}>
               <Button sx={{
                marginRight: "5px",
               }} variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            <Button variant="contained" color="primary" onClick={handleRegister}>Register</Button>
            </div>
            </Box>  


            <Box width="100%" sx={{display:'flex', flexDirection:'row', gap:"2rem"}}>
              
              {registeredDevices.map((device, index) => (
        <DeviceCard key={index} imei={device} state={deviceStates[index]} lat = {lat[index]} long = {long[index]} />
      ))}
            </Box>

            {/* <Box width="100%">
              <Typography variant="h5" component="h1" my={6} fontWeight={400}>
                Lost/Stolen Devices...
              </Typography>
            </Box> */}
          </Box>
        ) : (
            
          <Box width="100%" sx={{
            gap:2,
          }}>
            <Typography>Found Some Devices...</Typography>
            <Box width="100%"
            sx={{
                display:"flex",
                flexDirection:{
                    xs: "column",
                    lg:"row"
                }
    
            }}>
              
              {searchList.length > 0 &&
                searchList.map((device) => (
                  <SearchedDevice deviceSearch={device} />
                ))}
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default Home
