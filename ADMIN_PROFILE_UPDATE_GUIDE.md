# Admin Profile Update Feature

## Overview
The Admin Profile Update feature allows administrators to manage their personal profile information through a dedicated interface in the admin dashboard.

## Features Implemented

### Frontend Components
- **UpdateProfile.jsx**: Main profile update component located in `client/src/pages/admin/`
- **Navigation Integration**: Added profile link to admin sidebar navigation
- **Route Configuration**: Added `/admin/profile` route to the application

### Backend Implementation
- **Admin Profile Routes**: Added dedicated endpoints for admin profile management
  - `GET /api/admin/profile` - Get current admin profile
  - `PUT /api/admin/profile` - Update current admin profile
- **Controller Methods**: Added `getAdminProfile` and `updateAdminProfile` methods
- **Model Updates**: Added `bio` field to Admin model

### Key Features
1. **Profile Image Upload**
   - Cloudinary integration for image storage
   - Image preview before upload
   - Automatic upload on file selection
   - 5MB file size limit
   - Supports JPG, PNG, GIF formats

2. **Form Fields**
   - Full Name (required)
   - Email Address (read-only)
   - Phone Number
   - Address
   - Bio/Description (textarea)

3. **User Experience**
   - Real-time form validation
   - Loading states during operations
   - Success/error notifications using toast system
   - Reset functionality to revert changes
   - Responsive design with Shadcn UI components

## Usage Instructions

### For Administrators
1. Log in to the admin dashboard
2. Navigate to "Profile" in the sidebar menu
3. Update your information in the form fields
4. Upload a new profile picture by clicking "Change Picture"
5. Click "Update Profile" to save changes
6. Use "Reset" to revert unsaved changes

### Technical Details

#### API Endpoints
```
GET /api/admin/profile
- Headers: Authorization: Bearer <token>
- Returns: Admin profile data

PUT /api/admin/profile
- Headers: Authorization: Bearer <token>, Content-Type: application/json
- Body: { name, phone, address, bio }
- Returns: Updated admin profile

POST /api/profile/upload-image
- Headers: Authorization: Bearer <token>
- Body: FormData with profileImage file
- Returns: Updated profile with image URL
```

#### Security Features
- JWT authentication required
- Role-based authorization (admin only)
- Email and role fields are protected from updates
- File type and size validation for uploads

#### Database Schema Updates
Added `bio` field to Admin model:
```javascript
{
  bio: String
}
```

## File Structure
```
client/src/pages/admin/UpdateProfile.jsx    # Main component
client/src/App.jsx                          # Route configuration
client/src/layouts/AdminLayout.jsx          # Navigation updates
server/routes/admin.js                      # Admin routes
server/controllers/adminController.js       # Controller methods
server/models/Admin.js                      # Model updates
```

## Dependencies Used
- React Hook Form (for form handling)
- Shadcn UI components (Button, Input, Label, Textarea, Card)
- Toast notifications (for user feedback)
- Cloudinary (for image upload and storage)

## Testing Recommendations
1. Test profile update with valid data
2. Test image upload with different file types and sizes
3. Test form validation with invalid/missing data
4. Test authentication and authorization
5. Test responsive design on different screen sizes
6. Test error handling for network failures

## Future Enhancements
- Add profile picture cropping functionality
- Implement profile completion percentage
- Add profile visibility settings
- Include additional fields like department, title, etc.
- Add profile activity log
