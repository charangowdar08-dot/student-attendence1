# student-attendence1
website
>>>>>>> 256ad1e742038ef198a2c00d35ae736b197f2ae3
# Student Attendance Management System

A comprehensive web-based Student Attendance Management System built with Node.js, Express, MongoDB, and vanilla JavaScript. This system provides complete CRUD operations for student management and daily attendance tracking with monthly reporting capabilities.

## Features

✨ **Student Management**
- Add new students with details (Name, Roll Number, Email, Class, Phone)
- View all students in a tabular format
- Update student information
- Delete students

📊 **Attendance Tracking**
- Mark daily attendance (Present/Absent) for each student
- View attendance by date
- Automatic duplicate prevention (one record per student per day)
- Update attendance if already marked

📈 **Monthly Reports**
- Generate comprehensive monthly attendance reports
- View attendance statistics: Present days, Absent days, Total days
- Calculate attendance percentage for each student
- Color-coded percentage indicators (Green: ≥75%, Red: <75%)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Additional**: dotenv for environment variables, CORS for cross-origin requests

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. MongoDB will typically install to `C:\Program Files\MongoDB\Server\{version}\bin`
4. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

**Alternative - MongoDB Atlas (Cloud):**
If you prefer cloud database, use MongoDB Atlas:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `.env` file with your Atlas connection string

### 2. Clone or Setup Project

Navigate to your project directory:
```powershell
cd "c:\Users\navad\OneDrive\Documents\student attence management"
```

### 3. Install Dependencies

```powershell
npm install
```

This will install:
- express
- mongoose
- cors
- dotenv
- nodemon (dev dependency)

### 4. Configure Environment Variables

The `.env` file is already created with default settings:
```
MONGODB_URI=mongodb://localhost:27017/student_attendance
PORT=3000
```

**If using MongoDB Atlas**, update `MONGODB_URI` to your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student_attendance
PORT=3000
```

### 5. Start MongoDB (Local Installation)

Make sure MongoDB is running:
```powershell
# Check if MongoDB service is running
net start MongoDB
```

## Running the Application

### Start the Server

**Production mode:**
```powershell
npm start
```

**Development mode (with auto-restart):**
```powershell
npm run dev
```

You should see:
```
Server is running on port 3000
Open http://localhost:3000 in your browser
Connected to MongoDB
```

### Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Usage Guide

### Managing Students

1. **Add a Student:**
   - Navigate to the "Students" tab (default)
   - Fill in the student form with required details
   - Click "Add Student"

2. **Edit a Student:**
   - In the students list, click the "Edit" button
   - Update the information in the form
   - Click "Update Student"

3. **Delete a Student:**
   - Click the "Delete" button next to the student
   - Confirm the deletion

### Marking Attendance

1. **Daily Attendance:**
   - Click on the "Mark Attendance" tab
   - Select the date (defaults to today)
   - Mark each student as "Present" or "Absent"
   - Attendance is saved automatically

2. **Update Attendance:**
   - Select the same date
   - Change the status by clicking the appropriate button
   - The system will update the existing record

### Generating Reports

1. **Monthly Report:**
   - Click on the "Monthly Report" tab
   - Select the year and month
   - Click "Generate Report"
   - View attendance statistics for all students

## API Endpoints

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Attendance API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark/Update attendance |
| GET | `/api/attendance` | Get all attendance (paginated) |
| GET | `/api/attendance/date/:date` | Get attendance by date |
| GET | `/api/attendance/student/:id` | Get student's attendance history |
| GET | `/api/attendance/report/:year/:month` | Generate monthly report |

## Project Structure

```
student attence management/
├── models/
│   ├── Student.js          # Student schema
│   └── Attendance.js       # Attendance schema
├── routes/
│   ├── students.js         # Student CRUD routes
│   └── attendance.js       # Attendance routes
├── public/
│   ├── index.html          # Main HTML file
│   ├── script.js           # Frontend JavaScript
│   └── styles.css          # CSS styling
├── .env                    # Environment variables
├── server.js               # Express server setup
├── package.json            # Project dependencies
└── README.md              # This file
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError: connect ECONNREFUSED"**
- Ensure MongoDB service is running: `net start MongoDB`
- Check if MongoDB is installed correctly
- Verify the connection string in `.env`

### Port Already in Use

**Error: "EADDRINUSE: address already in use"**
- Change the PORT in `.env` file to a different port (e.g., 3001)
- Or stop the process using port 3000

### Cannot GET /api/students

- Make sure the server is running
- Check the browser console for CORS errors
- Verify the API_URL in `script.js` matches your server URL

## Development Notes

- The system prevents duplicate attendance records for the same student on the same date
- Student roll numbers must be unique
- Attendance percentage is calculated as: (Present Days / Total Days) × 100
- All dates are stored without time information (normalized to midnight)

## Future Enhancements

Potential features for future versions:
- User authentication and authorization
- Class-wise attendance filtering
- Export reports to PDF/Excel
- SMS/Email notifications for low attendance
- Graphical charts and visualizations
- Bulk student import via CSV
- Leave request management

## License

ISC

## Author

Created as a Student Attendance Management System

---

**Need Help?** If you encounter any issues, please check:
1. MongoDB is running
2. All dependencies are installed (`npm install`)
3. Environment variables are set correctly
4. Node.js version is compatible (v14+)

For questions or support, please refer to the documentation or create an issue in the project repository.
=======
# student-attendence1
website
>>>>>>> 256ad1e742038ef198a2c00d35ae736b197f2ae3
