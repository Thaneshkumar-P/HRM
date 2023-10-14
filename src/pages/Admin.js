import Web3 from "web3";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { TablePaginationActions } from "../components/AdminTable";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableHead } from "@mui/material";
import { MyContractAddress, AdminContractAddress } from "../MyContractABI";


const Admin = () => {
    const [result, setResult] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - result.length) : 0;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const navigate = useNavigate()
    const nextpage = '/'

    useEffect(() => {

      async function isDeployer() {
        if(window.ethereum){

          const web3 = new Web3(window.ethereum);
    
          // Request access to the user's accounts
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          const userAddress = web3.currentProvider.selectedAddress;

          const contractAddress = AdminContractAddress;

          const contractABI = [{
            "inputs": [],
            "name": "isAdminFunction",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }];
  
          const contract = new web3.eth.Contract(contractABI, contractAddress);
  
          const encodedData = contract.methods.isAdminFunction().encodeABI();

          try {
            const result = await web3.eth.call({
              to: contractAddress,
              from: userAddress,
              data: encodedData,
            }, 'latest');

            const decodedResult = web3.eth.abi.decodeParameter('bool', result);
  
            console.log('Decoded result:', decodedResult);
          } catch (error) {
            localStorage.setItem("Admin", false)
            const timeout = setTimeout(() => navigate('/'))
            return () => clearTimeout(timeout)
          }
        }
      }
      isDeployer();

      async function fetchUnauthenticatedDoctors() {
        const web3 = new Web3('http://127.0.0.1:7545');
  
        const contractAddress = MyContractAddress;
  
        const contractABI = [{
          "inputs": [],
          "name": "getUnauthenticatedDoctorsIds",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }];
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
  
        const encodedData = contract.methods.getUnauthenticatedDoctorsIds().encodeABI();
  
        try {
          const result = await web3.eth.call({
            to: contractAddress,
            data: encodedData,
          }, 'latest');
  
          const decodedResult = web3.eth.abi.decodeParameter('string[]', result);
  
          setResult(decodedResult)
  
          console.log('Decoded result:', decodedResult);
        } catch (error) {
          console.error('Call error:', error);
        }
  
      }
      fetchUnauthenticatedDoctors()
    }, [navigate, nextpage]);

    const fetchDoctor = async (docId) => {
      const web3 = new Web3('http://127.0.0.1:7545');

      const contractAddress = MyContractAddress;

      const contractABI = [{
        "inputs": [
          {
            "internalType": "string",
            "name": "docId",
            "type": "string"
          }
        ],
        "name": "getUnauthenticatedDoctor",
        "outputs": [
          {
            "internalType": "address",
            "name": "docAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "password",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_documentHash",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isAuthenticated",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }];

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const encodedData = contract.methods.getUnauthenticatedDoctor(docId).encodeABI();

      try {
        const result = await web3.eth.call({
          to: contractAddress,
          data: encodedData,
        }, 'latest');

        const decodedResult = web3.eth.abi.decodeParameters(['address', 'string', 'string', 'string', 'bool'], result);

        const doctor = {
          Doctor_Id: docId, 
          address: decodedResult[0], 
          username: decodedResult[1], 
          password: decodedResult[2],
          documentHash: decodedResult[3], 
          isAuthenticated: decodedResult[4],
        };

        setSelectedDoctor(doctor);
        console.log(selectedDoctor.isAuthenticated)

        console.log('Decoded result:', decodedResult);
      } catch (error) {
        console.error('Call error:', error);
      }
    }

    const authenticateDoctor = async (docId) => {
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
                  "name": "docId",
                  "type": "string"
                }
              ],
              "name": "authorizeDoctor",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
    
          const contract = new web3.eth.Contract(contractABI, contractAddress);
    
          const encodedData = contract.methods.authorizeDoctor(docId).encodeABI();
        
          const tx = {
            to: contractAddress,
            from: userAddress,
            data: encodedData,
          };
    
          const receipt = await web3.eth.sendTransaction(tx);
    
          console.log('Transaction receipt:', receipt);
          setTimeout(() => fetchDoctor(docId), 3)
        } else {
          console.error('MetaMask is not installed or not enabled');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
      


    return (
        <>
            <div>
                <div style={{padding: 100+'px'}}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                  <caption>List of doctors enrolled in the application</caption>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell>Doctor Id</TableCell>
                        <TableCell align="center">Option</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : result
                      ).map((row, index) => (
                        <TableRow key={row}>
                          <TableCell component="th" scope="row" align="center">
                            {(page * rowsPerPage) + index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center">
                            <Button onClick={() => fetchDoctor(row)} variant="text" data-bs-toggle="modal" data-bs-target="#doctorModal">Status</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 69 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={3}
                          count={result.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              'aria-label': 'rows per page',
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
                </div>
                <div className="modal fade" id="doctorModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{fontFamily: 'roboto'}}>Doctor_Id: {selectedDoctor && selectedDoctor.Doctor_Id}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                <strong>Doctor_Id:</strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {selectedDoctor && selectedDoctor.Doctor_Id}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                <strong>Address:</strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {selectedDoctor && selectedDoctor.address}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                <strong>Username:</strong> 
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {selectedDoctor && selectedDoctor.username}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                <strong>Document Hash:</strong>{" "}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <a
                                  href={`http://localhost:8080/ipfs/${selectedDoctor && selectedDoctor.documentHash}`}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {selectedDoctor && selectedDoctor.documentHash}
                                </a>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <img src={`http://localhost:8080/ipfs/${selectedDoctor && selectedDoctor.documentHash}`} style={{width: 400+'px'}} alt="Proof Cannot be Displayed. Please download the file"/>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" align="center">
                                <strong>Authenticated:</strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {selectedDoctor && selectedDoctor.isAuthenticated ? 'Yes' : 'No'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      </div>
                      <div className="modal-footer">
                        <Button variant="text" data-bs-dismiss="modal">Close</Button>
                        {selectedDoctor && !selectedDoctor.isAuthenticated ? 
                          <Button onClick={() => authenticateDoctor(selectedDoctor && selectedDoctor.Doctor_Id)} variant="text">Authenticate</Button>
                          :
                          <Button variant="text"  color="success">Authenticated</Button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </>
    )
}

export default Admin