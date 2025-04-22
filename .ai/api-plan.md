# REST API Plan

## 1. Resources

- **Users**: Represents application users. Although user management (registration, login) is handled by Supabase Auth, user details (e.g., id, email) are used for resource association and security via Row-Level Security (RLS).
- **Corrections**: Maps to the `corrections` table. Each correction record stores the original text, the approved (corrected) text, the correction style (either 'formal' or 'natural'), and metadata such as creation timestamp. An index on `user_id` and `created_at` supports efficient filtering and sorting.
- **UserSettings**: Maps to the `user_settings` table. This resource stores the default correction style preference for each user.

## 2. Endpoints

### A. Corrections

#### 1. Create Correction

- **Method**: POST
- **URL**: `/api/corrections`
- **Description**: Submits a new text correction request. If the `correction_style` is not provided, the system uses the user's default setting.
- **Request Query Parameters**: None
- **Request JSON Payload**:
  ```json
  {
    "original_text": "string (max 2000 characters)",
    "correction_style": "string (either 'formal' or 'natural', required)"
  }
  ```
- **Response JSON (201 Created)**:
  ```json
  {
    "id": "UUID",
    "user_id": "UUID",
    "original_text": "...",
    "approved_text": "Corrected text",
    "correction_style": "formal | natural",
    "created_at": "timestamp"
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request (e.g., text too long or invalid style), 401 Unauthorized

#### 2. Get Corrections List

- **Method**: GET
- **URL**: `/api/corrections`
- **Description**: Retrieves a paginated list of corrections created by the authenticated user.
- **Query Parameters**:
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of records per page
  - `sort` (optional): Sort order (e.g., by `created_at`)
- **Response JSON (200 OK)**:
  ```json
  [
    {
      "id": "UUID",
      "user_id": "UUID",
      "original_text": "...",
      "approved_text": "...",
      "correction_style": "formal | natural",
      "created_at": "timestamp"
    }
  ]
  ```
- **Error Codes**: 401 Unauthorized

#### 3. Get Correction Detail

- **Method**: GET
- **URL**: `/api/corrections/{id}`
- **Description**: Retrieves detailed information for a specific correction.
- **Response JSON (200 OK)**:
  ```json
  {
    "id": "UUID",
    "user_id": "UUID",
    "original_text": "...",
    "approved_text": "...",
    "correction_style": "formal | natural",
    "created_at": "timestamp"
  }
  ```
- **Error Codes**: 401 Unauthorized, 404 Not Found

#### 4. Generate Correction Proposal

- **Method**: POST
- **URL**: `/api/corrections/generate`
- **Description**: Generates a new proposed text. In cases where the user is dissatisfied with the initial output it accepts denied_proposed_text for more context how to regenerate the proposal. It returns educational_comment what was improved or what mistakes were made in original_text.
- **Request JSON Payload**:
  ```json
  {
    "original_text": "...",
    "denied_proposed_text": "...",
    "correction_style": "formal | natural"
  }
  ```
- **Response JSON (200 OK)**:
  ```json
  {
    "original_text": "...",
    "proposed_text": "New proposed text with comments",
    "correction_style": "formal | natural",
    "educational_comment": "..."
  }
  ```
- **Notes**: Rate limiting should be applied to prevent abuse of the generation functionality.
- **Error Codes**: 400 Bad Request, 401 Unauthorized

#### 5. Delete Correction

- **Method**: DELETE
- **URL**: `/api/corrections/{id}`
- **Description**: Deletes a correction record from the history.
- **Response JSON (200 OK)**:
  ```json
  { "message": "Correction deleted successfully." }
  ```
- **Error Codes**: 401 Unauthorized, 404 Not Found

### B. UserSettings

#### 1. Get User Settings

- **Method**: GET
- **URL**: `/api/user-settings`
- **Description**: Retrieves the authenticated user's settings.
- **Response JSON (200 OK)**:
  ```json
  {
    "user_id": "UUID",
    "default_correction_style": "formal | natural"
  }
  ```
- **Error Codes**: 401 Unauthorized

#### 2. Update User Settings

- **Method**: PUT
- **URL**: `/api/user-settings`
- **Description**: Updates the user's default correction style. The payload must pass validation (allowed values: 'formal' or 'natural').
- **Request JSON Payload**:
  ```json
  {
    "default_correction_style": "formal | natural"
  }
  ```
- **Response JSON (200 OK)**:
  ```json
  {
    "user_id": "UUID",
    "default_correction_style": "formal | natural"
  }
  ```
- **Error Codes**: 400 Bad Request, 401 Unauthorized

## 3. Authentication and Authorization

- **Authentication**: All endpoints require a valid JWT token issued by Supabase Auth. Tokens must be provided in the `Authorization` header as a Bearer token.
- **Authorization**: The API enforces that a user can only access or modify their own resources. Database Row-Level Security (RLS) policies ensure that `user_id` matches the authenticated user (e.g., via `current_setting('request.jwt.claim.sub')`).
- **Error Handling**: Endpoints return 401 Unauthorized when authentication fails and 403 Forbidden when access is not allowed.

## 4. Validation and Business Logic

- **Input Validation**:
  - `original_text` must be a string with a maximum of 2000 characters.
  - `correction_style` must be either 'formal' or 'natural'.
- **Business Logic Mapping**:
  - **Saving Text Correction (US-001)**: Saving a correction (`POST /api/corrections`) returns the corrected text.
  - **Generation (US-002)**: The generation endpoint (`POST /api/corrections/generate`) allows users to request a new version of the corrected text if they are unsatisfied with the initial output.
  - **History Management (US-003)**: Accepted corrected texts can be retrieved (GET endpoints) or deleted (DELETE endpoint) by the user.
  - **User Settings (US-004)**: Endpoints for retrieving and updating user settings ensure that the user's default correction style is respected in subsequent operations.
- **Performance Considerations**:
  - Use of indexed columns (`user_id`, `created_at`) in the `corrections` table supports efficient querying for history and sorting.
  - Rate limiting, especially on the regeneration endpoint, is recommended to maintain system performance and prevent abuse.

## Additional Considerations

- **Tech Stack Alignment**: This API plan aligns with the Next.js 15 App Router, TypeScript 5, and Tailwind CSS 4 stack. API routes in the `/src/app/api` directory will be implemented following these principles.
- **Security Measures**: Beyond authentication and RLS, standard security practices like input sanitization, error handling, and rate limiting will be enforced.
- **Extensibility**: The endpoints are designed to be extensible. Future features (such as detailed educational commentary or additional user profile management endpoints) can be integrated with minimal disruption. 