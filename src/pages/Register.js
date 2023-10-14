import { useEffect, useState } from "react";
import Web3 from "web3";
import { nanoid } from "nanoid";
import { create } from "ipfs-http-client";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Input, Paper, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MyContractAddress } from "../MyContractABI";

const steps = ['Basic Details', 'Proof Document', 'Finish'];

const Register = () => {
    const [web3, setWeb3] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    // const [contract, setContract] = useState(null);
    const [result, setResult] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ipfsHash, setIpfsHash] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate()
  
    useEffect(() => {
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        window.ethereum.enable()
          .then(function (accounts) {
            setUserAddress(accounts[0]);
            setWeb3(web3Instance);
            // setContract(new web3Instance.eth.Contract(contractABI, contractAddress));
          })
          .catch(function (error) {
            console.error('Error enabling Ethereum:', error);
          });
      } else {
        console.error('MetaMask or a similar Web3 provider is not installed');
      }
    }, []);

    const setUser = () => {
      setUsername(document.getElementById('username').value)
      console.log(username)
      
    }

    const setPass = () =>{
      setPassword(document.getElementById('password').value)
      console.log(password)
    }

    const ipfsClient = create({
        host: 'localhost', // IPFS node host (use your own or a service like Infura)
        port: 5001,             // IPFS API port
        protocol: 'http',      // Use 'https' for Infura
      });
  

      const handleSubmit = async (event) => {
        event.preventDefault();
      
        const docId = nanoid(); // Generate a unique docId
        // const username = document.getElementById("username").value;
        // const password = document.getElementById("password").value;
      
        console.log(docId, username, ipfsHash, password);
      
        try {
          // Check if MetaMask is installed and enabled
          if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
      
            // Request access to the user's accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const userAddress = web3.currentProvider.selectedAddress;
      
            const contractAddress = MyContractAddress;
      
            const contractABI = [
              {
                "inputs": [
                  {
                    "internalType": "string",
                    "name": "docId",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "username",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "_documenthash",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "password",
                    "type": "string"
                  }
                ],
                "name": "EnrollDoctor",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              }
            ];
      
            const contract = new web3.eth.Contract(contractABI, contractAddress);
      
            const encodedData = contract.methods.EnrollDoctor(docId, username, ipfsHash, password).encodeABI();
      
            // const gasPrice = await web3.eth.getGasPrice();
            // const gasEstimate = await contract.methods.EnrollDoctor(docId, username, ipfsHash, password)
      
            const tx = {
              to: contractAddress,
              from: userAddress,
              data: encodedData,
              // gas: gasEstimate,
              // gasPrice: gasPrice,
            };
      
            const receipt = await web3.eth.sendTransaction(tx);
      
            console.log('Transaction receipt:', receipt);
            navigate('/')
          } else {
            console.error('MetaMask is not installed or not enabled');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    async function addToIPFS() {
        try {
          const file = document.getElementById('document').files[0]
          
          const reader = new FileReader();
          
          reader.onload = async () => {
            const blob = new Blob([reader.result], { type: file.type });
      
            const result = await ipfsClient.add(blob);
            const ipfsHash = result.path;
            setIpfsHash(ipfsHash)
      
            console.log('File added to IPFS with hash:', ipfsHash);
          };
      
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error('Error adding file to IPFS:', error);
        }
      }
    
      const isStepSkipped = (step) => {
        return skipped.has(step);
      };
    
      const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
    
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
      const handleReset = () => {
        setActiveStep(0);
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setSelectedImage(imageUrl);
        }
      };

    return (
        <>
        <div style={{padding: 100+'px', paddingLeft: 100, paddingRight: 100}}>
          <Paper elevation={5} style={{padding: 50}}>
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length - 1 && (
                <>
                  <div style={/* {padding: 100, marginLeft: 39+'%'} */{}} className="stepper">
                    <Button onClick={handleSubmit}>Submit</Button>
                  </div>
                  {/* <Box>
                    <Button sx={{mr: 5}} onClick={handleSubmit}>Submit</Button>
                  </Box> */}
                  
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </>
              )} 
              {activeStep === 0 && (
                <>
                  <div className="stepperZero" style={{ textAlign: 'center' }}>
                    <Typography variant="h6">
                      Please Enter your Username and password
                    </Typography>
                  </div>
                  <div style={{ paddingTop: 5, textAlign: 'center' }}>
                    <div>
                      <TextField
                        required
                        id="username"
                        label="Username"
                        defaultValue={username}
                        onChange={setUser}
                      />
                    </div>
                    <div style={{ paddingTop: 20, textAlign: 'center' }}>
                      <TextField
                        required
                        id="password"
                        label="Password"
                        type="password"
                        defaultValue={password}
                        onChange={setPass}
                      />
                    </div>
                  </div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div >
                    <div className="stepperOne">
                      <Input id="document" type="file" accept="image/*,.pdf" onChange={handleFileChange} />
                    </div>
                    <div className="stepperOneSub">
                      <Button onClick={addToIPFS} variant="contained">
                        Upload
                      </Button>
                    </div>
                    <div className="stepperOneSub" style={{paddingTop: 50}}>
                      {selectedImage && (
                        <div>
                          <img src={selectedImage} alt="Selected" width="500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </div>
      </>
    )
}

export default Register