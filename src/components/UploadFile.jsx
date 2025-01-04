import { useState } from "react";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  // Kiểm tra loại file người dùng chọn
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    // Kiểm tra loại tệp
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert(
        "Invalid file type. Please upload an image, PDF, or Word document."
      );
      setFile(null);
    }
  };

  // Xử lý tải lên file
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "project-sep"); // Thay "YOUR_UPLOAD_PRESET" với preset của bạn

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmyuy4lhd/upload`, // Thay "YOUR_CLOUD_NAME" với tên Cloud của bạn
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadedFileUrl(data.secure_url); // Lấy URL file đã upload
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Document or Image to Cloudinary</h2>
      <input
        type="file"
        accept=".doc,.docx,.pdf,image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedFileUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}

      {uploading && <p>Uploading... Please wait.</p>}
    </div>
  );
};

export default UploadFile;
