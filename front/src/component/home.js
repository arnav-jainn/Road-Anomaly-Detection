// import React, { useState } from 'react';
// import axios from 'axios';

// const UploadForm = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState('');
//   const [confidence, setConfidence] = useState('');

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!selectedFile) {
//       alert("Please select an image first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.post('http://localhost:5000/predict', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setPrediction(response.data.prediction);
//       setConfidence(response.data.confidence);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Upload an Image for Accident Detection</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} />
//         <button type="submit">Predict</button>
//       </form>
//       {prediction && (
//         <div>
//           <h3>Prediction: {prediction}</h3>
//           <p>Confidence: {confidence}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadForm;
