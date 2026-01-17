## Overview

Node.js Express HTTP API Server.

Build just the specified features exactly - no additions.

Output all source code in single file: `index.js`.

You may install dependencies using `npm install`.

All tests in `api.test.js` should pass.

## Environment Variables

* `PORT` - default: `3000`
* `POSTGRES_URI` - default: `postgres://postgres:password@localhost:5432/postgres`

## Authentication

Use JWT for authentication in header without prefix.

Example header: `Authorization: xxxx.yyyy.zzzz`

## Endpoints

All endpoints should validate JSON inputs (if present).

### Health

```
GET /
```

Should return 200 with empty body.

### Registration

```
POST /api/users
{
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a [UserDTO](#UserDTO)

Required fields: `email`, `username`, `password`

Email should be valid.

## DTOs

### UserDTO

```json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}
```

## Status Codes

Only one of the following response status codes are allowed:

### 200 - Success
### 401 - Unauthorized
### 404 - Not found
### 422 - Unprocessable Entity
Should return errors in the following format:
```json
{
  "errors": [
    {
      "path": "",
      "message": ""
    }
  ]
}
```
