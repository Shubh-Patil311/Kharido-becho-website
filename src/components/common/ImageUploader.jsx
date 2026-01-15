import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ImageUploader = ({
    idValue,
    idKey = "id",
    uploadService,
    onSuccess,
}) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) return;

        // Add new files to state
        setFiles((prev) => [...prev, ...selectedFiles]);

        // Generate previews
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleRemove = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            // Revoke the URL being removed
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleUpload = async () => {
        if (!files.length) {
            setUploadMsg("Please select images first.");
            return;
        }

        if (!idValue) {
            setUploadMsg("Missing ID for upload.");
            return;
        }

        try {
            setUploading(true);
            setUploadMsg(""); // clear previous messages

            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));
            formData.append(idKey, idValue);

            await uploadService(formData);

            setUploadMsg("Images uploaded successfully!");
            setFiles([]);
            setPreviews([]);

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error("Upload failed", err);
            setUploadMsg("Upload failed. Please try again.");
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>

            {/* File Input */}
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Images
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                    {previews.map((src, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={src}
                                alt={`preview-${index}`}
                                className="w-full h-24 object-cover rounded border border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className={`px-5 py-2 rounded-md text-white font-medium transition-colors ${uploading || files.length === 0
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload Images"}
                </button>

                {uploadMsg && (
                    <p
                        className={`text-sm ${uploadMsg.includes("success") ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {uploadMsg}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
