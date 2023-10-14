
const AdminContractAddress = '0xAAeb9d88241f6f4B25d594094B611F2665522e79'

const MyContractAddress = '0x0BA87a14e90d4C59F18BB336F12Cf9FAA32bF28F'

const isAdminFunctionABI = [{
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

const getUnauthenticatedDoctorsIdsABI = [{
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

const getUnauthenticatedDoctorABI = [{
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

export {
  AdminContractAddress,
  MyContractAddress,
  isAdminFunctionABI,
  getUnauthenticatedDoctorsIdsABI,
  getUnauthenticatedDoctorABI,
}
  

  
