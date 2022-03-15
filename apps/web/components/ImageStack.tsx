import React from 'react'
import Image from 'next/image'
import Identicon from 'react-identicons'

type ImageStackProps = {
  addresses: string[];
  size?: number;
  limit?: number;
}

const ImageStack = (props: ImageStackProps) => {
  const { addresses, size = 40, limit = 5 } = props

  return (
    <div className='flex flex-row-reverse mr-8'>
      {addresses.slice(0, limit).map(address => (
        <div
          className={`-mr-4 shadow:md border-[1px] w-[40px] h-[40px] rounded-full dark:border-kafeblack border-kafewhite shadow:xl hover:scale-110 overflow-hidden`}
          key={address}
        >
          <Identicon string={address} size={size} bg="white" />
        </div>
      ))}
    </div>
  )
}

export default ImageStack
