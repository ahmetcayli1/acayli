import { CityMarquee } from '@/components/landing/city-marquee'
import { Hero } from '@/components/landing/hero'
import { Header } from '@/components/landing/header'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Scrolling city images on sides */}
      <CityMarquee side="left" />
      <CityMarquee side="right" />
      
      {/* Header */}
      <Header />
      
      {/* Main content with padding for sidebars */}
      <div className="lg:mx-56 xl:mx-64">
        <Hero />
      </div>
    </main>
  )
}
