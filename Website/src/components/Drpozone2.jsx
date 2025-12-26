import {
    Dropzone,
    FileMosaic,
    FullScreen,
    ImagePreview,
    VideoPreview,
} from "@files-ui/react";
import * as React from "react";
import { useEffect } from "react";

const BASE_URL =
    "https://www.myserver.com";

export default function AdvancedDropzoneDemo({ handleChange, files }) {
    const [extFiles, setExtFiles] = React.useState([] || files);
    const [imageSrc, setImageSrc] = React.useState(undefined);
    let images = [];
    useEffect(() => {
    }, [files])

    const updateFiles = (incomingFiles) => {
        console.log("Incoming files:", incomingFiles);
        setExtFiles(incomingFiles);
        handleChange(incomingFiles.map(file => file.file)); // Ensure you pass the correct file format
      };
      
    const onDelete = (id) => {
        setExtFiles(extFiles.filter((x) => x.id !== id));
        extFiles.map((ext) => {
            images.push(files.file)
        })
        handleChange(images);
        images = [];
    };
    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };
    //    const handleWatch = (videoSource) => {
    //      setVideoSrc(videoSource);
    //    };
    const handleStart = (filesToUpload) => {
        console.log("advanced demo start upload", filesToUpload);
    };
    const handleFinish = (uploadedFiles) => {
        console.log("advanced demo finish upload", uploadedFiles);
    };
    const handleAbort = (id) => {
        setExtFiles(
            extFiles.map((ef) => {
                if (ef.id === id) {
                    return { ...ef, uploadStatus: "aborted" };
                } else return { ...ef };
            })
        );
    };
    const handleCancel = (id) => {
        setExtFiles(
            extFiles.map((ef) => {
                if (ef.id === id) {
                    return { ...ef, uploadStatus: undefined };
                } else return { ...ef };
            })
        );
    };
    return (
        <>
            <Dropzone
                onChange={updateFiles}
                minHeight="195px"
                value={extFiles}
                maxFiles={5}
                maxFileSize={5 * 1024 * 1024}
                label="Drag'n drop files here or click to browse"
                onUploadStart={handleStart}
                onUploadFinish={handleFinish}
            >
                {extFiles.map((file) => (
                    <FileMosaic
                        {...file}
                        key={file.id}
                        onDelete={onDelete}
                        onSee={handleSee}
                        //  onWatch={handleWatch}
                        onAbort={handleAbort}
                        onCancel={handleCancel}
                        resultOnTooltip
                        alwaysActive
                        preview
                        info
                    />
                ))}
            </Dropzone>
            <FullScreen
                open={imageSrc !== undefined}
                onClose={() => setImageSrc(undefined)}
            >
                <ImagePreview src={imageSrc} />
            </FullScreen>
            {/* <FullScreen
         open={videoSrc !== undefined}
         onClose={() => setVideoSrc(undefined)}
       > 
         <VideoPreview src={videoSrc} autoPlay controls />
       </FullScreen> */}
        </>
    );
}