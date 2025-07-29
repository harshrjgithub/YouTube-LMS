import React from 'react';
import { School } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const Navbar = () => {
  const user = true;

  return (
    <nav className="w-full h-16 bg-white/40 backdrop-blur-md shadow-md border-b border-purple-100 flex items-center justify-between px-6 fixed top-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <School size={26} className="text-purple-600" />
        <h1 className="text-xl font-bold text-gray-800">LMS</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-10 h-10 bg-purple-100 border border-purple-200 rounded-full">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent className="w-56 bg-white shadow-xl rounded-xl border border-gray-200 z-50 p-2">
                <DropdownMenuLabel className="text-gray-700 font-semibold px-2">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-gray-200" />

                <DropdownMenuGroup>
                  {['Profile', 'My Learning', 'Explore', 'Roadmaps'].map((item) => (
                    <DropdownMenuItem
                      key={item}
                      className="p-2 rounded-md hover:bg-purple-100 text-sm text-gray-700"
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-gray-200" />

                {['Dashboard', 'Log out'].map((item) => (
                  <DropdownMenuItem
                    key={item}
                    className="p-2 rounded-md hover:bg-purple-100 text-sm text-gray-700"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline">Login</Button>
            <Button>Register</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
