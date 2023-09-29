import { useEffect } from 'react'
import faceIO from '@faceio/fiojs'
import { enrollNewUser } from '../FaceAuth'
import '../styles.sass'
import 'bootstrap/dist/css/bootstrap.css'
import { useNavigate } from 'react-router-dom'
import faceio from '@faceio/fiojs'



const Landing = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.getElementById("doctor").classList.add("active")
    })

    const handleDocClick = () => {
        if(!document.getElementById("doctor").classList.contains("active")){
            document.getElementById("doctor").classList.toggle("active")
            document.getElementById("patient").classList.toggle("active")
        }
    }

    const handlePatClick = () => {
        if(!document.getElementById("patient").classList.contains("active")){
            document.getElementById("doctor").classList.toggle("active")
            document.getElementById("patient").classList.toggle("active")
        }
    }

    const handleSubmit = () => {

    }

    const handleAuth = () => {
        const faceio = new faceIO('fioa90ff');
        faceio.authenticate({
            "locale": "auto"
        }).then(userData => {
            navigate('/patient')
            localStorage.setItem("Patient_id", userData.facialId)
            localStorage.setItem("Patient_data", JSON.stringify(userData.payload))
            console.log("Success, user identified")
            console.log("Linked facial Id: " + userData.facialId)
            console.log("Payload: " + JSON.stringify(userData.payload)) 
        })

    }

    return (
        <>
            <div className="container">
                <div className='layout'>
                    <div>
                        <div className='d-flex justify-content-evenly pt-2'>
                            <button className='btn btn-primary h-btn' onClick={handlePatClick}>Doctor</button>
                            <button className='btn btn-primary h-btn' onClick={handleDocClick}>Patient</button>
                        </div>
                        <div>
                            <div id="doctor">
                                <div className='heading d-flex justify-content-center'>
                                    <h1>Doctor Login</h1>
                                </div>
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <table>
                                            <tr>
                                                <th><label>Username</label></th>
                                                <td><input type='text' /></td>
                                            </tr>
                                            <tr>
                                                <th><label>Password</label></th>
                                                <td><input type='password' /></td>
                                            </tr>
                                        </table>
                                    </form>
                                </div>
                            </div>
                            <div id="patient">
                                <div className='heading d-flex justify-content-center'>
                                    <h1>Patient Login</h1>
                                </div>
                                <div className='auth-center'>
                                    <button className='btn btn-secondary mb-2 ms-4' onClick={enrollNewUser}>Enroll</button><br/>
                                    <button className='btn btn-secondary' onClick={handleAuth} >Authenticate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing