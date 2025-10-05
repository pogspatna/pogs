const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.auth = null;
    this.initialized = false;
    
    // Folder mapping for organized storage
    this.folderIds = {
      officeBearers: process.env.GOOGLE_DRIVE_OFFICE_BEARERS_FOLDER_ID,
      newsletters: process.env.GOOGLE_DRIVE_NEWSLETTERS_FOLDER_ID,
      applications: process.env.GOOGLE_DRIVE_APPLICATIONS_FOLDER_ID,
      paymentScreenshots: process.env.GOOGLE_DRIVE_PAYMENT_SCREENSHOTS_FOLDER_ID,
      gallery: process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID,
      events: process.env.GOOGLE_DRIVE_EVENTS_FOLDER_ID,
      root: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || process.env.GOOGLE_DRIVE_FOLDER_ID
    };
  }

  async initialize() {
    try {
      // Check if OAuth credentials are provided
      if (!process.env.GOOGLE_DRIVE_CLIENT_ID || 
          !process.env.GOOGLE_DRIVE_CLIENT_SECRET || 
          !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
        console.error('Google Drive: Missing OAuth credentials. Please set GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, and GOOGLE_DRIVE_REFRESH_TOKEN');
        return false;
      }

      // Create OAuth2 client
      this.auth = new google.auth.OAuth2(
        process.env.GOOGLE_DRIVE_CLIENT_ID,
        process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        'urn:ietf:wg:oauth:2.0:oob'
      );

      // Set refresh token
      this.auth.setCredentials({
        refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
      });

      // Create Drive API instance
      this.drive = google.drive({ version: 'v3', auth: this.auth });

      // Test the connection
      await this.drive.about.get({ fields: 'user' });
      
      this.initialized = true;
      console.log('Google Drive service initialized successfully with OAuth');
      return true;
    } catch (error) {
      console.error('Google Drive initialization failed:', error.message);
      return false;
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType, fileType = "general") {
    try {
      if (!this.initialized) {
        const success = await this.initialize();
        if (!success) {
          throw new Error('File upload service not available');
        }
      }

      // Determine the target folder based on file type
      let targetFolderId = this.folderIds.root; // Default to root folder
      
      switch (fileType) {
        case 'office-bearer':
          targetFolderId = this.folderIds.officeBearers || this.folderIds.root;
          break;
        case 'newsletter':
          targetFolderId = this.folderIds.newsletters || this.folderIds.root;
          break;
        case 'application':
          targetFolderId = this.folderIds.applications || this.folderIds.root;
          break;
        case 'payment-screenshot':
          targetFolderId = this.folderIds.paymentScreenshots || this.folderIds.root;
          break;
        case 'gallery':
          targetFolderId = this.folderIds.gallery || this.folderIds.root;
          break;
        case 'event':
          targetFolderId = this.folderIds.events || this.folderIds.root;
          break;
        default:
          targetFolderId = this.folderIds.root;
      }

      const fileMetadata = {
        name: fileName,
        parents: targetFolderId ? [targetFolderId] : undefined
      };

      // Always use supportsAllDrives when working with shared drives
      const supportsAllDrives = true;

      const media = {
        mimeType: mimeType,
        body: require('stream').Readable.from(fileBuffer)
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,parents',
        supportsAllDrives: supportsAllDrives
      });

      // Make the file publicly viewable
      try {
        await this.drive.permissions.create({
          fileId: response.data.id,
          resource: {
            role: 'reader',
            type: 'anyone'
          },
          supportsAllDrives: supportsAllDrives
        });
      } catch (permissionError) {
        // Continue anyway - file is uploaded but may not be publicly accessible
        console.log('Permission setting failed (non-critical):', permissionError.message);
      }
      
      return {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink
      };
    } catch (error) {
      console.error('Google Drive upload error:', error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileId) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('File service not available');
      }
    }

    try {
      await this.drive.files.delete({ fileId });
      return true;
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  }

  async createFolder(folderName, parentFolderId = null) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('File service not available');
      }
    }

    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id,name'
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to create folder');
    }
  }

  async getFileInfo(fileId) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('File service not available');
      }
    }

    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,createdTime'
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to get file information');
    }
  }

  // Helper method to get the direct download URL
  getDirectDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // Helper method to get the direct view URL for images
  getDirectViewUrl(fileId) {
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  async makeFilePublic(fileId) {
    try {
      await this.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new GoogleDriveService(); 
