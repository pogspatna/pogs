const { google } = require('googleapis');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.auth = null;
    this.initialized = false;
    this.authMode = null;
    
    // Folder mapping for organized storage
    this.folderIds = {
      officeBearers: process.env.GOOGLE_DRIVE_OFFICE_BEARERS_FOLDER_ID,
      newsletters: process.env.GOOGLE_DRIVE_NEWSLETTERS_FOLDER_ID,
      applications: process.env.GOOGLE_DRIVE_APPLICATIONS_FOLDER_ID,
      paymentScreenshots: process.env.GOOGLE_DRIVE_PAYMENT_SCREENSHOTS_FOLDER_ID,
      gallery: process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID,
      events: process.env.GOOGLE_DRIVE_EVENTS_FOLDER_ID,
      notices: process.env.GOOGLE_DRIVE_NOTICES_FOLDER_ID,
      root: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || process.env.GOOGLE_DRIVE_FOLDER_ID
    };
  }

  getEnv(name) {
    const value = process.env[name];
    return typeof value === 'string' ? value.trim() : '';
  }

  hasServiceAccountCredentials() {
    return Boolean(this.getEnv('GOOGLE_DRIVE_CLIENT_EMAIL') && this.getEnv('GOOGLE_DRIVE_PRIVATE_KEY'));
  }

  hasOAuthCredentials() {
    return Boolean(
      this.getEnv('GOOGLE_DRIVE_CLIENT_ID') &&
      this.getEnv('GOOGLE_DRIVE_CLIENT_SECRET') &&
      this.getEnv('GOOGLE_DRIVE_REFRESH_TOKEN')
    );
  }

  async initializeWithServiceAccount() {
    const clientEmail = this.getEnv('GOOGLE_DRIVE_CLIENT_EMAIL');
    const privateKey = this.getEnv('GOOGLE_DRIVE_PRIVATE_KEY').replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      throw new Error('Missing service account credentials');
    }

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
    await this.drive.about.get({ fields: 'user' });
    this.authMode = 'service_account';
  }

  async initializeWithOAuth() {
    const clientId = this.getEnv('GOOGLE_DRIVE_CLIENT_ID');
    const clientSecret = this.getEnv('GOOGLE_DRIVE_CLIENT_SECRET');
    const refreshToken = this.getEnv('GOOGLE_DRIVE_REFRESH_TOKEN').replace(/\s/g, '');
    const redirectUri = this.getEnv('GOOGLE_DRIVE_REDIRECT_URI') || 'https://developers.google.com/oauthplayground';

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing OAuth credentials');
    }

    this.auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    this.auth.setCredentials({
      refresh_token: refreshToken
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
    await this.drive.about.get({ fields: 'user' });
    this.authMode = 'oauth';
  }

  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      const type = this.getEnv('GOOGLE_DRIVE_TYPE').toLowerCase();
      const hasServiceAccount = this.hasServiceAccountCredentials();
      const hasOAuth = this.hasOAuthCredentials();

      const strategyOrder = [];
      if (type === 'service_account') {
        strategyOrder.push('service_account', 'oauth');
      } else if (type === 'oauth') {
        strategyOrder.push('oauth', 'service_account');
      } else if (hasServiceAccount) {
        strategyOrder.push('service_account', 'oauth');
      } else {
        strategyOrder.push('oauth', 'service_account');
      }

      let lastError = null;

      for (const strategy of strategyOrder) {
        try {
          if (strategy === 'service_account') {
            if (!hasServiceAccount) {
              continue;
            }
            await this.initializeWithServiceAccount();
          } else {
            if (!hasOAuth) {
              continue;
            }
            await this.initializeWithOAuth();
          }

          this.initialized = true;
          console.log(`Google Drive service initialized successfully with ${this.authMode}`);
          return true;
        } catch (error) {
          lastError = error;
          console.error(`Google Drive ${strategy} initialization failed:`, error.message);
        }
      }

      if (!hasServiceAccount && !hasOAuth) {
        console.error(
          'Google Drive: Missing credentials. Configure service account (GOOGLE_DRIVE_CLIENT_EMAIL, GOOGLE_DRIVE_PRIVATE_KEY) or OAuth (GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN).'
        );
      }

      if (lastError && lastError.message === 'invalid_grant') {
        console.error('Google Drive OAuth refresh token is invalid or expired. Rotate GOOGLE_DRIVE_REFRESH_TOKEN or switch GOOGLE_DRIVE_TYPE=service_account.');
      }

      return false;
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
        case 'notice':
          targetFolderId = this.folderIds.notices || this.folderIds.root;
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
      if (!this.initialized) {
        const success = await this.initialize();
        if (!success) {
          return false;
        }
      }

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
