"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { navLinks } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { CircleUserRoundIcon } from 'lucide-react'

const LeftSideBar = () => {
   const pathName = usePathname();
   const { user } = useUser();
  return (
    <div className=" h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      <Image src="/logo.png" alt="logo" width={40} height={40} />
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathName === link.url ? "text-blue-1" : "text-grey-1"
            }`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className=" flex gap-4 text-body-medium items-center">
        {user ? (<UserButton afterSignOutUrl='/sign-in' />) : (<Link href='/sign-in' className=' text-base-bold'><CircleUserRoundIcon /></Link>)}
        {user ? (<p>Edit Profile</p>) : (<Link href='/sign-in' className=' text-base-bold'>Sign-in</Link>)}
        
      </div>
    </div>
  );
}
export default LeftSideBar