import { useEffect, useState } from "react";

function Dashboard() {

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/documents",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    const data = await response.json();
    setDocuments(data.documents);
  };

  const handleFileChange = (e)=>{
    setFile(e.target.files[0]);
  };

  const handleUpload = async ()=>{

    if(!file){
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file",file);

    const response = await fetch(
      "http://localhost:5000/api/documents/upload",
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:formData
      }
    );

    const data = await response.json();
    alert(data.message);

    fetchDocuments();
  };

  const handleDownload = async(id)=>{

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/documents/${id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSign = async(id)=>{

    if(!signature){
      alert("Please upload signature first");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file",signature);
    formData.append("x",100);
    formData.append("y",100);

    const response = await fetch(
      `http://localhost:5000/api/documents/sign/${id}`,
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:formData
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "signed-document.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (

    <div className="dashboard">

      <h2>Document Dashboard</h2>

      <div className="upload-box">

        <h3>Upload Document</h3>

        <input type="file" onChange={handleFileChange}/>
        <button onClick={handleUpload}>Upload</button>

        <h3>Upload Signature</h3>

        <input type="file" onChange={(e)=>setSignature(e.target.files[0])}/>

      </div>

      <h3>Your Documents</h3>

      <div className="doc-list">

        {documents.map((doc)=>(
          <div className="doc-card" key={doc._id}>

            <span>{doc.fileName}</span>

            <div className="doc-actions">

              <button onClick={()=>handleDownload(doc._id)}>
                Download
              </button>

              <button onClick={()=>handleSign(doc._id)}>
                Sign
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>

  );
}

export default Dashboard;