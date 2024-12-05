import React, { useEffect, useState } from 'react';
import './AdminVolunteer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function EventPromotion() {
  const [eventVolunteerData, setEventVolunteerData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [isMobile, setIsMobile] = useState(false); // Track if it's mobile or not

  // Detect if the user is on mobile or desktop based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile is less than or equal to 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch event data and previously uploaded images
  useEffect(() => {
    fetch('http://localhost:5000/api/volunteers/events')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEventVolunteerData(data);

        // Fetch uploaded images for each event
        data.forEach((event) => fetchUploadedImages(event.id));
      })
      .catch((error) =>
        console.error('Error fetching event and volunteer data:', error)
      );
  }, []);

  // Fetch uploaded images for a specific event
  const fetchUploadedImages = (eventId) => {
    fetch(`http://localhost:5000/api/images/${eventId}/uploaded-images`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch uploaded images');
        }
        return response.json();
      })
      .then((data) => {
        setUploadedImages((prevImages) => ({
          ...prevImages,
          [eventId]: data.images || [],
        }));
      })
      .catch((error) =>
        console.error('Error fetching uploaded images:', error)
      );
  };

  // Handle file selection
  const handleFileChange = (event, eventId) => {
    const files = Array.from(event.target.files);

    const filePreviews = files.map((file) => ({
      fileName: file.name,
      url: URL.createObjectURL(file),
    }));

    const base64Files = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({ fileName: file.name, base64: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    // Update preview images and selected files
    Promise.all(base64Files).then((base64Images) => {
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [eventId]: base64Images,
      }));

      setPreviewImages((prevPreviews) => ({
        ...prevPreviews,
        [eventId]: filePreviews,
      }));
    });
  };

  // Handle image upload to the server
  const handleUpload = (eventId) => {
    const files = selectedFiles[eventId];
    if (!files || files.length === 0) return;

    const formData = {
      images: files.map((file) => ({ base64: file.base64 })),
    };

    fetch(`http://localhost:5000/api/images/${eventId}/upload-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to upload images');
        }
        return response.json();
      })
      .then((data) => {
        alert('Images uploaded successfully!');
        setSelectedFiles((prevFiles) => ({
          ...prevFiles,
          [eventId]: [],
        }));
        setPreviewImages((prevPreviews) => ({
          ...prevPreviews,
          [eventId]: [],
        }));

        // Refresh uploaded images
        fetchUploadedImages(eventId);
      })
      .catch((error) => console.error('Error uploading images:', error));
  };

  // Handle image download
  const handleDownload = (imageUrl) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = imageUrl.split('/').pop(); // Download file name
    a.click();
  };

  // Handle Instagram action
  const handleInstagram = (imageUrl) => {
    // Download the image and open Instagram's Story page
    handleDownload(imageUrl);
    window.open('https://www.instagram.com/stories/', '_blank');
  };

  return (
    <div className="container mt-4">
      {eventVolunteerData.map((eventData, index) => (
        <div key={eventData.id} className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{eventData.eventName}</h5>
                <div className="mb-3">
                  <label htmlFor={`fileInput-${eventData.id}`} className="form-label">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id={`fileInput-${eventData.id}`}
                    className="form-control"
                    multiple
                    onChange={(event) => handleFileChange(event, eventData.id)}
                  />
                </div>

                {/* Display image previews */}
                <div className="row mt-3">
                  {previewImages[eventData.id] &&
                    previewImages[eventData.id].map((image, imgIndex) => (
                      <div key={imgIndex} className="col-6 col-md-4 mb-3">
                        <img
                          src={image.url}
                          className="card-img-top img-thumbnail"
                          alt={image.fileName}
                        />
                        <div className="icons-container mt-2">
                          {isMobile ? (
                            <i
                              className="bi bi-instagram"
                              onClick={() => handleInstagram(image.url)}
                              style={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <i
                              className="bi bi-download"
                              onClick={() => handleDownload(image.url)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleUpload(eventData.id)}
                >
                  Upload
                </button>

                {/* Display previously uploaded images */}
                <div className="row mt-3">
                  {uploadedImages[eventData.id] &&
                    uploadedImages[eventData.id].map((image, imgIndex) => (
                      <div key={imgIndex} className="col-6 col-md-4 mb-3">
                        <img
                          src={image.base64}
                          className="img-thumbnail"
                          alt={`Uploaded ${imgIndex}`}
                        />
                        <div className="icons-container mt-2">
                          {isMobile ? (
                            <i
                              className="bi bi-instagram"
                              onClick={() => handleInstagram(image.base64)}
                              style={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <i
                              className="bi bi-download"
                              onClick={() => handleDownload(image.base64)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventPromotion;
