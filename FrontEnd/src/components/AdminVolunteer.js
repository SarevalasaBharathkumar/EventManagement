import React, { useEffect, useState } from 'react';
import './AdminVolunteer.css';

function AdminVolunteer() {
  const [eventVolunteerData, setEventVolunteerData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/volunteers/events')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched event and volunteer data:', data);
        setEventVolunteerData(data);
      })
      .catch((error) => console.error('Error fetching event and volunteer data:', error));
  }, []);

  return (
    <div>
      {eventVolunteerData.map((eventData, index) => (
        <div key={index} className="table-container">
          <h2>{eventData.eventName}</h2>
          {Array.isArray(eventData.volunteers) && eventData.volunteers.length > 0 ? (
            <table className="volunteer-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {eventData.volunteers.map((volunteer, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.collegeId}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No volunteers registered.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminVolunteer;
