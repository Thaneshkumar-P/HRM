// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {

    struct Doctor {
        address docAddress;
        string username;
        string password;
        string _documentHash;
        bool isAuthenticated;
    }

    struct Patient {
        address patAddress;
        string name;
        string[] documentHashes;
    }

    mapping(string => Patient) private patientData;
    mapping(string => Doctor) private doctorData;

    string[] public doctorIds;
    string[] patientIds;

    event IPFSHashAdded(uint256 indexed id, string ipfsHash);
    event DoctorEnrollReq(string indexed docId, string username, string _documentHash, string password);
    event DoctorAuthenticated(string indexed docId);
    event PatientEnrolled(string indexed patientId, string name);

    function EnrollPatient(string memory patientID, string memory name) public {
        require(bytes(name).length > 0, "IPFS hash cannot be empty");
        Patient memory temp;
        temp.patAddress = msg.sender;
        temp.name = name;
        patientData[patientID] = temp;
        patientIds.push(patientID);
        emit PatientEnrolled(patientID, name);
    }

    function addDocumentHashToPatient(string memory patientID, string memory documentHash) public {
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        Patient storage patient = patientData[patientID];
        string[] memory updatedDocumentHashes = new string[](patient.documentHashes.length + 1);
        for (uint i = 0; i < patient.documentHashes.length; i++) {
            updatedDocumentHashes[i] = patient.documentHashes[i];
        }
        updatedDocumentHashes[patient.documentHashes.length] = documentHash;
        patient.documentHashes = updatedDocumentHashes;
    }

    function patientLogin(string memory patientID) public view returns (bool) {
        Patient memory temp;
        for(uint i = 0;i < patientIds.length; i++){
            if(keccak256(abi.encodePacked(patientIds[i])) == keccak256(abi.encodePacked(patientID))){
                temp = patientData[patientID];
                break;
            }
        }

        if(msg.sender != temp.patAddress){
            return false;
        }

        return true;
    }

    function EnrollDoctor(string memory docId, string memory username, string memory _documenthash, string memory password) public  {
        require(bytes(_documenthash).length > 0, "Cannot be empty");
        require(bytes(password).length > 0, "Cannot be empty");
        require(bytes(username).length > 0, "Cannot be empty");
        Doctor memory temp;
        temp.docAddress = msg.sender;
        temp.username = username;
        temp.password = password;
        temp._documentHash = _documenthash;
        temp.isAuthenticated = false;
        doctorData[docId] = temp;
        doctorIds.push(docId);
        emit DoctorEnrollReq(docId, username, _documenthash, password);
    }

    function authorizeDoctor(string memory docId) public {
        Doctor memory temp = doctorData[docId];
        temp.isAuthenticated = true;
        doctorData[docId] = temp;
        emit DoctorAuthenticated(docId);
    }

    function DoctorLogin(string memory username, string memory password) public view returns(bool) {
        Doctor memory temp;
        for(uint i = 0; i<doctorIds.length;i++){
            string memory name = doctorData[doctorIds[i]].username;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(username))){
                temp = doctorData[doctorIds[i]];
                break;
            }
        }

        if(msg.sender != temp.docAddress){
            return false;
        }

        if(temp.isAuthenticated){
            if(keccak256(abi.encodePacked(password)) != keccak256(abi.encodePacked(temp.password))){
                return false;
            }
        }
        else{
            return false;
        }
        return true;
    }

    function getPatient(string memory patientID) public view returns (address patAddress, string memory name, string[] memory documentHash) {
        require(bytes(patientID).length > 0, "Doctor id is required");
        return (patientData[patientID].patAddress, patientData[patientID].name, patientData[patientID].documentHashes);
    }

    function getUnauthenticatedDoctorsIds() public view returns (string[] memory) {
        return doctorIds;
    }

    function getUnauthenticatedDoctor(string calldata docId) public view returns (address docAddress, string memory username, string memory password, string memory _documentHash, bool isAuthenticated) {
        require(bytes(docId).length > 0,"Doctor id is requied");
        return (doctorData[docId].docAddress, doctorData[docId].username, doctorData[docId].password, doctorData[docId]._documentHash, doctorData[docId].isAuthenticated);
    }
}