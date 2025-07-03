import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold mb-2 md:mb-0">
          Library Management
        </Link>
        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <Button variant="link" className="text-gray-300 hover:text-white" asChild>
              <Link to="/">All Books</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-gray-300 hover:text-white" asChild>
              <Link to="/create-book">Add Book</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-gray-300 hover:text-white" asChild>
              <Link to="/borrow-summary">Borrow Summary</Link>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;