# Assist Me - Backend API Documentation

Welcome to the backend service for **Assist Me**, an elder assistance and care coordination platform.

---

## 🚀 Quick Start

### Option 1: One-Click Windows Launcher
Double-click [`start_backend.bat`](file:///c:/Users/Vedaanshu/OneDrive/Assist%20me/start_backend.bat).

### Option 2: Command Line
```powershell
python run_backend.py
```

The server will start on **`http://localhost:5000`**.

---

## 🧪 Running Automated Tests

Run the comprehensive unit and integration test suite:

```powershell
python backend/test_backend.py
```

---

## 📡 REST API Reference

### 1. Health & Discovery
- **`GET /`**: API index, status, and active endpoint list.
- **`GET /api/health`**: Health status and DB connectivity.
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "version": "1.0.0"
  }
  ```

---

### 2. Help Requests Lifecycle
- **`GET /api/requests`**: Retrieve all requests. Supports `?status=` and `?limit=` query params.
- **`GET /api/requests/active`**: Retrieve the currently active ongoing request.
- **`GET /api/requests/history`**: Retrieve past completed or rejected requests.
- **`GET /api/requests/<id>`**: Retrieve a specific request.
- **`POST /api/requests`**: Create a new help request.
  ```json
  {
    "title": "Groceries",
    "description": "Milk and bread from corner store",
    "category": "groceries",
    "elder": "Mary",
    "family": "Sarah",
    "helper": "Alex",
    "estimatedCost": 280.0
  }
  ```
- **`PATCH /api/requests/<id>/status`**: Advance workflow status.
  ```json
  {
    "status": "approved",       // options: 'approved', 'accepted', 'on_the_way', 'picked_up', 'completed', 'rejected'
    "rejectReason": "Optional reason if rejected",
    "performedBy": "Sarah"
  }
  ```
- **`PATCH /api/requests/<id>`**: Update request fields.
- **`POST /api/requests/clear`**: Clear / archive current active request.
- **`DELETE /api/requests/<id>`**: Delete a request.

---

### 3. Natural Language Transcript Parser & Safety
- **`POST /api/parse`**: Parse voice or text input into structured request fields and check medicine safety.
  ```json
  // Request
  {
    "text": "I need my blood pressure pills please"
  }

  // Response
  {
    "category": "medicine",
    "title": "Medicine",
    "description": "My blood pressure pills",
    "estimatedCost": 250.0,
    "isMedicine": true,
    "needsSafetyReview": true,
    "raw": "I need my blood pressure pills please"
  }
  ```

---

### 4. Users & Dashboard Statistics
- **`GET /api/users`**: List profiles for Elder (Mary), Family (Sarah), and Helper (Alex).
- **`GET /api/users/<role>`**: Get profile for specific role (`elder`, `family`, `helper`).
- **`GET /api/stats`**: Aggregate metrics across the system.
  ```json
  {
    "totalRequests": 12,
    "activeCount": 1,
    "completedDeliveries": 9,
    "pendingFamily": 1,
    "pendingHelper": 1,
    "rejectedCount": 1,
    "totalDeliveredValue": 2450.0
  }
  ```

---

## 🗄️ Database Architecture

The backend utilizes an embedded **SQLite** database (`backend/assist_me.db`) with tables:
- **`requests`**: Help request records with full state tracking and cost details.
- **`users`**: Profiles for Elder, Family, and Helper.
- **`activity_log`**: Audit trail of request creation and status transitions.
