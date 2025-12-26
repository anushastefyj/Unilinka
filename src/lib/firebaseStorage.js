import { 
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "./firebase";

// Upload file to Firebase Storage
export const uploadFile = async (file, path, onProgress) => {
  try {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      // Use resumable upload for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            reject({ success: false, error: error.message });
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ success: true, url: downloadURL, path });
          }
        );
      });
    } else {
      // Simple upload without progress
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, url: downloadURL, path };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload multiple files
export const uploadFiles = async (files, basePath, onProgress) => {
  const uploadPromises = files.map((file, index) => {
    const fileName = `${Date.now()}_${index}_${file.name}`;
    const filePath = `${basePath}/${fileName}`;
    return uploadFile(file, filePath, onProgress);
  });
  
  try {
    const results = await Promise.all(uploadPromises);
    return { success: true, results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete file from Firebase Storage
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get download URL
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

