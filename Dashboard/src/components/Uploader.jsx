import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { BiLoaderCircle } from 'react-icons/bi';
import { FiUploadCloud } from 'react-icons/fi';

const Uploader = ({ setUploadedFiles }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFilesLocal] = useState([]);

  const onDrop = async (acceptedFiles) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUploadedFilesLocal(acceptedFiles);
      setUploadedFiles(acceptedFiles);
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully.`);
    } catch (error) {
      toast.error('Failed to upload files.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop,
  });

  return (
    <div className="w-full text-center grid grid-cols-12 gap-4">
      <div
        className="px-6 lg:col-span-10 sm:col-span-8 col-span-12 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps({ name: 'attachment' })} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-subMain" />
        </span>
        <p className="text-sm mt-2">Drag and drop your files here, or click to select files</p>
        <em className="text-xs text-gray-400">(Only *.jpeg and *.png images will be accepted)</em>
      </div>
      <div className="lg:col-span-2 sm:col-span-4 col-span-12">
        {loading ? (
          <div className="px-6 w-full bg-dry flex-colo h-32 border-2 border-border border-dashed rounded-md">
            <BiLoaderCircle className="mx-auto text-main text-3xl animate-spin" />
            <span className="text-sm mt-2 text-text">Uploading...</span>
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div>
            {/* <h3 className="text-lg font-semibold">Uploaded Files</h3> */}
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  {/* <img
                    src={URL.createObjectURL(file)}
                    alt={`Attachment ${index}`}
                    className="w-full h-20 rounded-lg object-cover"
                  />
                  <p>Filename: {file.name}</p> 
                  <p>Size: {file.size} bytes</p> 
                  <p>Type: {file.type}</p>  */}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm">No files uploaded</p>
        )}
      </div>
    </div>
  );
};


export default Uploader;
