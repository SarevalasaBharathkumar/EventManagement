import React, { useEffect, useState } from 'react';

const ResourceManagement = () => {
    const [events, setEvents] = useState([]);
    const [requests, setRequests] = useState([]);
    const [handRaises, setHandRaises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalData, setModalData] = useState({ show: false, event: '', resourceIndex: null, type: '' });
    const [formData, setFormData] = useState({ resourceName: '', resourceCount: '', phoneNumber: '', availableCount: '' });

    const fetchData = async () => {
        try {
            const [eventsRes, requestsRes, handRaisesRes] = await Promise.all([
                fetch('https://eventmanagement-1-y0a7.onrender.com/api/events/getevents'),
                fetch('http://localhost:5000/api/resources/getrequests'),
                fetch('http://localhost:5000/api/resources/gethandraises'),
            ]);

            if (!eventsRes.ok) throw new Error('Failed to fetch events');
            if (!requestsRes.ok) throw new Error('Failed to fetch requests');
            if (!handRaisesRes.ok) throw new Error('Failed to fetch hand raises');

            const [eventsData, requestsData, handRaisesData] = await Promise.all([
                eventsRes.json(),
                requestsRes.json(),
                handRaisesRes.json(),
            ]);

            setEvents(eventsData);
            setRequests(requestsData);
            setHandRaises(handRaisesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateAvailableSum = (eventName, resourceIndex) => {
        return handRaises
            .filter((hr) => hr.eventName === eventName && hr.resourceIndex === resourceIndex)
            .reduce((sum, hr) => sum + hr.availableCount, 0);
    };

    const handleEventClick = (eventName) => {
        setModalData({ show: true, event: eventName, resourceIndex: null, type: 'request' });
        setFormData({ resourceName: '', resourceCount: '', phoneNumber: '', availableCount: '' });
    };

    const handleResourceSubmit = async () => {
        const { resourceName, resourceCount } = formData;
        if (!resourceName || !resourceCount) return;

        try {
            const response = await fetch('http://localhost:5000/api/resources/saverequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: modalData.event,
                    resourceName,
                    resourceCount: parseInt(resourceCount, 10),
                }),
            });

            if (!response.ok) throw new Error('Failed to submit resource request');

            setFormData({ resourceName: '', resourceCount: '' });
            setModalData((prev) => ({ ...prev, show: false }));
            alert('Resource request submitted successfully!');

            // Fetch updated data
            await fetchData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleHandRaiseSubmit = async () => {
        const { phoneNumber, availableCount } = formData;
        if (!phoneNumber || !availableCount) return;

        try {
            const response = await fetch('http://localhost:5000/api/resources/savehandraise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: modalData.event,
                    resourceIndex: modalData.resourceIndex,
                    phoneNumber,
                    availableCount: parseInt(availableCount, 10),
                }),
            });

            if (!response.ok) throw new Error('Failed to submit hand raise');

            setFormData({ phoneNumber: '', availableCount: '' });
            setModalData((prev) => ({ ...prev, show: false }));
            alert('Hand raise submitted successfully!');

            // Fetch updated data
            await fetchData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h1>Resource Management</h1>
            {events.map((event) => (
                <div key={event.eventName} style={{ marginBottom: '20px' }}>
                    <h3>{event.eventName}</h3>
                    <button className="btn btn-primary" onClick={() => handleEventClick(event.eventName)}>Request</button>
                    {requests.filter((req) => req.eventName === event.eventName).length > 0 && (
                        <div className="mt-3">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Resource Name</th>
                                        <th>Resource Count</th>
                                        <th>Hand Raise Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests
                                        .filter((req) => req.eventName === event.eventName)
                                        .map((request, index) => {
                                            const totalAvailable = calculateAvailableSum(event.eventName, index);
                                            const isResourceAvailable = totalAvailable < request.resourceCount;

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{request.resourceName}</td>
                                                    <td>{request.resourceCount}</td>
                                                    <td>
                                                        {isResourceAvailable ? (
                                                            <button
                                                                className="btn btn-warning"
                                                                onClick={() =>
                                                                    setModalData({
                                                                        show: true,
                                                                        event: event.eventName,
                                                                        resourceIndex: index,
                                                                        type: 'handRaise',
                                                                    })
                                                                }
                                                            >
                                                                Raise Hand
                                                            </button>
                                                        ) : (
                                                            <span className="text-danger">Fully Allocated</span>
                                                        )}
                                                        <div className="mt-2">
                                                            {handRaises
                                                                .filter((hr) => hr.resourceIndex === index && hr.eventName === event.eventName)
                                                                .map((hr, i) => (
                                                                    <div key={i}>
                                                                        <p>Phone: {hr.phoneNumber}</p>
                                                                        <p>Available: {hr.availableCount}</p>
                                                                    </div>
                                                                ))}
                                                            <p>Total Available: {totalAvailable}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}

            {modalData.show && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalData.type === 'request' ? 'Request Resource' : 'Raise Hand'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setModalData({ show: false })}></button>
                            </div>
                            <div className="modal-body">
                                {modalData.type === 'request' ? (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="resourceName" className="form-label">Resource Name</label>
                                            <input
                                                type="text"
                                                id="resourceName"
                                                className="form-control"
                                                value={formData.resourceName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="resourceCount" className="form-label">Resource Count</label>
                                            <input
                                                type="number"
                                                id="resourceCount"
                                                className="form-control"
                                                value={formData.resourceCount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                            <input
                                                type="text"
                                                id="phoneNumber"
                                                className="form-control"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="availableCount" className="form-label">Available Count</label>
                                            <input
                                                type="number"
                                                id="availableCount"
                                                className="form-control"
                                                value={formData.availableCount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalData({ show: false })}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        modalData.type === 'request'
                                            ? handleResourceSubmit
                                            : handleHandRaiseSubmit
                                    }
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceManagement;
