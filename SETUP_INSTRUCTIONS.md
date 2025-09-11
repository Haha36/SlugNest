# Setup Instructions for Add House Form

## Overview

You now have a complete full-stack form setup with:

- **Frontend**: Next.js form component (`AddHouseForm.js`)
- **Backend**: Django REST API endpoints
- **Integration**: Next.js API route that acts as a proxy to Django

## Architecture Explanation

### Option 1: Next.js → Next.js API Route → Django (Current Setup)

```
Frontend Form → /api/houses (Next.js) → Django REST API
```

**Benefits**: Centralized API logic, easier to add authentication, better error handling

### Option 2: Next.js → Django Directly

```
Frontend Form → Django REST API directly
```

**Benefits**: Simpler, fewer hops, faster

Both approaches are valid. The current setup uses Option 1.

## Files Created/Modified

### Frontend Files

1. **`frontend/components/AddHouseForm.js`** - The main form component
2. **`frontend/pages/add-house.js`** - Updated to use the form component
3. **`frontend/pages/api/houses.js`** - Next.js API route (proxy to Django)

### Backend Files

1. **`housing/views.py`** - Added API views (HouseViewSet)
2. **`housing/urls.py`** - Added API routes
3. **`main/settings.py`** - Added CORS and REST framework settings
4. **`requirements.txt`** - Added djangorestframework and django-cors-headers

## How to Test

### 1. Install Django Dependencies

```bash
# In your project root
pip install -r requirements.txt
```

### 2. Run Django Server

```bash
# In project root
python manage.py runserver
# Should run on http://localhost:8000
```

### 3. Run Next.js Server

```bash
# In frontend directory
cd frontend
npm run dev
# Should run on http://localhost:3000
```

### 4. Test the Form

1. Go to `http://localhost:3000/add-house`
2. Fill out the form
3. Submit and check if house is created

### 5. Test API Directly (Optional)

You can test the Django API directly:

```bash
# Get all houses
curl http://localhost:8000/api/houses/

# Create a house
curl -X POST http://localhost:8000/api/houses/ \
  -H "Content-Type: application/json" \
  -d '{
    "rent": 1500.00,
    "beds": 2,
    "baths": 1,
    "square_feet": 1000,
    "address": "123 Test St",
    "description": "Test house",
    "contact": 1234567890
  }'
```

## Available API Endpoints

### Django REST API

- `GET /api/houses/` - List all houses
- `POST /api/houses/` - Create a new house
- `GET /api/houses/{id}/` - Get specific house
- `PUT /api/houses/{id}/` - Update specific house
- `DELETE /api/houses/{id}/` - Delete specific house

### Next.js API Routes

- `GET /api/houses` - Proxies to Django GET /api/houses/
- `POST /api/houses` - Proxies to Django POST /api/houses/

## Form Fields

The form includes all fields from your Django House model:

- Monthly Rent (required)
- Number of Bedrooms (required)
- Number of Bathrooms (required)
- Square Feet (optional)
- Address (required)
- Description (required)
- Contact Number (required)
- More Information URL (optional)

## Troubleshooting

### CORS Issues

If you get CORS errors, make sure:

1. Django server is running on port 8000
2. Next.js server is running on port 3000
3. Both are listed in `CORS_ALLOWED_ORIGINS` in settings.py

### Form Not Submitting

1. Check browser console for errors
2. Check Django server logs
3. Verify API endpoints are working directly

### Module Not Found Errors

Run `pip install -r requirements.txt` to install missing Django packages

## Best Practices Implemented

1. **Separation of Concerns**: Form logic in component, API logic in separate files
2. **Error Handling**: Form shows success/error messages
3. **Validation**: Both frontend (HTML5) and backend (Django) validation
4. **Security**: CORS properly configured, API permissions set
5. **User Experience**: Loading states, form reset on success
6. **Modern React**: Hooks (useState), proper state management

## Next Steps

1. Add authentication to protect the API
2. Add more form validation
3. Add image upload functionality
4. Add form fields for house images
5. Implement edit/delete functionality
6. Add user authentication to the Next.js frontend
