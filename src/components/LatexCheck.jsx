// import {React, useState} from 'react'
// import axios from 'axios';
// import '../css/ReportCheckPage.css';
// // import FileUploadContainer from '../components/FileUploadContainer'

// export default function ReportCheckPage() {

//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [file, setFile] = useState([]);
// 	const [results, setResults] = useState([]);
//     const [viewResult, setViewResult] = useState('');

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
//         for(let i = 0; i < selectedFiles.length; i++) {
//             const formData = new FormData();
//             formData.append('zipFile', selectedFiles[i]);

//             try {
//                 const response = await axios.post('http://localhost:4000/api/coordinator/latex/upload',
//                     formData,
//                     {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                         },
//                     }
//                 );
//                 console.log('Server says Response:', response);
//                 setResults((prevResults) => [...prevResults, response]);
//                 console.log('check');
//                 console.log(results);
//                 console.log('\n');
//             } catch (error) {
//                 console.error('Upload failed:', error);
//             }
//         }
// 	};

//     const handleViewResponse = (index) => {
//         setViewResult(results[index])
//     }

//     const handleFileChange = (event) => {
//         setSelectedFiles([...event.target.files]);
//     };
    
//       const handleDelete = (id) => {
//         setFile((prevFiles) => prevFiles.filter((f) => f !== id));
//       };

//   return (
//     <div id='report-check-page'>
//         <div id='navbar'>
//             <p id='page-title'>Fast<b>Glide</b></p>
//                     <p id='logout-btn'>Logout</p>
//         </div>
//         {/* <FileUploadContainer></FileUploadContainer> */}
//         <div id='reports-check-side'>
//             <p id='side-bar-submission-name'><b>Submission Name:</b> abcde</p>
//             <p id='side-bar-submission-type'><b>Submission Type:</b> abcde</p>
//             <p id='side-bar-submission-response'><b>Submission Response:</b> abcde</p>
//         </div>
//         <div id='reports-check-main'>
//             <div id='reports-container'>
//                 <label htmlFor="file-input">
//                     <div id='upload-reports-btn'>{selectedFiles.length > 0 ? 'Click to Upload again' : 'Upload Reports'}
//                         <button id='files-submit-btn' style={{display: selectedFiles.length > 0 ? 'block' : 'none'}} onClick={handleSubmit}>Submit</button>
//                     </div>
//                 </label>
//                 <input id="file-input" type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />
//                 <div id='reports-header-container'>
//                     <div id='file-search-bar-container'>
//                         <div id='file-search-bar'>
//                             <input type='search' placeholder='Search'/>
//                         </div>
//                         <div id='file-search-filters-btn'>Filters</div>
//                     </div>
//                 </div>
//                 <div id='reports-table-container'>
//                     <table>
//                         <thead>
//                         <tr>
//                             <th>Filename</th>
//                             <th>File Type</th>
//                             <th>Remarks</th>
//                             <th>Delete</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {selectedFiles.map((f, index) => (
//                             <tr key={index}>
//                             <td id='reports-file-name'>{f.name}</td>
//                             <td>{f.type}</td>
//                             <td>{results.length === selectedFiles.length ? <p id='view-file-response' onClick={() => handleViewResponse(index)}>View response</p> : 'No response'}</td>
//                             <td>
//                                 <button id="delete-btn" onClick={() => handleDelete(f)}>
//                                 Delete
//                                 </button>
//                             </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>


//                 {/* <ul id='file-names'>
//                     {selectedFiles.map((file, index) => (
//                     <li key={index}>{file.name}</li>
//                     ))}
//                 </ul> */}
//                 </div>
                
//             </div>
//             {viewResult && <div id='report-details-container'>
//                 <p>{viewResult}</p>
//             </div>}
//         </div>
      
//     </div>
//   )
// }


import {React, useState} from 'react'
import "../css/ReportCheckPage.css";
import axios from 'axios';

// import FileUploadContainer from '../components/FileUploadContainer'

export default function ReportCheckPage() {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [file, setFile] = useState([]);
	const [results, setResults] = useState([]);
    const [viewResult, setViewResult] = useState('');
    const [viewSelectedFile, setViewSelectedFile] = useState();



    const handleDownload=async(index)=>{
        try {
            const formData = new FormData();
            formData.append('zipFile', selectedFiles[index]);
            const response = await fetch('/api/latex/download', {
                method: 'POST',
                body: formData,
            });

            console.log("RESPONES ",response)
            const blob = await response.blob(); // Convert response to Blob
            const url = window.URL.createObjectURL(blob); // Create a temporary URL for the Blob
    
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedFiles[index].name}.pdf`; // Specify the filename for download
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link); // Clean up the link element
    
            console.log('File downloaded successfully');
        } catch (error) {
            console.log(error)
        }

    }

	const handleSubmit = async (e) => {
		e.preventDefault();
        for(let i = 0; i < selectedFiles.length; i++) {
            const formData = new FormData();
            formData.append('zipFile', selectedFiles[i]);

            try {
                const response = await axios.post('http://localhost:4000/api/coordinator/latex/upload',
                                        formData,
                                        {
                                            headers: {
                                                "Content-Type": "multipart/form-data",
                                            },
                                        }
                                    );
                
                console.log('Server says Response:', response);
                setResults((prevResults) => [...prevResults, response.data]);
                console.log('check');
                console.log(results);
                console.log('\n');
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
	};

    const handleViewResponse = (index) => {
        setViewResult(results[index])
    }

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };
    
      const handleDelete = (id) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== id));
      };

  return (
    <div id='report-check-page'>
        <div id='navbar'>
            <p id='page-title'>Fast<b>Glide</b></p>
            
                
                    <p id='logout-btn'>Logout</p>
            
        </div>
        {/* <FileUploadContainer></FileUploadContainer> */}
        <div id='reports-check-side'>
            <p id='side-bar-submission-name'><b>Submission Name:</b> {viewSelectedFile && viewSelectedFile.name}</p>
            <p id='side-bar-submission-type'><b>Submission Type:</b> {viewSelectedFile && viewSelectedFile.type}</p>
            <p id='side-bar-submission-response'><b>Submission Response:</b> {viewSelectedFile && (results.length === selectedFiles.length ? <p id='view-file-response' onClick={() => handleViewResponse(selectedFiles.indexOf(viewSelectedFile))}>View response</p> : 'No response')}</p>
        </div>
        <div id='reports-check-main'>
            <div id='reports-container'>
                <label htmlFor="file-input">
                    <div id='upload-reports-btn'>{selectedFiles.length > 0 ? 'Click to Upload again' : 'Upload Reports'}
                        <button id='files-submit-btn' style={{display: selectedFiles.length > 0 ? 'block' : 'none'}} onClick={handleSubmit}>Submit</button>
                    </div>
                </label>
                <input id="file-input" type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />
                <div id='reports-header-container'>
                    <div id='file-search-bar-container'>
                        <div id='file-search-bar'>
                            <input type='search' placeholder='Search'/>
                        </div>
                        <div id='file-search-filters-btn'>Filters</div>
                    </div>
                </div>
                <div id='reports-table-container'>
                    <table>
                        <thead>
                        <tr>
                            <th>Filename</th>
                            <th>File Type</th>
                            <th>Remarks</th>
                            <th>Delete</th>
                            <th>Download</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedFiles.map((f, index) => (
                            <tr key={index}>
                            <td id='reports-file-name' onClick={()=>{setViewSelectedFile(f)}}>{f.name}</td>
                            <td>{f.type}</td>
                            <td>{results.length === selectedFiles.length ? <p id='view-file-response' onClick={() => handleViewResponse(index)}>View response</p> : 'No response'}</td>
                            <td>
                                <button id="delete-btn" onClick={() => handleDelete(f)}>
                                Delete
                                </button>
                            </td>
                            <td>
                                <button id="delete-btn" onClick={() => handleDownload(index)}>
                                Download
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>


                {/* <ul id='file-names'>
                    {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                    ))}
                </ul> */}
                </div>
                
            </div>
            {viewResult && <div id='report-details-container'>
                <p id='report-details-container-close-btn' onClick={() => {setViewResult('')}}>Close</p>
                <p id='result-comments-container'>
					{viewResult.map((result, index) =>
						result.value ? (
							<div className='result-comment' id='result-comment-green' key={index}>
								{result.comment}
							</div>
						) : (
							<div className='result-comment' id='result-comment-red' key={index}>
								{result.comment}
						</div>
					    )
					)}
				</p>
            </div>}
        </div>
      
    </div>
  )
}


