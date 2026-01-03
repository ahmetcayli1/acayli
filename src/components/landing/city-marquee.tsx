'use client'

import Image from 'next/image'
import { CITY_IMAGES } from '@/lib/constants'

interface CityMarqueeProps {
  side: 'left' | 'right'
}

export function CityMarquee({ side }: CityMarqueeProps) {
  const images = side === 'left' ? CITY_IMAGES.left : CITY_IMAGES.right
  const animationClass = side === 'left' ? 'animate-marquee-up' : 'animate-marquee-down'
  
  // Double the images for seamless loop
  const doubledImages = [...images, ...images]

  return (
    <div className="hidden lg:block fixed top-0 bottom-0 w-48 xl:w-56 overflow-hidden z-0"
      style={{ [side]: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-10" 
        style={{ 
          transform: side === 'right' ? 'scaleX(-1)' : undefined 
        }} 
      />
      <div className={`flex flex-col gap-4 ${animationClass}`}>
        {doubledImages.map((image, index) => (
          <div 
            key={`${image.city}-${index}`}
            className="relative w-full aspect-[2/3] rounded-xl overflow-hidden group"
          >
            <Image
              src={image.url}
              alt={`${image.city}, ${image.country}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1280px) 192px, 224px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-semibold text-sm">{image.city}</p>
              <p className="text-white/70 text-xs">{image.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
