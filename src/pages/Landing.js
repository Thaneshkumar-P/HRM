import { useEffect, useState } from 'react'
import faceIO from '@faceio/fiojs'
import '../styles.sass'
import { Modal } from 'bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Grid, Paper } from '@mui/material'
import LandingImg from '../assets/images/Landing_Background.jpg'
import { Button, Box, TextField, Divider, Collapse } from '@mui/material'
import Typography from '@mui/material/Typography';
import Web3 from "web3";
import { MyContractAddress } from '../MyContractABI'
import LandingCard from '../components/Card'

const faceio = new faceIO('fioa7c23');

const Landing = () => {

  const [dShow, setDShow] = useState(true);
  const [pShow, setPShow] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate()
  useEffect(() => {
    function alert(){
      const status = localStorage.getItem("Admin");
      if(status === "false"){
        const MyModal = new Modal(document.getElementById("alertModal"))
        MyModal.show()
        localStorage.clear()
      }
    }
    alert()

    setChecked(true)
  })

  const handleDocClick = () => {
      if(!dShow){
        setPShow(false);
        setDShow(true);
      }
  }

  const handlePatClick = () => {
    if(!pShow){
      setDShow(false);
      setPShow(true);
    }
  }

  const handleSubmit = () => {

  }

  async function handlePatientReg() {
      faceio.enroll({
        "locale": "auto"
        }).then(userInfo => {
           console.log(userInfo);
           handlePL(userInfo)
        }).catch(errCode => {
          //  handleError(errCode);
        })
      }

  const handlePL = async (data) => {
    try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const userAddress = web3.currentProvider.selectedAddress;

      const contractAddress = MyContractAddress;

      const contractABI = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "patientID",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "EnrollPatient",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const encodedData = contract.methods.EnrollPatient(data.facialId, 'PlaceHolder').encodeABI();
  
      const tx = {
        to: contractAddress,
        from: userAddress,
        data: encodedData,
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
  }

  const handleAuth = () => {
      faceio.authenticate({
          "locale": "auto"
      }).then(userData => {
          localStorage.setItem("Patient_id", userData.facialId)
          console.log("Success, user identified")
          console.log("Linked facial Id: " + userData.facialId)
          handlePA(userData)
      })
  }

  const handlePA = async (data) => {
    try {
      
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
  
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const userAddress = web3.currentProvider.selectedAddress;
  
        const contractAddress = MyContractAddress;
  
        const contractABI = [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "patientID",
                "type": "string"
              }
            ],
            "name": "patientLogin",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
        ];
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const encodedData = contract.methods.patientLogin(data.facialId).encodeABI();
      
        const result = await web3.eth.call({
          to: contractAddress,
          from: userAddress,
          data: encodedData,
        }, 'latest');

        const decodedResult = web3.eth.abi.decodeParameter('bool', result);
        console.log('Decoded result:', decodedResult);
        if(decodedResult) 
          navigate('/Patient')
      } else {
        console.error('MetaMask is not installed or not enabled');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleF = () => {

  }

  const handleLogin = async () => {
    try {
      
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
  
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const userAddress = web3.currentProvider.selectedAddress;
  
        const contractAddress = MyContractAddress;
  
        const contractABI = [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "username",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "password",
                "type": "string"
              }
            ],
            "name": "DoctorLogin",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const encodedData = contract.methods.DoctorLogin(name, password).encodeABI();
      
        const result = await web3.eth.call({
          to: contractAddress,
          from: userAddress,
          data: encodedData,
        }, 'latest');

        const decodedResult = web3.eth.abi.decodeParameter('bool', result);
        console.log('Decoded result:', decodedResult);
        if(decodedResult) 
          navigate('/Doctor')
      } else {
        console.error('MetaMask is not installed or not enabled');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${LandingImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh', 
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // WebkitMask: 'linear-gradient(90deg, #000000, transparent)',
          }}
        >
          <Container sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}>
            <Collapse in={checked}>
              <Paper elevation={24} sx={{
                height: '65vh', 
                width: '30vw',
                padding: '10px',
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}>
                  <Button onClick={handleDocClick}>Doctor</Button>
                  <Button onClick={handlePatClick}>Patient</Button>
                </Box>
                {dShow && 
                    <Box sx={{
                      paddingTop: '20px'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }} >
                        <Typography variant="h6">
                          Doctor Login
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '10px'
                        }} >
                          <TextField
                            required
                            id="username"
                            label="Username"
                            onChange={() => setName(document.getElementById('username').value)}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '10px'
                        }} >
                          <TextField
                            required
                            id="password"
                            label="Password"
                            type='password'
                            onChange={() => setPassword(document.getElementById('password').value)}
                          />
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          padding: '10px',
                          paddingTop: '20px'
                        }}>
                          <Button onClick={handleF}>Forgot Password?</Button>
                          <Button onClick={handleLogin} variant='outlined' sx={{ marginLeft: 'auto' }}>Login</Button>
                        </Box>
                        <Divider>
                          or
                        </Divider>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }} >
                          <Link to='/Register'>
                            <Button variant='contained'>
                              Register
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  }
                  {pShow &&
                    <Box sx={{
                      paddingTop: '20px'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                      }} >
                        <Typography variant="h6">
                          Patient Login
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{
                          display: 'flex',
                          padding: '10px',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }}>
                          <Button onClick={handleAuth} variant='outlined' >Login</Button>
                        </Box>
                        <Divider>
                          or
                        </Divider>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: '20px'
                        }} >
                          <Button variant='contained' onClick={handlePatientReg}>
                            Register
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  }
              </Paper>
            </Collapse>
          </Container>
        </Grid>
      </Grid>
      <div className="modal fade" id="alertModal" tabIndex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Alert</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Only Admin access the page.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing