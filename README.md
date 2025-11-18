# BMW Aptitude Test Project - Electric Car Data (Full Stack)

This project is a starter template for the BMW aptitude test assignment.

It includes:

- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: React (Vite), AG Grid, MUI
- Generic DataGrid with an **Actions** column (View + Delete)
- Detail page with **Back** navigation

## 1. Requirements

Install these tools on your machine:

- **Node.js** (>= 18)
- **npm** (comes with Node)
- **MySQL Server** (>= 8.x)
- A code editor (VS Code recommended)

## 2. Backend Setup

```bash
cd backend
npm install
```


```bash
cp .env .env
```


### 2.1 Create Database & Table

Open MySQL and run:

```sql
SOURCE SQL/schema.sql;
```

This will create the `bmw_electric_cars` database and `cars` table.

### 2.2 Import CSV Data

Place  `BMW_Aptitude_Test_Test_Data_ElectricCarData.csv` file on the MySQL server and edit the path in:


Then in MySQL:

```sql
SOURCE SQL/load_data.sql;
```

Alternatively, import via any GUI tool (MySQL Workbench, phpMyAdmin).

### 2.3 Run Backend

```bash
cd backend
npm run dev   # or: npm start
```

Backend runs on: `http://localhost:4000`

Endpoints:

- `GET /api/cars` – list with pagination, search, filters
- `GET /api/cars/:id` – detail
- `DELETE /api/cars/:id` – delete

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

The grid talks to the backend at `http://localhost:4000/api` (config inside the code).

## 4. Notes

- AG Grid is used via `GenericDataGrid` component with a default **Actions** column.
- MUI is used for layout (AppBar, Container, Button, etc.).
- We can extend filtering and column definitions to fully match the assignment.
