#

This project is a Next.js application that provides a public form to submit leads, along with a login page and a protected lead list page to display all submitted leads. The lead data are stored in sessionStorage. Accessing leadList page without login will be redirect to the login page.

## Folder Structure

```
project-root/
├── components/
│   └── leadForm.tsx         # Component |
|   └── sideBar.tsx
for the lead submission form
├── pages/
│   ├── index.tsx            # Public lead submission page
│   ├── login.tsx            # Login page for authentication
│   └── leads.tsx            # Protected page showing a list of lead
│   └── api/
|       └── submitLead.ts    # Next.js API Route that handles form submissions for leads
paginated lead list
├── public/
│   └── img/
│       └── alma.png         # Logo image used in the application
├── styles/
│   └── home.module.css
│   └── leads.module.css
│   └── login.module.css
│   └── sidebar.module.css
│   └── thankyou.module.css
├── package.json             # Project dependencies and scripts
├── README.md                # This file
└── next.config.js           # Next.js configuration
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Chrisyhjiang/lead-manager.git
cd yourproject
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

- The public page is available at [http://localhost:3000](http://localhost:3000) for lead submission.
- The login page is available at [http://localhost:3000/login](http://localhost:3000/login) using the following credentials:
  - **Username:** `admin`
  - **Password:** `pwd123`

After logging in, you will be redirected to the lead list page at [http://localhost:3000/leads](http://localhost:3000/leads) which displays a table with submitted leads data with functions, such as pagination, sorting, filtering and
searching.

all lead data and the isAuthentication indicator are stored in sessionStorage.

The uploaded resume file can be saved to the local driver, however the saving function code is removed because the user may not have write permission to save the file to their system.

Pagination and sorting are implemented by clicking the leads list table column header.

```

```
