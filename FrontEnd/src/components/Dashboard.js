import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Dashboard() {
  const [eventFeedback, setEventFeedback] = useState([]);

  useEffect(() => {
    // Fetch feedback data for all events
    async function fetchFeedback() {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback/feedbackData'); // Adjust endpoint as needed
        console.log(response.data);
        setEventFeedback(response.data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    }
    fetchFeedback();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Dashboard</h1>
      {eventFeedback.length === 0 ? (
        <p>Loading feedback data...</p>
      ) : (
        eventFeedback.map((event) => (
          <div
            key={event.eventId}
            style={{
              marginBottom: '30px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              maxWidth: '100%',
            }}
          >
            {/* Event Name */}
            <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '20px', fontWeight: 'bold' }}>
              {event.eventName}
            </h2>

            {/* Bar Graph */}
            <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
              <Bar
                data={{
                  labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                  datasets: [
                    {
                      label: 'Ratings',
                      data: [
                        event.ratingCounts[1] || 0,
                        event.ratingCounts[2] || 0,
                        event.ratingCounts[3] || 0,
                        event.ratingCounts[4] || 0,
                        event.ratingCounts[5] || 0,
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 2, // Increment by 2
                        min: 0,      // Start at 0
                        max: 10,     // Manually set the maximum value
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
