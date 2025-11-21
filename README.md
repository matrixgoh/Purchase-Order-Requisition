# Purchase Order Requisition System

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A modern, intelligent purchase order requisition management system built with React, TypeScript, and Google Gemini AI. This application streamlines the procurement approval workflow with a multi-level approval system and AI-powered form filling.

## 🌟 Features

### 📋 Core Functionality
- **Multi-Level Approval Workflow**: Structured three-tier approval process (Requestor → Team Leader → Director)
- **Role-Based Access Control**: Different views and permissions for Requestors, Team Leaders, and Directors
- **Interactive Dashboard**: Centralized view of all requisitions with status tracking
- **Real-Time Status Updates**: Live tracking of requisition progress through the approval chain
- **PDF Export**: Generate professional PDF documents of requisitions
- **Print Support**: Print-optimized layouts for physical documentation
- **Offline Support**: Works completely offline - all dependencies bundled locally, no internet required (except for AI features)

### 🤖 AI-Powered Features
- **Gemini AI Integration**: Auto-fill requisition forms using natural language descriptions
- **Intelligent Form Generation**: Convert free-text descriptions into structured line items
- **Smart Vendor Suggestions**: AI assists in populating vendor details and item descriptions

### 💼 Business Features
- **Vendor Management**: Track vendor codes and details
- **Line Item Management**: Add unlimited line items with quantity, unit price, and descriptions
- **Automatic Calculations**: Real-time total amount calculations
- **Approval Tracking**: Capture approver names and dates at each stage
- **Department Tracking**: Track requisitions by department and branch
- **Draft System**: Save requisitions as drafts before submission

## 🏗️ Application Architecture

### Tech Stack
- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.8.2
- **Styling**: Tailwind CSS 4.0 (locally installed)
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (@google/genai)
- **Build Tool**: Vite 6.2.0
- **PDF Generation**: html2pdf.js (locally installed)
- **Offline Support**: All dependencies installed via npm, no CDN required

### Project Structure
```
Purchase-Order-Requisition/
├── App.tsx                 # Main application component with workflow logic
├── components/
│   ├── Header.tsx          # Company header with logo and document info
│   ├── Dashboard.tsx       # Requisition listing and management
│   ├── LineItemsTable.tsx  # Editable table for line items
│   └── AiAssistant.tsx     # AI-powered form filling interface
├── services/
│   ├── storageService.ts   # LocalStorage-based data persistence
│   └── geminiService.ts    # Google Gemini AI integration
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
├── index.html              # HTML template
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/matrixgoh/Purchase-Order-Requisition.git
   cd Purchase-Order-Requisition
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: https://aistudio.google.com/apikey

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📖 User Guide

### Workflow Overview

The application implements a three-tier approval workflow:

```
Draft → Pending Team Leader → Pending Director → Approved/Rejected
  ↓            ↓                    ↓
Requestor  Team Leader          Director
```

### Role-Specific Actions

#### 👤 Requestor Role
1. **Create New Requisition**: Click "New Requisition" button on the dashboard
2. **Fill in Details**:
   - Vendor Code (mandatory)
   - Vendor Details (name and address)
   - Department Tracking Number
   - Date, Branch, Department
   - Requestor Name
3. **Add Line Items**: 
   - Description of items
   - Quantity
   - Unit Price (automatic amount calculation)
4. **Use AI Assistant** (Optional): Click "Auto-fill with AI" button and describe what you need
5. **Save Draft**: Save work in progress
6. **Submit**: Submit for Team Leader approval (records requestor name and date)
7. **Track Status**: View all your requisitions and their approval status

#### 👔 Team Leader Role
1. **Review Pending Items**: Dashboard shows requisitions pending your review
2. **Open Requisition**: Click to view full details
3. **Actions**:
   - **Approve**: Forwards to Director with your signature and date
   - **Reject**: Returns requisition with rejection status
4. **Track History**: View previously approved/rejected items

#### 🎯 Director Role
1. **Final Review**: Dashboard displays requisitions pending final approval
2. **Open Requisition**: Review all details including Team Leader approval
3. **Actions**:
   - **Final Approval**: Completes the approval process with your signature and date
   - **Reject**: Rejects the requisition
4. **View Completed**: Access all approved/rejected requisitions

### Using the AI Assistant

The AI Assistant powered by Google Gemini can automatically fill out requisitions:

1. Click the **"Auto-fill with AI"** button (bottom-right, only visible in edit mode)
2. Describe your needs in natural language:
   ```
   Example: "I need 5 boxes of A4 paper, 10 black markers, 
   and a whiteboard cleaner for the HR department."
   ```
3. Click **"Generate Form"**
4. Review and edit the generated items as needed
5. Submit when ready

### PDF Export and Printing

- **Print**: Click the "Print" button to open the browser print dialog
- **PDF Export**: Click the "PDF" button to download a formatted PDF document
- **Multi-Page Support**: Large requisitions automatically paginate across multiple pages

## 🔄 Workflow Details

### Status Progression

| Status | Description | Available Actions |
|--------|-------------|-------------------|
| **Draft** | Initial creation, editable by requestor | Edit, Delete, Submit |
| **Pending Team Leader** | Awaiting Team Leader review | Approve, Reject (Team Leader) |
| **Pending Director** | Awaiting Director review | Final Approve, Reject (Director) |
| **Approved** | Fully approved, ready for processing | View only |
| **Rejected** | Rejected at any stage | View only |

### Approval Records

Each approval stage automatically records:
- **Approver Name**: Captured from the system
- **Approval Date**: Timestamp of the approval action
- **Status Change**: Tracked in the requisition history

### Data Persistence

- All requisitions are stored in **browser LocalStorage**
- Data persists across sessions
- Each requisition has a unique ID (`REQ-{timestamp}`)
- Export important requisitions as PDF for backup

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Key Files to Modify

- **App.tsx**: Main application logic, workflow handling
- **components/**: UI components for different features
- **services/storageService.ts**: Data persistence logic
- **services/geminiService.ts**: AI integration configuration
- **types.ts**: TypeScript type definitions

### Adding New Features

1. **New Approval Stage**: Modify the `RequisitionStatus` type in `types.ts` and update workflow logic in `App.tsx`
2. **Custom Fields**: Add fields to `FormData` interface in `types.ts` and update the form UI
3. **Export Formats**: Integrate additional libraries in `index.html` and add export functions

## 🔒 Security Notes

- API keys should be stored in `.env.local` and never committed to version control
- LocalStorage data is browser-specific and not encrypted
- For production deployment, consider implementing:
  - Backend API for data persistence
  - User authentication and authorization
  - Encrypted data storage
  - Audit logging

## 🐛 Bug Fixes

### Recent Fixes
- **Requestor Information Recording**: Fixed bug where requestor name and date were not recorded when submitting a new requisition. The `handleSubmit` function now properly populates the `approvalRequestor` object with the requestor's name and current date.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of a portfolio demonstration. Please check with the repository owner for licensing details.

## 🔗 Links

- **Live App**: [AI Studio](https://ai.studio/apps/drive/19i3RPTeyD9UFWCRvNSbMHPNiW4R9vu8R)
- **Repository**: [GitHub](https://github.com/matrixgoh/Purchase-Order-Requisition)

## 📞 Support

For questions or issues, please open an issue on the GitHub repository.

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
