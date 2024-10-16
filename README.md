# medusa-google-storage

A Medusa.js storage plugin that supports Google Cloud Storage for storing all images.

## Use Case

This plugin allows you to use Google Cloud Storage as the file storage solution for your Medusa.js e-commerce application. It's particularly useful when you want to leverage Google's robust and scalable cloud infrastructure to store and serve your product images and other media files.

## Installation

To install the plugin, run the following command in your Medusa project:

```bash
npm install medusa-google-storage
```

## Configuration

### 1. Update medusa-config.js

Add `medusa-google-storage` to the plugins array in your `medusa-config.js` file:

```javascript
const plugins = [
  // ... other plugins
  `medusa-google-storage`,
]
```

### 2. Set up environment variables

Add the following variables to your `.env` file:

```
GCP_BUCKET_NAME=your_bucket_name
GCP_PROJECT_ID=your_project_id
GCP_CLIENT_EMAIL=your_client_email
GCP_PRIVATE_KEY=your_private_key
GCP_DIRECTORY=optional_directory_name
```

- `GCP_BUCKET_NAME`: The name of your Google Cloud Storage bucket
- `GCP_PROJECT_ID`: Your Google Cloud project ID
- `GCP_CLIENT_EMAIL`: The client email from your Google Cloud service account
- `GCP_PRIVATE_KEY`: The private key from your Google Cloud service account
- `GCP_DIRECTORY`: (Optional) The directory within the bucket where images will be stored. If not provided, images will be stored in the root of the bucket.

## Usage

Once installed and configured, the plugin will automatically handle file uploads to Google Cloud Storage. You don't need to change any of your existing file upload code in your Medusa.js application.

## Notes

- Ensure that your Google Cloud service account has the necessary permissions to read from and write to the specified bucket.
- Keep your Google Cloud credentials secure and never commit them directly to your repository.
- If you're using version control, remember to add your `.env` file to `.gitignore`.

## Support

For any issues or questions, please open an issue in the GitHub repository or contact the plugin maintainer.