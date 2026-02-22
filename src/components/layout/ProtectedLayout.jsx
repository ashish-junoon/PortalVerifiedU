import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import {
    Disclosure,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from '@headlessui/react';
import {
    BellIcon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { RiMenuFold2Line, RiMenuUnfold2Line } from "react-icons/ri";

import { useSidebar } from "../Context/SidebarContext"

const navigation = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Team', to: '/team' },
    { name: 'Projects', to: '/projects' },
    { name: 'Calendar', to: '/calendar' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ProtectedLayout() {
    const location = useLocation();
    const { toggleSidebar, isOpenSidebar, closeOnMobile } = useSidebar()
    const { logout, profileImages } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="bg-white  min-h-screen overflow-x-hidden">
            {/* Fixed Header */}
            <Disclosure as="nav" className="fixed top-0 w-full z-50 bg-white  shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex gap-3 shrink-0 items-center">
                            <div onClick={() => toggleSidebar()} className='lg:hidden  text-3xl cursor-pointer'>
                                {!isOpenSidebar ? <RiMenuFold2Line /> : <RiMenuUnfold2Line />}
                            </div>

                            <Link onClick={closeOnMobile} to="/">
                                <div className="flex items-center space-x-2">
                                    <img src="/logo.svg" alt="VerifiedU Logo" className="h-8 w-auto" />
                                    <div className="text-black text-2xl italic font-semibold tracking-tight ">
                                        Verified<span className="text-green-600 font-bold">U</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        {/* <div className="hidden sm:ml-6 sm:flex space-x-4">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        className={classNames(
                                            isActive
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-700  hover:bg-gray-200  hover:text-black ',
                                            'rounded-md px-3 py-2 text-sm font-medium transition'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div> */}

                        {/* Right-side icons */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button
                                type="button"
                                aria-label="View notifications"
                                className="rounded-full cursor-pointer p-1 text-gray-400 hover:text-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                            >
                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative">
                                <MenuButton className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 cursor-pointer border border-gray-300 shadow-lg">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full bg-gray-800 outline outline-white/10"
                                        src={profileImages
                                            ? `/images/${profileImages}`
                                            : `/images/profile_images.png`}
                                        alt="User"
                                    />
                                </MenuButton>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white  py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <MenuItem>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                                        >
                                            Your Profile
                                        </Link>
                                    </MenuItem>
                                    {/* <MenuItem>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                                        >
                                            Settings
                                        </Link>
                                    </MenuItem> */}
                                    <MenuItem>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100  w-full text-left cursor-pointer"
                                        >
                                            Sign out
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>
            </Disclosure>

            {/* Page content pushed down by fixed header */}
            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
}
