import React, { useState, useEffect } from 'react';

function Dashboard() {
  let sessionUser = JSON.parse(sessionStorage.getItem('user'));
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchReservations() {
      fetch(`http://localhost:3001/reservations/${sessionUser.username}`)
        .then(response => {
          return response.json()
        })
        .then(json => {
          setReservations(json);
          setLoading(false);
        }
        )
        .catch(error => {
          console.log(error)
          setLoading(false)
        })
    }
    fetchReservations()

  }, []);


  return (
    <div className='container'>
      <div className='card-wrapper'>
        <div className='card' style={{width:'fit-content'}}>
          <h2>Account Information</h2>
          <table className='table'>
            <thead>
              <tr>
                <th className="center">Full Name</th>
                <th className="center">Username</th>
                <th className="center">Email</th>
                <th className="center">Country</th>
                <th className="center">City</th>
                <th className="center">Adress</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{sessionUser.firstname} {sessionUser.lastname}</td>
                <td>{sessionUser.username}</td>
                <td>{sessionUser.email}</td>
                <td>{sessionUser.country}</td>
                <td>{sessionUser.city}</td>
                <td>{sessionUser.address}</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      <div className='card-wrapper'>
        <div className='card results'>
          <h2>My Reservations</h2>
          <table className="table">
            <thead>
              <tr>
                <th className="center">Username</th>
                <th className="center">Email</th>
                <th className="center">Phone</th>
                <th className="center">License Plate</th>
                <th className="center">From Date</th>
                <th className="center">To Date</th>
                <th className="center">Price</th>
                <th className="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (<div className='loading'>
              <p style={{color: 'white'}}>Loading vehicles...</p>
              <div className="loader"></div>
            </div>):
             reservations.length ? 
             (reservations.map((reservation)=>(
                <tr>
                <td>{reservation.customer}</td>
                <td>{reservation.email}</td>
                <td>{reservation.phonenum}</td>
                <td>{reservation.reservedvehicle}</td>
                <td>{reservation.fromdate}</td>
                <td>{reservation.todate}</td>
                <td>{reservation.price}</td>
                <td>{reservation.status}</td>
              </tr>
             )))
             :
             <tr>
                <td>NO RESERVATIONS FOUND</td>
              </tr>
            } 
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;