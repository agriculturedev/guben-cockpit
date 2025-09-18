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
- Masterportal[https://www.masterportal.org/] for Geo related Data
- Nextcloud[https://nextcloud.com/] for Uploading Images and PDFs
- LibreTranslate[https://libretranslate.com/] for Translating into English and Polish, for imported Projects / Events as well as Bookings
- Biletado[https://gitlab.opencode.de/biletado] for Displaying and Managing Bookables as well as Events

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
      "TranslateUrl": "http://libreTranslate/translate",
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
|------------------|-------------|----------------------|
| `ConnectionStrings.DefaultConnection` | PostgreSQL database connection string | `Server=localhost;Port=5432;Database=Guben;User Id=postgres;Password=admin;` |
| `Keycloak.realm` | Keycloak realm name for authentication | `myRealm` |
| `Keycloak.auth-server-url` | Keycloak server base URL | `http://localhost:8080` |
| `Keycloak.ssl-required` | SSL requirement setting for Keycloak | `none` |
| `Keycloak.resource` | Keycloak client/resource identifier | `react-client` |
| `Keycloak.verify-token-audience` | Whether to verify token audience | `false` |
| `Frontend.BaseUri` | Base URI for the frontend application | `http://localhost:3000` |
| `ResiForm.Baseuri` | Base URI for ResiForm, this will allow ResiForm to access the Topics API | `http://singular-it` |
| `Jobs.ProjectImporter.BearerToken` | Authentication token for project import job | `test` |
| `Jobs.LibreTranslate.TranslateUrl` | LibreTranslate API endpoint for translation services, used for translating all Projects and Events when they are first imported | `http://libreTranslate/translate` |
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
*Description of all environment variables will be documented here*


## Development

### Backend
- The API will be available at `https://localhost:5000` (or the port specified in your configuration)

### Frontend  
- The frontend will be available at `http://localhost:3000` (or the port specified in your configuration)
