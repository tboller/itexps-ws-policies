# itexps-ws-policies
# 📚 Node.js Insurance API

A Insurance RESTful API for provides endpoints for managing insurance policies, coverages, and claims within an insurance system. 

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
```bash
# Clone or download the project
cd itexps-ws-policies

# Install dependencies
npm install
```

### Running the Application
```bash
# Development mode (with auto-resta

# Production mode
npm start
```

### Default Configuration
- **Port**: 3000 (or set `PORT` environment variable)
- **Database**: `db.json` (development) / `db.test.json` (test)
- **Environment**: `development` (or set `NODE_ENV`)

## 📡 API Endpoints

### Policy
- `GET /polices` - List all polices
- `GET /policies?customer_id=113` - Get policy by customer ID
- `GET /policies/15` - Get policy by policy ID
- `GET /policies?policy_type=Health` - Get policy by policy Type
- `POST /policies` - Create policy 
- `PUT /policies/14` - Update policy 
- `DELETE /policies/63` - Delete policy 

### Coverages
- `GET /coverages` - List all coverages
- `GET /coverages/11` - Get coverage by coverage ID
- `GET /coverages?policy_id=15` - Get coverage by policy ID
- `GET /coverages?coverage_type=Collision` - Get coverage by coverage Type
- `POST /coverages` - Create coverage 
- `PUT /coverages/13` - Update coverage 
- `DELETE /coverages/45` - Delete coverage 

### Claims
- `GET /claims` - List all claims
- `GET /claims/11` - Get claim by claim ID
- `GET /claims?policy_id=13` - Get claim by policy ID
- `GET /claims?claim_type=Collision` - Get claim by claim Type
- `POST /claims` - Create claim 
- `PUT /claims/14` - Update claim 
- `DELETE /claims/25` - Delete claim 

## 🛠️ Troubleshooting

### Common Errors & Solutions

#### npm install errors:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Security vulnerabilities:
```bash
# Update packages
npm update
npm audit fix

# Force fix (may cause breaking changes)
npm audit fix --force
```

#### Port already in use:
```bash
# Use different port
PORT=3000 npm start
```

#### Permission errors (Windows):
```bash
# Run as administrator or use different port
PORT=3000 npm start
```

### Package Updates
```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages
npm update
```

### Scripts
- `npm start` - Production server
- `npm run start:dev` - Development with nodemon
- `npm run start:test` - Test environment
- `npm run postmanTests` - Run Postman tests


