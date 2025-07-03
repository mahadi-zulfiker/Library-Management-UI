import React from 'react';
import { Link } from 'react-router-dom';
import { LibraryBigIcon, BookCheckIcon, BookPlusIcon, ListTodoIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2 mb-2 md:mb-0">
          <LibraryBigIcon className="h-7 w-7" />
          <span>Library Management</span>
        </Link>
        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <Link to="/" className="hover:text-gray-300 transition duration-200 flex items-center space-x-1">
              <ListTodoIcon className="h-5 w-5" />
              <span>All Books</span>
            </Link>
          </li>
          <li>
            <Link to="/create-book" className="hover:text-gray-300 transition duration-200 flex items-center space-x-1">
              <BookPlusIcon className="h-5 w-5" />
              <span>Add Book</span>
            </Link>
          </li>
          <li>
            <Link to="/borrow-summary" className="hover:text-gray-300 transition duration-200 flex items-center space-x-1">
              <BookCheckIcon className="h-5 w-5" />
              <span>Borrowed Summary</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;