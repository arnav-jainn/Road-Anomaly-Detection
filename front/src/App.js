import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './App.css'; // Import your custom CSS

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage(''); // Clear error message when a new file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true); // Start loading state

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setResult(`Prediction: ${response.data.message} with confidence: ${response.data.confidence}`);
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error during file upload or prediction', error.response || error);
      setErrorMessage(error.response?.data?.error || 'Error uploading file or getting prediction');
      setResult(''); // Clear result on error
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Road Anomaly Detection</h1>

      <form onSubmit={handleSubmit} className="upload-form">
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select an image to upload:</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="tooltip">JPEG, PNG formats allowed.</Tooltip>}
          >
            <Form.Control type="file" onChange={handleFileChange} />
          </OverlayTrigger>
        </Form.Group>

        {selectedFile && (
          <div className="image-preview-container">
            <h5 className="image-description">Image You Uploaded:</h5>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Processing...</div>
        ) : (
          <Button variant="primary" type="submit" className="mt-2 btn-custom">
            Predict
          </Button>
        )}
      </form>

      {result && <div className="result-message success">{result}</div>}
      {errorMessage && <div className="result-message error">{errorMessage}</div>}
    </div>
  );
}

export default App;
