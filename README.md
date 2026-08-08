# Currency Exchange System

A currency exchange management system developed using **Spring Boot** and **React.js**.

The system is designed for a currency exchange office and provides currency exchange, customer management, wallet management, remittance, borrowing/returning transactions, reporting the profit, user authentication, and data synchronization with a central server.

## Features

* Currency exchange
* Customer management
* Customer transaction management
* Wallet management
* Wallet transactions
* Remittance management
* Borrowed and returned transactions
* Reporting the profit
* Customer exchange transactions
* Owner exchange transactions
* Company/office information management
* Backup and restore section
* User authentication
* JWT-based security
* Password encryption using BCrypt
* Data synchronization with a central server
* React frontend served by Spring Boot
* Windows installer

## Technologies

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Spring Security
* JWT
* Maven
* MySQL

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Bootsrap 5

### Deployment

* Spring Boot executable JAR
* Inno Setup
* Windows

## Project Structure

```text
currency-exchange-system/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React.js application
│
├── installer/
│   └── Inno Setup configuration
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

## Application Screenshots

### Login

### Dashboard

Additional application screenshots can be found in the `docs/screenshots` directory.

## Frontend and Backend Integration

The frontend is developed separately using React.js.

For production deployment, the React application is built using:

```bash
npm run build
```

The generated `dist` files are then copied into the Spring Boot application's static resources.

The Spring Boot application can then serve the React frontend together with the backend API.

## Production Build Process

The production application is built using the following process:

```text
React.js
    │
    │ npm run build
    ▼
React dist/
    │
    │ Copy generated files
    ▼
Spring Boot static/
    │
    │ mvn clean package
    ▼
Spring Boot JAR
    │
    │ Inno Setup
    ▼
Windows Installer
```

## Backend Build

From the backend directory:

```bash
mvn clean package
```

The generated executable JAR is created in:

```text
backend/target/
```

The generated JAR is not committed to the Git repository.

## Synchronization

The system includes one-way data synchronization between a local currency exchange installation and a central server.

The synchronization mechanism uses entity identifiers such as UUIDs and synchronization-related fields to determine which records need to be synchronized.

The synchronization architecture and implementation details will be documented separately.

## Windows Installer

The Windows installer is created using **Inno Setup**.

The Inno Setup script is located in:

```text
installer/
```

The generated installer executable is not committed to the source repository.

## Documentation

Additional documentation and application screenshots are available in:

```text
docs/
```

## Security

Sensitive configuration values such as database passwords, JWT secrets, and other private credentials should not be committed to the repository.

A production configuration file should be provided separately when deploying the application.
