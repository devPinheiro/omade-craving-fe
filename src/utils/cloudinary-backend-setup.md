# Cloudinary Backend Setup for Secure Uploads

## Overview
The CloudinaryUploader component requires a backend endpoint to generate signed upload parameters for security. This prevents exposing your Cloudinary API secret in the frontend.

## Required Backend Endpoint

### Endpoint: `POST /api/cloudinary/sign`

**Request Body:**
```json
{
  "upload_preset": "products",
  "folder": "products"
}
```

**Response:**
```json
{
  "signature": "generated_signature_hash",
  "timestamp": 1640995200,
  "api_key": "your_cloudinary_api_key",
  "upload_preset": "products",
  "folder": "products"
}
```

## Implementation Examples

### Node.js/Express Example
```javascript
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (do this once in your app)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post('/api/cloudinary/sign', (req, res) => {
  const { upload_preset, folder } = req.body;
  const timestamp = Math.round(Date.now() / 1000);
  
  // Parameters to sign (exclude file and api_key)
  const params = {
    timestamp: timestamp,
    upload_preset: upload_preset,
    folder: folder
  };
  
  // Create signature
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  
  res.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    upload_preset,
    folder
  });
});
```

### Next.js API Route Example
```typescript
// pages/api/cloudinary/sign.ts or app/api/cloudinary/sign/route.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  const { upload_preset, folder } = await request.json();
  const timestamp = Math.round(Date.now() / 1000);
  
  const params = {
    timestamp: timestamp,
    upload_preset: upload_preset,
    folder: folder
  };
  
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  
  return Response.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    upload_preset,
    folder
  });
}
```

## Environment Variables
Add these to your backend environment:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Cloudinary Upload Preset Setup
1. Go to your Cloudinary console
2. Navigate to Settings > Upload
3. Create a new upload preset named "products"
4. Configure the preset:
   - **Mode:** Signed
   - **Folder:** products (or leave empty if you want to specify in the upload)
   - **Access Mode:** Public
   - **Resource Type:** Image
   - **Format:** Auto
   - **Quality:** Auto
   - Add any transformations you want applied automatically

## Security Notes
- Never expose your `CLOUDINARY_API_SECRET` in frontend code
- The signature is generated server-side using your secret key
- Each upload request gets a unique timestamp and signature
- Signatures expire after a short time for additional security

## Testing the Endpoint
You can test your endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/cloudinary/sign \
  -H "Content-Type: application/json" \
  -d '{"upload_preset": "products", "folder": "products"}'
```

## Frontend Integration
The CloudinaryUploader component will automatically call this endpoint before each upload. Make sure your backend is running and the endpoint is accessible from your frontend domain.

## Troubleshooting
- **401 Unauthorized:** Check your Cloudinary credentials
- **Invalid signature:** Ensure the parameters match exactly between sign and upload
- **CORS errors:** Configure CORS to allow requests from your frontend domain
- **Upload preset not found:** Create the preset in your Cloudinary console