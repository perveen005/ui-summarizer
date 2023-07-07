import { BlobServiceClient } from '@azure/storage-blob';
import { Buffer } from 'buffer';

global.Buffer = Buffer; 
export async function uploadFileToAzureStorage(file, sasUrl,containerName) {
  const blobServiceClient = new BlobServiceClient(sasUrl);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(file.name);

  try {
    await blockBlobClient.uploadData(file);
    console.log('File uploaded successfully!');
    return true;
  } catch (error) {
    console.log('Error uploading file:', error);
    return false;
  }
}
