# Flowbit Full Stack Developer Internship Assignment

A modern full-stack analytics dashboard with AI-powered natural language data querying capabilities.

## ✨ Overview

This project is a comprehensive invoice analytics platform that combines:
- **Interactive Dashboard** - Visualize invoice data with dynamic charts and metrics
- **AI-Powered Chat** - Query your data using natural language (powered by Groq AI)
- **RESTful API** - Type-safe backend with Prisma ORM
- **Modern Tech Stack** - Next.js 14, TypeScript, TailwindCSS, PostgreSQL, FastAPI

## 🏗️ Project Structure

```
.
├── apps/
│   ├── web/          # Next.js 14 frontend (TypeScript, TailwindCSS, shadcn/ui)
│   └── api/          # Express.js backend (TypeScript, Prisma, PostgreSQL)
├── services/
│   └── vanna/        # Python FastAPI service (Groq AI integration)
├── data/
│   └── Analytics_Test_Data.json  # Seed data
├── package.json      # Monorepo root (npm workspaces)
├── turbo.json        # Turborepo configuration
└── docker-compose.yml # Full stack Docker setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+ (or use Docker)
- Groq API key (for AI features)

### Option 1: Using Docker (Recommended)

1. **Set up environment variables:**
   ```bash
   # Copy and edit .env.example if needed
   # For Docker, edit docker-compose.yml environment variables
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Seed the database:**
   ```bash
   docker-compose exec api npm run db:seed
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Vanna AI: http://localhost:8000

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   # Root dependencies
   npm install
   
   # Frontend dependencies
   cd apps/web && npm install && cd ../..
   
   # Backend dependencies
   cd apps/api && npm install && cd ../..
   ```

2. **Set up PostgreSQL:**
   - Install PostgreSQL locally or use Docker:
     ```bash
     docker run -d --name flowbit-postgres -e POSTGRES_USER=flowbit -e POSTGRES_PASSWORD=flowbit_password -e POSTGRES_DB=flowbit_db -p 5432:5432 postgres:15-alpine
     ```

3. **Configure environment variables:**
   Create `.env` files:
   
   **apps/api/.env:**
   ```env
   DATABASE_URL=postgresql://flowbit:flowbit_password@localhost:5432/flowbit_db
   PORT=3001
   NODE_ENV=development
   VANNA_SERVICE_URL=http://localhost:8000
   ```
   
   **apps/web/.env.local:**
   ```env
   NEXT_PUBLIC_API_BASE=http://localhost:3001
   ```
   
   **services/vanna/.env:**
   ```env
   DATABASE_URL=postgresql://flowbit:flowbit_password@localhost:5432/flowbit_db
   GROQ_API_KEY=your_groq_api_key_here
   VANNA_PORT=8000
   ```

4. **Set up the database:**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the services:**
   
   **Terminal 1 - Backend API:**
   ```bash
   cd apps/api
   npm run dev
   ```
   
   **Terminal 2 - Vanna AI Service:**
   ```bash
   cd services/vanna
   pip install -r requirements.txt
   python main.py
   # or: uvicorn main:app --reload --port 8000
   ```
   
   **Terminal 3 - Frontend:**
   ```bash
   cd apps/web
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Vanna AI: http://localhost:8000

## 📊 Database Schema

### ER Diagram

```
┌─────────────────┐
│    Invoice      │
├─────────────────┤
│ id (PK)         │
│ documentId (UK) │
│ invoiceId       │
│ invoiceDate     │
│ deliveryDate    │
│ vendorName      │
│ vendorAddress   │
│ vendorTaxId     │
│ customerName    │
│ customerAddress │
│ subTotal        │
│ totalTax        │
│ invoiceTotal    │
│ currency        │
│ status          │
│ organizationId  │
│ departmentId    │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│   LineItem     │
├────────────────┤
│ id (PK)        │
│ invoiceId (FK) │
│ srNo           │
│ description    │
│ quantity       │
│ unitPrice      │
│ totalPrice     │
│ category       │
│ createdAt      │
└────────────────┘
```

## 🔌 API Endpoints

### Backend API (Express.js)

- `GET /health` - Health check
- `GET /stats` - Summary metrics (total invoices, spend, averages)
- `GET /invoice-trends` - Monthly invoice count and spend trends
- `GET /vendors/top10` - Top 10 vendors by total spend
- `GET /category-spend` - Spend breakdown by category
- `GET /cash-outflow` - Cash outflow forecast
- `GET /invoices?search=&page=&limit=` - List/search invoices
- `POST /chat-with-data` - Proxy to Vanna AI service

### Vanna AI Service (FastAPI)

- `GET /` - Service info
- `GET /health` - Health check
- `POST /query` - Natural language to SQL query

## 🎨 Frontend Pages

- `/dashboard` - Main analytics dashboard with charts and metrics
- `/chat-with-data` - AI-powered natural language query interface

## 🧪 Testing the Setup

1. **Check API health:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check Vanna service:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **Test API endpoint:**
   ```bash
   curl http://localhost:3001/stats
   ```

4. **Test Vanna query:**
   ```bash
   curl -X POST http://localhost:8000/query \
     -H "Content-Type: application/json" \
     -d '{"query": "What are the top 5 vendors by total spend?"}'
   ```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Seed database
docker-compose exec api npm run db:seed

# Access database
docker-compose exec postgres psql -U flowbit -d flowbit_db
```

## 📦 Deployment

### Frontend + API → Vercel
- Frontend: Deploy `apps/web` as a Next.js app
- API: Deploy `apps/api` as a serverless function or Node.js server

### Vanna AI → Render/Railway
- Deploy `services/vanna` as a Python service
- Set environment variables: `DATABASE_URL`, `GROQ_API_KEY`

### PostgreSQL → Supabase/Railway
- Create PostgreSQL database
- Update `DATABASE_URL` in all services
- Run migrations and seed

### Environment Variables for Production

Ensure CORS is configured for your production domains:
- Update `apps/api/src/index.ts` CORS settings
- Update `services/vanna/main.py` CORS settings

## 🛠️ Development Scripts

### Root Level
```bash
npm run dev      # Run all apps in dev mode (requires turbo)
npm run build    # Build all apps
npm run lint     # Lint all apps
```

### Backend (apps/api)
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
```

### Frontend (apps/web)
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
```

### Vanna Service (services/vanna)
```bash
python main.py                    # Run directly
uvicorn main:app --reload         # Run with auto-reload
```

## 💬 Chat with Data Workflow

The "Chat with Data" feature enables natural language queries on your invoice data. Here's how it works:

### Workflow Diagram

```
User Input (Natural Language)
    ↓
Frontend (/chat-with-data page)
    ↓
POST /chat-with-data (Express API)
    ↓
Vanna AI Service (FastAPI)
    ↓
Groq API (LLM for SQL Generation)
    ↓
Generated SQL Query
    ↓
PostgreSQL Database (Execution)
    ↓
Query Results
    ↓
Vanna AI Service (Formats Response)
    ↓
Express API (Proxies Response)
    ↓
Frontend (Displays SQL + Results)
```

### Step-by-Step Process

1. **User Input**: User types a natural language question like "What are the top 5 vendors by total spend?"

2. **Frontend Request**: Frontend sends POST request to `/chat-with-data` endpoint with the query:
   ```json
   {
     "query": "What are the top 5 vendors by total spend?"
   }
   ```

3. **Backend Proxy**: Express.js backend receives the request and forwards it to the Vanna AI service (configured via `VANNA_SERVICE_URL`).

4. **SQL Generation**: Vanna AI service:
   - Sends the query to Groq API (LLM provider)
   - Groq generates SQL based on the database schema
   - Returns the generated SQL query

5. **SQL Execution**: Vanna AI service:
   - Connects to PostgreSQL database
   - Executes the generated SQL query
   - Retrieves results from the database

6. **Response Formatting**: Vanna AI service formats the response:
   ```json
   {
     "sql": "SELECT vendor_name, SUM(invoice_total) as total_spend FROM Invoice GROUP BY vendor_name ORDER BY total_spend DESC LIMIT 5;",
     "result": [...]
   }
   ```

7. **Frontend Display**: Frontend receives and displays:
   - The generated SQL query (in a collapsible section)
   - The query results (as a table or chart)

### Example Queries

- "What's the total spend in the last 90 days?"
- "List top 5 vendors by spend."
- "Show overdue invoices as of today."
- "What is the average invoice value per month?"
- "Which category has the highest spend?"

### Configuration

- **Vanna Service URL**: Set `VANNA_SERVICE_URL` in backend `.env` (default: `http://localhost:8000`)
- **Groq API Key**: Set `GROQ_API_KEY` in Vanna service `.env`
- **Database**: Vanna service uses the same `DATABASE_URL` as the backend

## 📝 Notes

- The seed script processes the `Analytics_Test_Data.json` file and imports all invoice data
- Groq API key is required for the AI chat feature
- Database indexes are created for optimal query performance
- All services support hot-reload in development mode
- See `API_DOCUMENTATION.md` for detailed API endpoint documentation

## 🐛 Troubleshooting

### Database Issues

1. **Connection errors:**
   - Verify PostgreSQL is running: `docker ps` or check service status
   - Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
   - Ensure database exists and user has permissions

2. **Case-sensitivity errors:**
   - PostgreSQL tables are case-sensitive: use `"Invoice"` not `invoice`
   - Column names must match exactly: `"invoiceTotal"` not `invoicetotal`

### Backend/API Issues

3. **Port conflicts:**
   - Default ports: Web (3000), API (3001), Vanna (8000)
   - Change in `.env` files or `docker-compose.yml`
   - Check if ports are in use: `netstat -ano | findstr :3001`

4. **Prisma errors:**
   - Run `npx prisma generate` in `apps/api` to generate client
   - Run `npx prisma db push` to sync schema with database
   - Clear Prisma cache: delete `node_modules/.prisma`

### Vanna AI Service Issues

5. **Groq API errors:**
   - Verify `GROQ_API_KEY` is valid (not `project_*` format)
   - Check API key at: https://console.groq.com/keys
   - Ensure model `llama-3.3-70b-versatile` is enabled in Groq console

6. **SQL generation errors:**
   - Check logs for detailed error messages
   - Verify database schema matches `SCHEMA_INFO` in `main.py`
   - Test queries manually in PostgreSQL first

7. **Result processing errors:**
   - Check for NULL values in aggregate queries (SUM, COUNT)
   - Verify cursor type is `RealDictCursor`
   - Review logs for serialization issues

### Frontend Issues

8. **React rendering errors:**
   - Clear Next.js cache: delete `.next` folder
   - Restart dev server
   - Check browser console for detailed errors

9. **API connection errors:**
   - Verify `NEXT_PUBLIC_API_BASE` in `.env.local`
   - Check CORS settings in backend
   - Ensure API is running and accessible

## 🎯 Key Features Implemented

### Dashboard Analytics
- ✅ Interactive charts with Recharts (Bar, Line, Pie, Area)
- ✅ Real-time metrics overview cards
- ✅ Top 10 vendors visualization
- ✅ Category-wise spend breakdown
- ✅ Monthly invoice trends
- ✅ Cash outflow forecasting
- ✅ Responsive design with TailwindCSS

### AI-Powered Chat with Data
- ✅ Natural language query processing
- ✅ SQL generation using Groq AI (llama-3.3-70b-versatile)
- ✅ Real-time query execution on PostgreSQL
- ✅ Formatted results display (tables and single values)
- ✅ Currency and number formatting
- ✅ SQL query preview for transparency
- ✅ Case-sensitive PostgreSQL table/column handling

### Backend API
- ✅ RESTful API with Express.js and TypeScript
- ✅ Prisma ORM for type-safe database queries
- ✅ Comprehensive analytics endpoints
- ✅ Search and pagination for invoices
- ✅ CORS configured for cross-origin requests
- ✅ Health check endpoints

### Vanna AI Service
- ✅ FastAPI Python service with async support
- ✅ Groq API integration for LLM-powered SQL generation
- ✅ Comprehensive schema documentation
- ✅ SQL cleanup and validation
- ✅ Error handling and logging
- ✅ PostgreSQL case-sensitivity support
- ✅ JSON serialization for complex data types

## 🚀 Recent Updates & Fixes

### Frontend Improvements
- Fixed React rendering error for aggregate query results
- Added proper data formatting for single-value results (SUM, COUNT, AVG)
- Implemented table rendering for multi-row query results
- Added currency formatting for financial data
- Enhanced number formatting with thousand separators
- Improved error handling and user feedback

### Vanna AI Service Fixes
- Fixed `RealDictCursor` row access issue (changed from `row[i]` to `row[col]`)
- Added proper handling for Decimal types from PostgreSQL
- Improved NULL value handling in query results
- Enhanced logging for debugging SQL generation and execution
- Fixed model compatibility (now using llama-3.3-70b-versatile)
- Added case-sensitive table/column name handling

### Code Quality
- Removed unnecessary documentation files
- Kept essential docs: README, DEPLOYMENT_GUIDE, QUICK_START_NOW, API_DOCUMENTATION
- Improved code organization and maintainability

## 📚 Additional Documentation

- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoint documentation with example responses
- **Deployment Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment instructions
- **Quick Start**: See [QUICK_START_NOW.md](./QUICK_START_NOW.md) for rapid setup guide

## 🤝 Contributing

This is an internship assignment project. For issues or questions, please contact the project maintainer.

## 📄 License

This project is part of the Flowbit Full Stack Developer Internship assignment.

---

**Built with ❤️ using Next.js, Express, FastAPI, PostgreSQL, Prisma, and Groq AI**
