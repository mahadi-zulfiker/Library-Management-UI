# Minimal Library Management System - Frontend

This is the frontend client for a minimal library management system, built with React, Redux Toolkit Query (RTK Query), TypeScript, and styled with Tailwind CSS and Shadcn UI. It provides a clean and functional interface for managing books and tracking borrowing activities.

This project is part of a full-stack application. The backend API source can be found [here](https://github.com/mahadi-zulfiker/Library-Management-API). The live backend API is deployed at [https://library-management-drab-xi.vercel.app/](https://library-management-drab-xi.vercel.app/).

## ✨ Features

* **Public Access:** All pages are accessible without authentication.
* **Book Management (CRUD):**
    * **Book List Table:** View all books with details (Title, Author, Genre, ISBN, Copies, Availability).
    * **Edit Book:** Update existing book information with instant UI reflection. If copies are set to 0, the book is marked as unavailable.
    * **Delete Book:** Remove books with a confirmation dialog.
    * **Add New Book:** Form to create new book entries.
* **Borrow Book:**
    * Simple form to borrow books, specifying quantity and due date.
    * Business logic prevents borrowing more than available copies.
    * If copies reach 0 after borrowing, the book is marked unavailable.
* **Borrow Summary:** Displays an aggregated list of borrowed books by title and total quantity.
* **Responsive UI:** Fully responsive layout adapting to mobile, tablet, and desktop devices using Tailwind CSS and Shadcn UI.
* **Optimistic UI Updates:** Provides a smooth user experience by instantly updating the UI for delete and update operations before the server response.
* **Toast Notifications:** Informative messages for user actions (success, error).
* **Type-Safe Forms:** Enhanced form validation and type safety using React Hook Form and TypeScript.

## 🚀 Technologies Used

* **Framework:** React
* **State Management & API Integration:** Redux Toolkit & RTK Query
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **UI Components:** Shadcn UI
* **Routing:** React Router DOM
* **Forms:** React Hook Form
* **Toasts:** React Hot Toast

## ⚙️ Setup and Installation

Follow these steps to get the project running locally:

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mahadi-zulfiker/Library-Management-UI](https://github.com/mahadi-zulfiker/Library-Management-UI)
    cd library-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173`.

## 🌐 API Endpoints

This frontend consumes the following backend API endpoints (deployed at `https://library-management-drab-xi.vercel.app/api`):

* `GET /api/books`: Retrieve all books (with pagination support, though not fully utilized on frontend for simplicity).
* `GET /api/books/:id`: Get a single book by ID.
* `POST /api/books`: Create a new book.
* `PUT /api/books/:id`: Update an existing book.
* `DELETE /api/books/:id`: Delete a book.
* `POST /api/borrow`: Create a new borrow record.
* `GET /api/borrow`: Get a summary of all borrowed books.

## 🤝 Contributing

This project is a minimal system developed for demonstration purposes. Feel free to fork the repository and explore.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).