import React from 'react';
import { Code, Server, Database, Shield, User, CheckSquare, FileText, AlertCircle } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  body?: string;
  response?: string;
  errors?: string;
}

// Data Models
const USER_OBJECT = `{
  "id": "string (UUID)",
  "email": "string (email format)",
  "name": "string",
  "createdAt": "string (ISO date)",
  "avatar": "string (URL) | null"
}`;

const TASK_OBJECT = `{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "status": "todo" | "in-progress" | "done",
  "createdAt": "string (ISO date)",
  "deadline": "string (ISO date) | null",
  "userId": "string (UUID)"
}`;

const ERROR_RESPONSE = `{
  "success": false,
  "message": "string (error description)",
  "errors": "object | null (validation errors)"
}`;

const endpoints: { category: string; icon: React.ReactNode; endpoints: Endpoint[] }[] = [
  {
    category: 'Authentication',
    icon: <Shield className="w-5 h-5" />,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        auth: false,
        body: `{
  "name": "string (min: 2, max: 50)",
  "email": "string (valid email format)",
  "password": "string (min: 6 characters)"
}`,
        response: `{
  "success": true,
  "message": "User registered successfully",
  "user": ${USER_OBJECT},
  "token": "string (JWT token)"
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}

409 Conflict:
{
  "success": false,
  "message": "User with this email already exists"
}`
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login with email and password',
        auth: false,
        body: `{
  "email": "string (valid email format)",
  "password": "string"
}`,
        response: `{
  "success": true,
  "message": "Login successful",
  "user": ${USER_OBJECT},
  "token": "string (JWT token)"
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}

401 Unauthorized:
{
  "success": false,
  "message": "Invalid email or password"
}`
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout current user (invalidate token)',
        auth: true,
        response: `{
  "success": true,
  "message": "Logged out successfully"
}`,
        errors: `401 Unauthorized:
{
  "success": false,
  "message": "Invalid or expired token"
}`
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current authenticated user profile',
        auth: true,
        response: `{
  "success": true,
  "user": ${USER_OBJECT}
}`,
        errors: `401 Unauthorized:
{
  "success": false,
  "message": "Invalid or expired token"
}`
      }
    ]
  },
  {
    category: 'User Management',
    icon: <User className="w-5 h-5" />,
    endpoints: [
      {
        method: 'PUT',
        path: '/api/users/profile',
        description: 'Update user profile information (name, email)',
        auth: true,
        body: `Content-Type: application/json
{
  "name": "string (min: 2, max: 50) | optional",
  "email": "string (valid email format) | optional"
}`,
        response: `{
  "success": true,
  "message": "Profile updated successfully",
  "user": ${USER_OBJECT}
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}

409 Conflict:
{
  "success": false,
  "message": "Email already in use"
}`
      },
      {
        method: 'POST',
        path: '/api/users/avatar',
        description: 'Upload user avatar image',
        auth: true,
        body: `Content-Type: multipart/form-data
{
  "avatar": "File (image formats: jpg, png, gif, max: 5MB)"
}`,
        response: `{
  "success": true,
  "message": "Avatar uploaded successfully",
  "user": ${USER_OBJECT}
}`,
        errors: `400 Bad Request:
{
  "success": false,
  "message": "Invalid file format or size too large"
}

413 Payload Too Large:
{
  "success": false,
  "message": "File size exceeds 5MB limit"
}`
      },
      {
        method: 'PUT',
        path: '/api/users/password',
        description: 'Change user password',
        auth: true,
        body: `{
  "currentPassword": "string",
  "newPassword": "string (min: 6 characters)"
}`,
        response: `{
  "success": true,
  "message": "Password updated successfully"
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}

401 Unauthorized:
{
  "success": false,
  "message": "Current password is incorrect"
}`
      }
    ]
  },
  {
    category: 'Task Management',
    icon: <CheckSquare className="w-5 h-5" />,
    endpoints: [
      {
        method: 'GET',
        path: '/api/tasks',
        description: 'Get all tasks for authenticated user (current sprint)',
        auth: true,
        response: `{
  "success": true,
  "tasks": [
    ${TASK_OBJECT}
  ],
  "totalCount": "number",
  "sprint": {
    "id": "string (UUID)",
    "startDate": "string (ISO date)",
    "endDate": "string (ISO date)",
    "isActive": true
  }
}`,
        errors: `401 Unauthorized:
{
  "success": false,
  "message": "Invalid or expired token"
}`
      },
      {
        method: 'POST',
        path: '/api/tasks',
        description: 'Create a new task',
        auth: true,
        body: `{
  "title": "string (min: 3, max: 100)",
  "description": "string (max: 500) | optional",
  "deadline": "string (ISO date) | null | optional",
  "status": "todo" | "in-progress" | "done" | optional (default: "todo")"
}`,
        response: `{
  "success": true,
  "message": "Task created successfully",
  "task": ${TASK_OBJECT}
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}`
      },
      {
        method: 'PUT',
        path: '/api/tasks/:id',
        description: 'Update an existing task',
        auth: true,
        body: `{
  "title": "string (min: 3, max: 100) | optional",
  "description": "string (max: 500) | optional",
  "deadline": "string (ISO date) | null | optional",
  "status": "todo" | "in-progress" | "done" | optional"
}`,
        response: `{
  "success": true,
  "message": "Task updated successfully",
  "task": ${TASK_OBJECT}
}`,
        errors: `400 Bad Request:
${ERROR_RESPONSE}

404 Not Found:
{
  "success": false,
  "message": "Task not found"
}

403 Forbidden:
{
  "success": false,
  "message": "You don't have permission to update this task"
}`
      },
      {
        method: 'DELETE',
        path: '/api/tasks/:id',
        description: 'Delete a task',
        auth: true,
        response: `{
  "success": true,
  "message": "Task deleted successfully"
}`,
        errors: `404 Not Found:
{
  "success": false,
  "message": "Task not found"
}

403 Forbidden:
{
  "success": false,
  "message": "You don't have permission to delete this task"
}`
      }
    ]
  }
];

export const ApiEndpointsPage: React.FC = () => {
  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 border-green-200',
      POST: 'bg-blue-100 text-blue-800 border-blue-200',
      PUT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      DELETE: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Server className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
            <p className="text-lg text-gray-600 mt-1">Complete backend API reference for TaskFlow application</p>
          </div>
        </div>
        
        {/* Base URL Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <Database className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Base URL</h3>
              <code className="text-base text-blue-800 bg-blue-100 px-3 py-2 rounded-lg font-mono">
                https://your-api-domain.com
              </code>
              <p className="text-sm text-blue-700 mt-3">
                All endpoints should be prefixed with your API base URL. Replace with your actual domain.
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Info */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Authentication</h3>
              <p className="text-sm text-amber-700 mb-3">
                Protected endpoints require JWT Bearer token in Authorization header:
              </p>
              <code className="text-sm bg-amber-100 text-amber-800 px-3 py-2 rounded-lg font-mono block">
                Authorization: Bearer &lt;your-jwt-token&gt;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Data Models */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-indigo-600" />
          Data Models
        </h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Object */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                User Object
              </h3>
            </div>
            <div className="p-6">
              <pre className="text-sm bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                <code className="text-gray-800">{USER_OBJECT}</code>
              </pre>
            </div>
          </div>

          {/* Task Object */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-green-600" />
                Task Object
              </h3>
            </div>
            <div className="p-6">
              <pre className="text-sm bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                <code className="text-gray-800">{TASK_OBJECT}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="space-y-8">
        {endpoints.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-indigo-600">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {category.endpoints.map((endpoint, endpointIndex) => (
                <div key={endpointIndex} className="p-6">
                  {/* Endpoint Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
                        {endpoint.path}
                      </code>
                      {endpoint.auth && (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-lg border border-orange-200">
                          <Shield className="w-4 h-4 mr-1" />
                          Auth Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">{endpoint.description}</p>
                  
                  {/* Request/Response Grid */}
                  <div className="space-y-6">
                    {endpoint.body && (
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <Code className="w-4 h-4 mr-2 text-blue-600" />
                          Request Body
                        </h4>
                        <pre className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-x-auto">
                          <code className="text-gray-800">{endpoint.body}</code>
                        </pre>
                      </div>
                    )}
                    
                    {endpoint.response && (
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <Code className="w-4 h-4 mr-2 text-green-600" />
                          Success Response
                        </h4>
                        <pre className="text-sm bg-green-50 border border-green-200 rounded-lg p-4 overflow-x-auto">
                          <code className="text-gray-800">{endpoint.response}</code>
                        </pre>
                      </div>
                    )}

                    {endpoint.errors && (
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                          Error Responses
                        </h4>
                        <pre className="text-sm bg-red-50 border border-red-200 rounded-lg p-4 overflow-x-auto">
                          <code className="text-gray-800">{endpoint.errors}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Guidelines */}
      <div className="mt-12 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-gray-600" />
          Implementation Guidelines
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">General Requirements</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>All requests and responses must use JSON format with <code className="bg-gray-200 px-1 rounded">Content-Type: application/json</code></p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Implement proper HTTP status codes (200, 201, 400, 401, 403, 404, 409, 413, 500)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Use JWT tokens for authentication with appropriate expiration times (recommended: 24h)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Implement comprehensive input validation and sanitization for all endpoints</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Security & Performance</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Add rate limiting to prevent abuse (recommended: 100 requests per minute per IP)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Configure CORS properly for production deployment</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Hash passwords using bcrypt with salt rounds ≥ 12</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <p>Implement database indexing on frequently queried fields (userId, email, createdAt)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};