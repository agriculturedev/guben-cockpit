# Guben Cockpit

![Node.js](https://img.shields.io/badge/Node.js-red)
![npm](https://img.shields.io/badge/npm-red)
![react](https://img.shields.io/badge/React-red)
![Docker](https://img.shields.io/badge/Docker-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-red)
![Keycloak](https://img.shields.io/badge/Keycloak-red)
![Nextcloud](https://img.shields.io/badge/Nextcloud-red)
![Masterportal](https://img.shields.io/badge/Masterportal-red)

**Guben Cockpit** is an open-source CMS designed specifically for smart cities. It provides a solutions that allows cities and its citizens to display and manage information through a CMS and its Frontend Counterpart. With an array of displayable information the platofrm can be used flexible to meet individual requirements.

> This Repository contains both the Frontend as well as the Backend of the Application

## Local Setup

Follow these steps to set up the project locally:

### 1. Database Setup
Set up a PostgreSQL database for the application.

### 2. Keycloak Setup
Set up Keycloak for authentication and authorization.

### 3. Clone the Repository
```bash
git clone https://github.com/agriculturedev/guben-cockpit.git
cd guben-cockpit
```

### 4. Backend Setup (C# API)
Navigate to the backend folder:
```bash
cd Api
```

Restore NuGet packages:
```bash
dotnet restore
```

Build the project:
```bash
dotnet build
```

Configure the application settings:
- Check the `appsettings.json` file
- Adjust values if needed (see configuration section below)

Run the backend:
```bash
dotnet run
```

### 5. Frontend Setup (React)
Open a second terminal/console and navigate to the frontend folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure environment variables:
```bash
cp .env.example .env
```

Adjust the values in `.env` if needed (see configuration section below).

Start the frontend development server:
```bash
npm run dev
```


### Additional Setup
The **Guben Cockpit** uses several different Open Source Projects to display various Information. This includes:
- [Masterportal](https://www.masterportal.org/) for Geo related Data
- [Nextcloud](https://nextcloud.com/) for Uploading Images and PDFs
- [LibreTranslate](https://libretranslate.com/) for Translating into English and Polish, for imported Projects / Events as well as Bookings
- [Biletado](https://gitlab.opencode.de/biletado) for Displaying and Managing Bookables as well as Events

## Configuration

### Backend Configuration (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=Guben;User Id=postgres;Password=admin;"
  },
  "Keycloak": {
    "realm": "myRealm",
    "auth-server-url": "http://localhost:8080",
    "ssl-required": "none",
    "resource": "react-client",
    "verify-token-audience": false
  },
  "Frontend": {
    "BaseUri": "http://localhost:3000"
  },
  "ResiForm": {
    "Baseuri": "http://singular-it"
  },
  "Jobs": {
    "ProjectImporter": {
      "BearerToken": "test"
    },
    "LibreTranslate": {
      "TranslateUrl": "http://localhost:5001/translate",
      "ApiKey": "Some-api-key"
    }
  },
  "Debugging": {
    "EnableQueryLogging": false
  },
  "Nextcloud": {
    "BaseUri": "http://localhost:9500",
    "BaseDirectory": "YourBaseDirectory",
    "Username": "admin",
    "Password": "admin"
  },
  "Topic": {
    "Directory": "Path/To/Config"
  },
  "Masterportal": {
    "ServicesPath": "Path/To/Masterportal/services-internet.json",
    "ConfigPath": "Path/To/Masterportal/config.json",
    "UploadedFolderTitle": "Uploaded_Geodata",
    "ThemeConfigSection": "Fachdaten"
  }
}
```

| Configuration Key | Description | Default/Example Value |
|------------------|--------------------|--------------|
| `ConnectionStrings.DefaultConnection` | PostgreSQL database connection string | `Server=localhost;Port=5432;Database=Guben;User Id=postgres;Password=admin;` |
| `Keycloak.realm` | Keycloak realm name for authentication | `myRealm` |
| `Keycloak.auth-server-url` | Keycloak server base URL | `http://localhost:8080` |
| `Keycloak.ssl-required` | SSL requirement setting for Keycloak | `none` |
| `Keycloak.resource` | Keycloak client/resource identifier | `react-client` |
| `Keycloak.verify-token-audience` | Whether to verify token audience | `false` |
| `Frontend.BaseUri` | Base URI for the frontend application | `http://localhost:3000` |
| `ResiForm.Baseuri` | Base URI for ResiForm, this will allow ResiForm to access the Topics API | `http://singular-it` |
| `Jobs.ProjectImporter.BearerToken` | Authentication token for project import job | `test` |
| `Jobs.LibreTranslate.TranslateUrl` | LibreTranslate API endpoint for translation services, used for translating all Projects and Events when they are first imported | `http://localhost:5001/translate` |
| `Jobs.LibreTranslate.ApiKey` | API key for LibreTranslate service | `Some-api-key` |
| `Debugging.EnableQueryLogging` | Enable/disable database query logging for debugging | `false` |
| `Nextcloud.BaseUri` | Nextcloud server base URI | `http://localhost:9500` |
| `Nextcloud.BaseDirectory` | Base directory path in Nextcloud | `YourBaseDirectory` |
| `Nextcloud.Username` | Nextcloud username for authentication | `admin` |
| `Nextcloud.Password` | Nextcloud password for authentication | `admin` |
| `Topic.Directory` | Directory path for topic configuration files, used to Send Data from the Topics API | `Path/To/Config` |
| `Masterportal.ServicesPath` | Path to Masterportal services configuration file | `Path/To/Masterportal/services-internet.json` |
| `Masterportal.ConfigPath` | Path to Masterportal main configuration file | `Path/To/Masterportal/config.json` |
| `Masterportal.UploadedFolderTitle` | Title/name for uploaded geodata folder | `Uploaded_Geodata` |
| `Masterportal.ThemeConfigSection` | Configuration section name for themes | `Fachdaten` |

### Frontend Configuration (`.env`)
```
VITE_API_URL=http://localhost:5000
VITE_AUTHORITY=http://localhost:8080
VITE_AUDIENCE=react-client
VITE_BOOKING_URL=http://localhost:8081
VITE_BOOKING_SDK=http://localhost:8082/cdn/current/booking-manager.min.js
VITE_BOOKING_LOGIN=http://localhost:8081/login/sso
VITE_TRANSLATE_URL=http://localhost:5001/translate
VITE_TRANSLATE_API_KEY=some-api-key
```
| Configuration Key | Description | Default/Example Value |
|------------------|--------------------|--------------|
| `VITE_API_URL` | Base URL for the backend API endpoints | `http://localhost:5000` |
| `VITE_AUTHORITY` | Keycloak server URL for authentication authority | `http://localhost:8080` |
| `VITE_AUDIENCE` | Keycloak client/resource identifier for token validation | `react-client` |
| `VITE_BOOKING_URL` | Base URL for the booking service, used to import the bookings | `http://localhost:8081` |
| `VITE_BOOKING_SDK` | URL to the booking manager JavaScript SDK library | `http://localhost:8082/cdn/current/booking-manager.min.js` |
| `VITE_TRANSLATE_URL` | LibreTranslate API endpoint for translation services, used for translating the Booking Page | `http://localhost:5001/translate` |
| `VITE_TRANSLATE_API_KEY` | API key for LibreTranslate service | `some-api-key` |

## Development

### Backend
- The API will be available at `https://localhost:5000` (or the port specified in your configuration)

### DB

### Frontend  
- The frontend will be available at `http://localhost:3000` (or the port specified in your configuration)


## Keycloak
Keycloak is an essential part of the **Guben Cockpit**. It is used to handle authentication, authorization, and user management for the CMS Part of the Platform. The application relies on Keycloak's role-based access control (RBAC) system to manage permissions for different user types and functionalities.

### Keycloak Setup

When setting up a local Keycloak instance for the Guben Cockpit, you'll need to:

1. **Create a Realm**: Set up a new realm (e.g., `guben` or `myRealm`)
2. **Create Clients**: Configure the necessary client
3. **Define Roles**: Create all required roles for the application
4. **Configure Users**: Set up users and assign appropriate roles

### Required Roles

The following roles must be created in your Keycloak realm for the Guben Cockpit to function properly:

| Role Name | Description |
|-----------|-------------|
| `administrative_staff` | Person can view Private Bookings |
| `booking_manager` | Can Create and Delete Tenant-Ids used for managing the imported Booking, as well as decide if the importet Bookings are for public or private use |
| `booking_platform` | Can Access the direct Link to the Booking Platform |
| `footer_manager` | User can edit footer items |
| `location_manager` | User can manage locations |
| `page_manager` | User can edit page title and text |
| `project_contributor` | User can add, edit or delete own projects but not publish them |
| `project_deleter` | Person can delete any Project |
| `project_editor` | Can edit any Projects |
| `publish_projects` | User can publish any project |
| `event_contributor` | User can add, edit and delete own events, but not publish them |
| `event_deleter` | User can delete any Event |
| `event_editor` | User can edit any Event |
| `publish_events` | User can publish aby events |
| `dashboard_editor` | Users can create, update and delete Dasboard Tabs, they are not allowed to delete, create or update Dropdowns |
| `dashboard_manager` | User can add and edit the Dropdowns for the Dashboard |
| `upload_geodata` | User can upload geodata, for the manage_geodata check |
| `manage_geodata` | User can check uploaded Geodata / WMS / WFS, and decide if the data should be available in Masteportal, as well as Edit and Delete uploaded Geodata / WMS / WFS Links |
| `view_users` | User can access all users |
