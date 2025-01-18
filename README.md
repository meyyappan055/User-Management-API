# User Management API

A robust and scalable API built with Node.js, Express, MongoDB, and JWT authentication. This API supports user registration, login, and management features, including profile updates, deactivation, and super admin functionality.


 ## Features

- [x] **User Registration**: Create an account with a name, email, password, and phone number.
- [x] **User Login**: Authenticate users with email and password using JWT.
- [x] **Profile Management**: View and update user details.
- [x] **Account Deactivation**: Temporarily deactivate user accounts without permanent deletion.
- [x] **Super Admin**: Access all user data with enhanced privileges.
- [x] **Secure Authentication**: Passwords are encrypted using bcrypt, and JWT ensures secure sessions.


## Tools used

- **Express.js**
- **MongoDB**
- **Mongoose(ODM)**
- **bcrypt.js**
- **JSON Web Tokens (JWT)**
- **Postman**
   

## API Documentation
### **User Routes**

#### `POST /api/register`

**Description**: Registers a new user.

- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "yourpassword",
    "phoneNumber": "1234567890"
  }

#### `POST /api/login`

**Description**: Logs in a user and generates a JWT token.

- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }


### `GET /api/user`
> [!NOTE]  
> This route requires a JWT Token

**Description**:Retrieves user details by email (accessible by Super Admin only).

- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }

- **Headers**:
  Authorization : jwt-token

### `PATCH /api/user`

**Description**: Updates user details.

- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com"
    "phoneNumber": "1234567890"
  }

 ### `PATCH /api/user/:id`

**Description**: Updates user details by user ID.

- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "phoneNumber": "9876543210"
  }


 ### `PATCH /api/user/deactivate`

**Description**: Deactivates a user account.

- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }



## How to Run

### Setup Instructions

1. **Clone the repository** 

    ```bash
    git clone https://github.com/meyyappan055/User-Management-API.git
    ```

1. **Install Dependencies**
   Run the following command to install all necessary dependencies:
   ```bash
   npm install

2. **Environment Variables**
   Create a `.env` file in the root directory with the following content:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/user-management?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key

3. **Run the Application**
   Use **nodemon** to start the application in development mode.
   Run the following command:
   ```bash
   cd src
   nodemon app.js
