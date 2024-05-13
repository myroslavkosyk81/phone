import { navLinks } from '@/lib/constants'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TopBar = () => {
  return (
    <div className=" sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 b-blue-2 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" width={70} height={40} />
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className=" flex gap-4 text-body-medium"
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className=" flex gap-4 items-center">
        <Menu className=' cursor-pointer md:hidden' />
        <UserButton />
        
      </div>
    </div>
  );
}

export default TopBar