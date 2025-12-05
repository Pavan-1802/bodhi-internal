# Bodhi Owner

Bodhi Owner is a web application built using [Next.js](https://nextjs.org), designed to streamline the management of enquiries, costings, invoices, and quotations. This project leverages modern web development practices and tools to deliver a seamless user experience.

## Features

- **Enquiry Management**: Create, view, and manage enquiries efficiently.
- **Costing System**: Add and manage additional costs for enquiries.
- **Invoice Generation**: Generate and view invoices for specific enquiries.
- **Quotation Management**: Create and manage quotations linked to enquiries.
- **Authentication**: Secure login and logout functionality.
- **Responsive Design**: Optimized for various screen sizes.

## Project Structure

The project follows a modular structure for better scalability and maintainability. Below is an overview of the key directories:

- **`app/`**: Contains the main application pages and API routes.
  - `api/`: Backend API routes for handling enquiries, costings, invoices, and more.
  - `components/`: Reusable UI components such as tables, modals, and forms.
  - `costings/`, `invoice/`, `quotation/`, `login/`: Frontend pages for respective features.
- **`lib/`**: Utility libraries, including database configurations.
- **`public/`**: Static assets like images and fonts.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pavan-1802/bodhi-internal.git
   ```

2. Navigate to the project directory:

   ```bash
   cd bodhi-owner
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## Environment Variables

Create a `.env.local` file in the root directory and configure the following environment variables:

```env
DATABASE_URL
OWNER_EMAIL
OWNER_PASSWORD
JWT_SECRET
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs): Learn about Next.js features and API.
- [React Documentation](https://reactjs.org/): Learn about React, the library used for building the UI.
- [Vercel Deployment](https://vercel.com/docs): Learn how to deploy your Next.js app on Vercel.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.