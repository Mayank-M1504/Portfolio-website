import { useEffect, useRef, useState } from 'preact/hooks'
import './app.css'

export function App() {
  const starCanvasRef = useRef<HTMLCanvasElement>(null)
  const homeStarCanvasRef = useRef<HTMLCanvasElement>(null)
  const transitionStarCanvasRef = useRef<HTMLCanvasElement>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [showFinalImage, setShowFinalImage] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [displayedSubtitle, setDisplayedSubtitle] = useState('')
  const [showSubtitleCursor, setShowSubtitleCursor] = useState(true)
  const [showBackTransition, setShowBackTransition] = useState(false)
  const [typingKey, setTypingKey] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState('')
  const [showPlanetTransition, setShowPlanetTransition] = useState(false)
  const [planetPosition, setPlanetPosition] = useState({ x: 0, y: 0 })
  const [isClosing, setIsClosing] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  // kept for className compatibility; no state changes required
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [totalImages, setTotalImages] = useState(5)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [showPlanetReturn, setShowPlanetReturn] = useState(false)
  const [showTransitionVideo, setShowTransitionVideo] = useState(false)
  const [textFading, setTextFading] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [currentOrbitIndex, setCurrentOrbitIndex] = useState(0)
  const [orbitRotationDeg, setOrbitRotationDeg] = useState(0)
  const orbitRef = useRef<HTMLDivElement>(null)

  // Typing effect for title text
  useEffect(() => {
    const fullText = "Mayank’s Cosmos"
    let currentIndex = 0
    let timeoutId: number

    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(typeText, 100) // 100ms delay between characters
      } else {
        // Start blinking cursor after typing is complete
        setShowCursor(true)
      }
    }

    // Start typing effect after a short delay
    const startTyping = setTimeout(() => {
      typeText()
    }, 500)

    return () => {
      clearTimeout(startTyping)
      clearTimeout(timeoutId)
    }
  }, [typingKey])

  // Typing effect for subtitle text
  useEffect(() => {
    const fullSubtitle = "My Superpower ? Turning Coffee into code"
    let currentIndex = 0
    let timeoutId: number

    const typeSubtitle = () => {
      if (currentIndex < fullSubtitle.length) {
        setDisplayedSubtitle(fullSubtitle.slice(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(typeSubtitle, 80) // Slightly faster typing for subtitle
      } else {
        // Start blinking cursor after typing is complete
        setShowSubtitleCursor(true)
      }
    }

    // Start subtitle typing after main title is complete (2.5 seconds delay)
    const startSubtitleTyping = setTimeout(() => {
      typeSubtitle()
    }, 2500)

    return () => {
      clearTimeout(startSubtitleTyping)
      clearTimeout(timeoutId)
    }
  }, [typingKey])

  // Cursor blinking effect for main title
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500) // Blink every 500ms

    return () => clearInterval(interval)
  }, [])

  // Cursor blinking effect for subtitle
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSubtitleCursor(prev => !prev)
    }, 500) // Blink every 500ms

    return () => clearInterval(interval)
  }, [])

  // Preload critical images and videos
  useEffect(() => {
    const imageUrls = [
      '/planet1.png',
      '/planet2.png', 
      '/planet3.png',
      '/planet4.png',
      '/planet5.png'
    ]
    
    const videoUrls = [
      '/Transition.mp4'
    ]
    
    let loadedCount = 0
    const totalCount = imageUrls.length + videoUrls.length
    
    // Preload images
    imageUrls.forEach(url => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        setImagesLoaded(loadedCount)
        if (loadedCount === totalCount) {
          setTotalImages(totalCount)
        }
      }
      img.onerror = () => {
        loadedCount++
        setImagesLoaded(loadedCount)
        if (loadedCount === totalCount) {
          setTotalImages(totalCount)
        }
      }
      img.src = url
    })
    
    // Preload videos
    videoUrls.forEach(url => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.muted = true
      video.onloadeddata = () => {
        loadedCount++
        setImagesLoaded(loadedCount)
        if (loadedCount === totalCount) {
          setTotalImages(totalCount)
        }
      }
      video.onerror = () => {
        loadedCount++
        setImagesLoaded(loadedCount)
        if (loadedCount === totalCount) {
          setTotalImages(totalCount)
        }
      }
      video.src = url
      video.load()
    })
  }, [])

  // Initialize canvas starfield for Home (when not in selection page)
  useEffect(() => {
    if (showFinalImage) return
    
    const initHomeStarfield = () => {
      const canvas = homeStarCanvasRef.current
      if (!canvas) {
        setTimeout(initHomeStarfield, 100)
        return
      }
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setTimeout(initHomeStarfield, 100)
        return
      }

      let animationFrameId = 0
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

      const resize = () => {
        const { innerWidth, innerHeight } = window
        canvas.width = Math.floor(innerWidth * dpr)
        canvas.height = Math.floor(innerHeight * dpr)
        canvas.style.width = innerWidth + 'px'
        canvas.style.height = innerHeight + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      resize()
      window.addEventListener('resize', resize)

      type Star = { x: number; y: number; size: number; speed: number; dir: 'v' | 'h' }
      const stars: Star[] = []
      const createStars = (count: number) => {
        stars.length = 0
        const { innerWidth, innerHeight } = window
        for (let i = 0; i < count; i++) {
          const isVertical = i % 2 === 0
          const size = Math.random() < 0.15 ? 2.4 : Math.random() < 0.35 ? 1.8 : 1.1
          const speedBase = isVertical ? 18 : 16
          const speedJitter = Math.random() * 10
          stars.push({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            size,
            speed: speedBase + speedJitter,
            dir: isVertical ? 'v' : 'h'
          })
        }
      }

      const density = Math.floor((window.innerWidth * window.innerHeight) / 18000)
      createStars(Math.max(120, Math.min(320, density)))

      const draw = () => {
        try {
          const { innerWidth, innerHeight } = window
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, innerWidth, innerHeight)

          ctx.fillStyle = '#fff'
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i]
            if (s.dir === 'v') {
              s.y += s.speed * 0.016
              if (s.y > innerHeight + 5) {
                s.y = -5
                s.x = Math.random() * innerWidth
              }
            } else {
              s.x += s.speed * 0.016
              if (s.x > innerWidth + 5) {
                s.x = -5
                s.y = Math.random() * innerHeight
              }
            }
            if (s.size <= 1.2) {
              ctx.fillRect(s.x, s.y, 1, 1)
            } else {
              ctx.beginPath()
              ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          animationFrameId = requestAnimationFrame(draw)
        } catch (error) {
          console.warn('Home star animation error:', error)
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(draw)
          }, 100)
        }
      }

      // Mark video loaded equivalent once canvas is ready
      setVideoLoaded(true)
      animationFrameId = requestAnimationFrame(draw)

      return () => {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener('resize', resize)
      }
    }

    const cleanup = initHomeStarfield()
    return cleanup
  }, [showFinalImage])

  // Fast starfield during transition overlay (replaces Transition.mp4)
  useEffect(() => {
    if (!showTransitionVideo) return
    
    const initTransitionStarfield = () => {
      const canvas = transitionStarCanvasRef.current
      if (!canvas) {
        setTimeout(initTransitionStarfield, 100)
        return
      }
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setTimeout(initTransitionStarfield, 100)
        return
      }

      let animationFrameId = 0
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

      type Star = { x: number; y: number; size: number; speed: number; z: number; maxZ: number }
      const stars: Star[] = []

      const resize = () => {
        const { innerWidth, innerHeight } = window
        canvas.width = Math.floor(innerWidth * dpr)
        canvas.height = Math.floor(innerHeight * dpr)
        canvas.style.width = innerWidth + 'px'
        canvas.style.height = innerHeight + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      resize()
      window.addEventListener('resize', resize)
      const createStars = (count: number) => {
        stars.length = 0
        const { innerWidth, innerHeight } = window
        
        console.log('Creating', count, 'stars for space travel effect')
        
        for (let i = 0; i < count; i++) {
          const size = Math.random() < 0.15 ? 3.0 : Math.random() < 0.35 ? 2.0 : 1.2
          const speedBase = 120
          const speedJitter = Math.random() * 40
          const z = Math.random() * 1000 // Random depth
          const maxZ = 1000
          
          stars.push({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            size,
            speed: speedBase + speedJitter,
            z,
            maxZ
          })
        }
        
        console.log('Created', stars.length, 'stars for space travel')
      }
      const density = Math.floor((window.innerWidth * window.innerHeight) / 18000)
      createStars(Math.max(140, Math.min(360, density)))

      const draw = () => {
        try {
          const { innerWidth, innerHeight } = window
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, innerWidth, innerHeight)
          
          // Pre-calculate constants for better performance
          const centerX = innerWidth * 0.5
          const centerY = innerHeight * 0.5
          const deltaTime = 0.016
          
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i]
            
            // Move star towards viewer (decrease z)
            s.z -= s.speed * deltaTime
            
            // Reset star if it gets too close (z <= 0)
            if (s.z <= 0) {
              s.z = s.maxZ
              s.x = Math.random() * innerWidth
              s.y = Math.random() * innerHeight
            }
            
            // Calculate screen position based on z-depth (perspective projection)
            const scale = 200 / s.z // Perspective scaling
            const screenX = centerX + (s.x - centerX) * scale
            const screenY = centerY + (s.y - centerY) * scale
            
            // Only draw if star is on screen (early exit for better performance)
            if (screenX < 0 || screenX > innerWidth || screenY < 0 || screenY > innerHeight) {
              continue
            }
            
            // Calculate brightness based on distance (closer = brighter)
            const brightness = Math.max(0.1, 1 - (s.z / s.maxZ))
            const alpha = Math.min(1, brightness * 2)
            
            // Set star color with brightness
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            
            // Draw star with size based on distance
            const starSize = Math.max(0.5, s.size * scale)
            if (starSize <= 1.5) {
              ctx.fillRect(screenX, screenY, 1, 1)
            } else {
              ctx.beginPath()
              ctx.arc(screenX, screenY, starSize * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
          }
          animationFrameId = requestAnimationFrame(draw)
        } catch (error) {
          console.warn('Transition star animation error:', error)
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(draw)
          }, 100)
        }
      }
      
      console.log('Starting transition star animation with', stars.length, 'stars')
      
      // Use requestIdleCallback for better performance if available
      const startAnimation = () => {
        animationFrameId = requestAnimationFrame(draw)
      }
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(startAnimation)
      } else {
        startAnimation()
      }

      return () => {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener('resize', resize)
      }
    }

    const cleanup = initTransitionStarfield()
    return cleanup
  }, [showTransitionVideo])

  // Initialize canvas starfield for selection page
  useEffect(() => {
    if (!showFinalImage) return // Only run when selection page is visible
    
    const initSelectionStarfield = () => {
      const canvas = starCanvasRef.current
      if (!canvas) {
        setTimeout(initSelectionStarfield, 100)
        return
      }
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setTimeout(initSelectionStarfield, 100)
        return
      }

      let animationFrameId = 0
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

      const resize = () => {
        const { innerWidth, innerHeight } = window
        canvas.width = Math.floor(innerWidth * dpr)
        canvas.height = Math.floor(innerHeight * dpr)
        canvas.style.width = innerWidth + 'px'
        canvas.style.height = innerHeight + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      resize()
      window.addEventListener('resize', resize)

      type Star = { x: number; y: number; size: number; speed: number; dir: 'v' | 'h' }
      const stars: Star[] = []
      const createStars = (count: number) => {
        stars.length = 0
        const { innerWidth, innerHeight } = window
        for (let i = 0; i < count; i++) {
          const isVertical = i % 2 === 0
          const size = Math.random() < 0.15 ? 2.4 : Math.random() < 0.35 ? 1.8 : 1.1
          const speedBase = isVertical ? 18 : 16
          const speedJitter = Math.random() * 10
          stars.push({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            size,
            speed: speedBase + speedJitter,
            dir: isVertical ? 'v' : 'h'
          })
        }
      }

      // Density based on viewport size
      const density = Math.floor((window.innerWidth * window.innerHeight) / 18000)
      createStars(Math.max(120, Math.min(320, density)))

      const draw = () => {
        try {
          const { innerWidth, innerHeight } = window
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, innerWidth, innerHeight)

          ctx.fillStyle = '#fff'
          const deltaTime = 0.016
          const margin = 5
          
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i]
            if (s.dir === 'v') {
              s.y += s.speed * deltaTime
              if (s.y > innerHeight + margin) {
                s.y = -margin
                s.x = Math.random() * innerWidth
              }
            } else {
              s.x += s.speed * deltaTime
              if (s.x > innerWidth + margin) {
                s.x = -margin
                s.y = Math.random() * innerHeight
              }
            }

            // simple square for speed; arc is costlier. small sizes use 1x1, larger use small circle
            if (s.size <= 1.2) {
              ctx.fillRect(s.x, s.y, 1, 1)
            } else {
              ctx.beginPath()
              ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          animationFrameId = requestAnimationFrame(draw)
        } catch (error) {
          console.warn('Selection star animation error:', error)
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(draw)
          }, 100)
        }
      }

      animationFrameId = requestAnimationFrame(draw)

      return () => {
        cancelAnimationFrame(animationFrameId)
        window.removeEventListener('resize', resize)
      }
    }

    const cleanup = initSelectionStarfield()
    return cleanup
  }, [showFinalImage])

  // Hide loading screen when video and images are loaded
  useEffect(() => {
    if (videoLoaded && imagesLoaded >= totalImages) {
      setTimeout(() => {
        setShowLoadingScreen(false)
      }, 500) // Small delay for smooth transition
    }
  }, [videoLoaded, imagesLoaded, totalImages])

  // Handle enter space button click
  const handleEnterSpace = () => {
    setTextFading(true)
    setShowButton(false)
    
    // After all elements fade out, show transition video
    setTimeout(() => {
      setShowTransitionVideo(true)
      
      // After transition video completes (1 second), show bright white animation
      // Keep video playing while bright animation starts
      setTimeout(() => {
        setShowTransition(true)
        
        // Show final image after fade-in completes
        setTimeout(() => {
          setShowFinalImage(true)
          // Hide transition video only after final image is shown
          setShowTransitionVideo(false)
        }, 1000) // Duration of fade-in effect
      }, 1000) // Duration of transition video
    }, 1000) // Duration of fade-out animation
  }

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.classList.contains('planet-card') || 
                    target.closest('.planet-card'))) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [])

  // Function to handle planet clicks
  const handlePlanetClick = (planetName: string, event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    if (!target) return
    
    const rect = target.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setPlanetPosition({ x: centerX, y: centerY })
    setSelectedPlanet(planetName)
    setShowPlanetTransition(true)
    
    // After planet scale animation, directly show modal
    setTimeout(() => {
      setShowPlanetTransition(false)
      setShowModal(true)
    }, 1500) // Duration of planet scale animation
  }

  // Function to close modal
  const handleCloseModal = () => {
    setIsClosing(true)
    
    // After modal shrinks to center, show planet return animation
    setTimeout(() => {
      setShowModal(false)
      setShowPlanetReturn(true)
      setIsClosing(false)
      
      // After planet returns to position, hide everything
      setTimeout(() => {
        setShowPlanetReturn(false)
        setSelectedPlanet('')
      }, 1000) // Duration of planet return animation
    }, 600) // Duration of modal shrink animation
  }

  // Function to handle back to home
  const handleBackToHome = () => {
    setShowBackTransition(true)
    
    // After fade transition, reset all states to go back to home
    setTimeout(() => {
      setShowFinalImage(false)
      setShowTransition(false)
      setTextFading(false)
      setShowButton(true)
      setDisplayedText('')
      setDisplayedSubtitle('')
      setShowCursor(false)
      setShowSubtitleCursor(false)
      setShowBackTransition(false)
      setShowTransitionVideo(false)
      
      // Restart typing effects by incrementing the key
      setTypingKey(prev => prev + 1)
    }, 1000) // Duration of fade transition
  }

  if (showFinalImage) {
    const orbitPlanets = [
      { name: 'Cosmic Profile', image: '/planet1.png', description: 'A quick snapshot of who I am.' },
      { name: 'Asteroid Belt of Skills', image: '/planet2.png', description: 'Technologies and tools I work with.' },
      { name: 'Cosmic Creations', image: '/planet3.png', description: 'Selected work and side projects.' },
      { name: 'Journey Through Space', image: '/planet4.png', description: 'Roles and journeys so far.' },
      { name: 'Constellation of Proof', image: '/planet5.png', description: 'Achievements and credentials.' },
    ]

    useEffect(() => {
      let scrolling = false
      const onWheel = (e: WheelEvent) => {
        // Don't handle wheel events when modal is open
        if (showModal) return
        
        if (!e.deltaY) return
        e.preventDefault()
        if (scrolling) return
        scrolling = true
        const forward = e.deltaY > 0
        setOrbitRotationDeg(prev => prev + (forward ? -72 : 72))
        setCurrentOrbitIndex(prev => (prev + (forward ? 1 : -1) + orbitPlanets.length) % orbitPlanets.length)
        setTimeout(() => { scrolling = false }, 350)
      }
      window.addEventListener('wheel', onWheel, { passive: false })
      return () => window.removeEventListener('wheel', onWheel as any)
    }, [showModal])
    return (
      <div className="selection-page-container">
        {/* Custom Cursor */}
        <div 
          className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        >
          <div className="cursor-dot"></div>
          <div className="cursor-ring"></div>
        </div>

        {/* Space Background */}
        <div className="selection-background">
          <canvas ref={starCanvasRef} className="star-canvas"></canvas>
        </div>

        {/* Header */}
        <div className="portfolio-header">
          <div className="header-content">
            <h1 className="header-title">Mayank's Portfolio</h1>
            <button className="header-home-button" onClick={handleBackToHome}>
              <span className="home-icon">🏠</span>
              <span className="home-text">Home</span>
            </button>
          </div>
        </div>

        {/* Left info panel */}
        <div className="selection-info">
          <div className="selection-info-inner">
            <div className="selection-info-label">Current Planet</div>
            <div className="selection-info-name">{orbitPlanets[currentOrbitIndex].name}</div>
            <div className="selection-info-desc">{orbitPlanets[currentOrbitIndex].description}</div>
          </div>
        </div>

        {/* Scroll Indicator with Curved Arrows */}
        <div className="scroll-indicator">
          <div className="scroll-arrow scroll-arrow-top">
            <svg viewBox="0 0 100 50" className="curved-arrow">
              <path d="M 20 40 Q 50 10 80 40" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M 75 35 L 80 40 L 75 45" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="scroll-text">Scroll to explore other planets</div>
          <div className="scroll-arrow scroll-arrow-bottom">
            <svg viewBox="0 0 100 50" className="curved-arrow">
              <path d="M 20 10 Q 50 40 80 10" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M 75 15 L 80 10 L 75 5" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>


        {/* Bright overlay for back transition */}
        {showBackTransition && (
          <div className="bright-overlay"></div>
        )}

        {/* Planet scale animation overlay */}
        {showPlanetTransition && (
          <div className="planet-scale-overlay">
            <div 
              className="scaling-planet"
              style={{
                '--planet-x': `${planetPosition.x}px`,
                '--planet-y': `${planetPosition.y}px`,
              } as any}
            >
              <img 
                src={`/planet${selectedPlanet === 'Cosmic Profile' ? '1' : selectedPlanet === 'Asteroid Belt of Skills' ? '2' : selectedPlanet === 'Cosmic Creations' ? '3' : selectedPlanet === 'Journey Through Space' ? '4' : selectedPlanet === 'Constellation of Proof' ? '5' : '1'}.png`} 
                alt={selectedPlanet} 
                className="scaling-planet-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        )}


        {/* Planet return animation */}
        {showPlanetReturn && (
          <div className="planet-return-overlay">
            <div 
              className="returning-planet"
              style={{
                '--planet-x': `${planetPosition.x}px`,
                '--planet-y': `${planetPosition.y}px`,
              } as any}
            >
              <img 
                src={`/planet${selectedPlanet === 'Cosmic Profile' ? '1' : selectedPlanet === 'Asteroid Belt of Skills' ? '2' : selectedPlanet === 'Cosmic Creations' ? '3' : selectedPlanet === 'Journey Through Space' ? '4' : selectedPlanet === 'Constellation of Proof' ? '5' : '1'}.png`} 
                alt={selectedPlanet} 
                className="returning-planet-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        )}

        {/* Full-screen Modal */}
        {showModal && (
          <div className="fullscreen-modal" onClick={handleCloseModal}>
            <div 
              className={`fullscreen-content ${isClosing ? 'closing' : ''}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                '--planet-x': `${planetPosition.x}px`,
                '--planet-y': `${planetPosition.y}px`,
              } as any}
            >
              {/* Left side - Planet Image */}
              <div className="planet-section">
                <img 
                  src={`/planet${selectedPlanet === 'Cosmic Profile' ? '1' : selectedPlanet === 'Asteroid Belt of Skills' ? '2' : selectedPlanet === 'Cosmic Creations' ? '3' : selectedPlanet === 'Journey Through Space' ? '4' : selectedPlanet === 'Constellation of Proof' ? '5' : '1'}.png`} 
                  alt={selectedPlanet} 
                  className="fullscreen-planet-image"
                  loading="eager"
                  decoding="async"
                />
                <div className="planet-glow"></div>
              </div>
              
              {/* Right side - Content */}
              <div className="content-section">
                <div className="content-header">
                  <h1 className="content-title">{selectedPlanet}</h1>
                  <button className="content-close" onClick={handleCloseModal}>
                    <span className="close-icon">←</span>
                  </button>
                </div>
                <div className="content-body">
                  {selectedPlanet === 'Asteroid Belt of Skills' ? (
                    <div className="skills-content">
                      <div className="skills-category">
                        <h3 className="category-title">Frontend</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/HTML.png" alt="HTML" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">HTML</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/CSS.png" alt="CSS" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">CSS</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/JAVASCRIPT.png" alt="JavaScript" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">JavaScript</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/REACT.png" alt="React.js" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">React.js</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/NEXTJS.png" alt="Next.js" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Next.js</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="skills-category">
                        <h3 className="category-title">Backend</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/PYTHON.png" alt="Python" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Python</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/NODEJS.png" alt="Node.js" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Node.js</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/spring-boot.png" alt="Spring Boot" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Spring Boot</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="skills-category">
                        <h3 className="category-title">Databases</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/SQL.png" alt="SQL" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">SQL</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/FIREBASE.png" alt="Firebase" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Firebase</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="skills-category">
                        <h3 className="category-title">AI/ML</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/PROMPT.png" alt="Prompt Engineering" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Prompt Engineering</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="skills-category">
                        <h3 className="category-title">Tools</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              <img src="/CANVA.png" alt="Canva" loading="lazy" decoding="async" />
                            </div>
                            <span className="skill-text">Canva</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlanet === 'Cosmic Profile' ? (
                    <div className="about-content">
                      <div className="about-section profile-section">
                        <div className="profile-picture-container">
                          <img src="/ProfessionalPhotoBG.jpg" alt="Profile Picture" className="profile-picture" loading="lazy" decoding="async" />
                        </div>
                        <p className="about-description">
                          I am a passionate software developer with a strong enthusiasm for creating innovative and efficient
                          solutions. I enjoy exploring new technologies, solving complex problems, and continuously improving my
                          skills to deliver impactful projects.
                        </p>
                      </div>
                      
                      <div className="about-section">
                        <h3 className="section-title">Contact Me</h3>
                        <div className="contact-grid">
                          <div className="contact-item">
                            <div className="contact-icon">📍</div>
                            <span className="contact-text">Mysore, India</span>
                          </div>
                          <div className="contact-item">
                            <div className="contact-icon">📧</div>
                            <span className="contact-text">mayankmjain16@gmail.com</span>
                          </div>
                          <div className="contact-item">
                            <div className="contact-icon">📱</div>
                            <span className="contact-text">9483234360</span>
                          </div>
                          <a href="https://www.linkedin.com/in/mayank-m-bb8b41281?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="contact-button linkedin">
                            <div className="contact-icon">💼</div>
                            <span className="contact-text">LinkedIn</span>
                          </a>
                          <a href="https://github.com/Mayank-M1504" target="_blank" rel="noopener noreferrer" className="contact-button github">
                            <div className="contact-icon">🐙</div>
                            <span className="contact-text">GitHub</span>
                          </a>
                        </div>
                      </div>
                      
                      <div className="about-section">
                        <h3 className="section-title">Education</h3>
                        <div className="education-list">
                          <div className="education-item">
                            <span className="institution">Sadvidya Composite PU College, Mysore</span>
                            <span className="degree">PUC</span>
                            <span className="grade">89%</span>
                          </div>
                          <div className="education-item">
                            <span className="institution">ATME College of Engineering, Mysore</span>
                            <span className="degree">B.E</span>
                            <span className="grade">8.77 CGPA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlanet === 'Cosmic Creations' ? (
                    <div className="projects-content">
                      <div className="project-item">
                        <div className="project-title-container">
                          <h3 className="project-title">Awesome.Co Website</h3>
                          <a href="https://awesomecom.netlify.app/" target="_blank" rel="noopener noreferrer" className="project-link">
                            <span className="link-icon">🔗</span>
                          </a>
                        </div>
                        <p className="project-description">
                          A custom clothing brand website offering high-quality, personalized hoodies and t-shirts.
                          Features include product customization, responsive design, and direct WhatsApp ordering.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Improved the sales by 30%</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/HTML.png" alt="HTML" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/CSS.png" alt="CSS" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/JAVASCRIPT.png" alt="JavaScript" className="tech-icon" loading="lazy" decoding="async" />
                            
                          </div>
                        </div>
                      </div>

                      <div className="project-item">
                        <h3 className="project-title">Accident Detection Model</h3>
                        <p className="project-description">
                          A real-time accident detection system using YOLOv8 for object detection with a Tkinter based GUI
                          frontend. Supports webcam and video inputs, CSV export, and real-time alerts.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Improved detection response time by 40%</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/PYTHON.png" alt="Python" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/PROMPT.png" alt="AI/ML" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>

                      <div className="project-item">
                        <h3 className="project-title">Traffic Density Management System</h3>
                        <p className="project-description">
                          An AI-based system that adjusts signal order based on vehicle density to reduce congestion.
                          Includes emergency route control via app-triggered green signals.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Achieved 97.2% accuracy on test dataset</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/PYTHON.png" alt="Python" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/PROMPT.png" alt="AI/ML" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>

                      <div className="project-item">
                        <h3 className="project-title">Campus-Connect</h3>
                        <p className="project-description">
                          A student-centric social media app combining LinkedIn and Instagram features. Helps students
                          connect, share updates, and find teammates for events.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Student engagement platform</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/flutter.png" alt="React" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/FIREBASE.png" alt="Firebase" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>

                      <div className="project-item">
                        <h3 className="project-title">Admission Automation System</h3>
                        <p className="project-description">
                          The Admission Automation System streamlines the student enrollment process by digitizing document submission, 
                          verification, and approval. Colleges upload student documents, which are automatically verified using OCR and 
                          AI-based validation. Verified data is securely stored in a database, and admission status is instantly updated 
                          on the university portal.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Eliminates manual errors and reduces processing time</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/PYTHON.png" alt="Python" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/REACT.png" alt="React" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/PROMPT.png" alt="AI/ML" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/SQL.png" alt="SQL" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>

                      <div className="project-item">
                        <h3 className="project-title">FluffWalks <span className="project-status">(Under Progress)</span></h3>
                        <p className="project-description">
                          FluffWalks is a smart pet-walking and care management system designed to simplify pet owners' daily routines. 
                          It connects pet owners with trusted walkers, enables real-time tracking of walks, and ensures pet safety with 
                          route monitoring and activity logs. The platform enhances convenience while creating a reliable ecosystem for 
                          both pet parents and walkers.
                        </p>
                        <div className="project-impact">
                          <span className="impact-text">Smart pet care management platform</span>
                        </div>
                        <div className="tech-stack">
                          <h4 className="tech-title">Tech Stack</h4>
                          <div className="tech-icons">
                            <img src="/REACT.png" alt="React" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/NODEJS.png" alt="Node.js" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/SQL.png" alt="SQL" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlanet === 'Journey Through Space' ? (
                    <div className="experience-content">
                      <div className="experience-item">
                        <div className="experience-header">
                          <h3 className="experience-title">Full Stack Intern</h3>
                          <span className="experience-company">Zidio Development</span>
                        </div>
                        <div className="experience-duration">April 2025 - July 2025</div>
                        <div className="experience-description">
                          <p>
                            Developed a Job Portal for students, making it easier for them to find relevant opportunities.
                            Implemented various technologies such as JWT for authentication, integrated email services, and cloud file storage 
                            ensured a smooth, user-friendly experience.
                          </p>
                        </div>
                        <div className="experience-tech-stack">
                          <h4 className="tech-title">Technologies Used</h4>
                          <div className="tech-icons">
                            <img src="/NEXTJS.png" alt="Next.js" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/spring-boot.png" alt="Spring-boot" className="tech-icon" loading="lazy" decoding="async" />
                            <img src="/SQL.png" alt="SQL" className="tech-icon" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlanet === 'Constellation of Proof' ? (
                    <div className="certifications-content">
                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">Make4Mysore Hackathon</h3>
                        </div>
                        <div className="certification-issuer">IEEE Smart Cities</div>
                        <div className="certification-date">October 2024</div>
                        <div className="certification-credential">
                          <span className="credential-text">Hackathon Participation</span>
                          <a href="https://drive.google.com/file/d/10NS5_O7EnMjznG5IuaI9_C-F1jEBCqOR/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">HacXerve</h3>
                        </div>
                        <div className="certification-issuer">VVCE (Vidyavardhaka College)</div>
                        <div className="certification-date">February 2025</div>
                        <div className="certification-credential">
                          <span className="credential-text">Hackathon Participation</span>
                          <a href="https://drive.google.com/file/d/10haF9m6R7h18eOY_6o9IXYADV-iF-ytX/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">Programming in Java</h3>
                        </div>
                        <div className="certification-issuer">NPTEL</div>
                        <div className="certification-date">October 2024</div>
                        <div className="certification-credential">
                          <span className="credential-text">Course Completion</span>
                          <a href="https://drive.google.com/file/d/10Ipdhsux5O6aX9E894qazCOyAaRo_8gr/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">Programming in Modern C++</h3>
                        </div>
                        <div className="certification-issuer">NPTEL</div>
                        <div className="certification-date">April 2024</div>
                        <div className="certification-credential">
                          <span className="credential-text">Course Completion</span>
                          <a href="https://drive.google.com/file/d/10Ipdhsux5O6aX9E894qazCOyAaRo_8gr/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">Prompthon</h3>
                        </div>
                        <div className="certification-issuer">IVIS Lab</div>
                        <div className="certification-date">February 2025</div>
                        <div className="certification-credential">
                          <span className="credential-text">Event Participation</span>
                          <a href="https://drive.google.com/file/d/10Ip2teZ4piB1VhAiC93zRoUxbY0bBQGT/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">Teckavishkar 2.0</h3>
                        </div>
                        <div className="certification-issuer">ATME College of Engineering</div>
                        <div className="certification-date">May 2025</div>
                        <div className="certification-credential">
                          <span className="credential-text">Event Participation</span>
                          <a href="https://drive.google.com/file/d/18lwesUQxbf3wdeQXi22Dq6dSfzIcsIAu/view" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>

                      <div className="certification-item">
                        <div className="certification-header">
                          <h3 className="certification-title">HackFusion1.0</h3>
                        </div>
                        <div className="certification-issuer">MIT Mysore</div>
                        <div className="certification-date">September 2025</div>
                        <div className="certification-credential">
                          <span className="credential-text">Hackathon</span>
                          <a href="https://drive.google.com/file/d/1l5pp0R_qlw3mSHrpYRcXl1Oj_uJUSXQf/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="certification-link">
                            View Certificate →
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="content-description">
                      This is the {selectedPlanet} section. Content will be added here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Starfield replaces background video */}

        {/* Orbit Interface */}
        <div className="orbit-interface">
          <div className="orbit-viewport">
            <div 
              ref={orbitRef}
              className="orbit"
              style={{
                '--orbit-rotation': `${orbitRotationDeg}deg`,
              } as any}
            >
              {orbitPlanets.map((p, i) => (
                <button
                  key={p.name}
                  className={`orbit-planet ${i === currentOrbitIndex ? 'visible' : ''}`}
                  onClick={(e) => handlePlanetClick(p.name, e as any)}
                  aria-label={p.name}
                >
                  <img src={p.image} alt={p.name} className="planet-image" loading="eager" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-container">
      {/* Loading Screen */}
      {showLoadingScreen && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Universe...</div>
            <div className="loading-progress">
              <div 
                className="loading-bar" 
                style={{ 
                  width: `${Math.round(((videoLoaded ? 1 : 0) + imagesLoaded) / (1 + totalImages) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="loading-percentage">
              {Math.round(((videoLoaded ? 1 : 0) + imagesLoaded) / (1 + totalImages) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      >
        <div className="cursor-dot"></div>
        <div className="cursor-ring"></div>
      </div>

      {/* Background Starfield (Home) */}
      <div className="video-container">
        <canvas ref={homeStarCanvasRef} className="background-video"></canvas>
      </div>

      {/* Transition Video Overlay */}
      {showTransitionVideo && (
        <div className="transition-video-overlay">
          <canvas ref={transitionStarCanvasRef} className="transition-star-canvas"></canvas>
        </div>
      )}

      {/* Bright overlay for transition effect */}
      {showTransition && (
        <div className="bright-overlay"></div>
      )}

      {/* Text at top-left */}
      <div className={`title-text ${textFading ? 'fading' : ''}`}>
        {displayedText}
        <span className={`typing-cursor ${showCursor ? 'visible' : 'hidden'}`}>_</span>
      </div>

      {/* Subtitle text below main title */}
      <div className={`subtitle-text ${textFading ? 'fading' : ''}`}>
        {displayedSubtitle}
        <span className={`typing-cursor ${showSubtitleCursor ? 'visible' : 'hidden'}`}>_</span>
      </div>

      {/* Earth Image Container */}
      <div className={`earth-container ${textFading ? 'fading' : ''}`}>
        <div className="earth-glow"></div>
        <img src="/earth.png" alt="Earth" className="earth-image" loading="lazy" decoding="async" />
      </div>

      {/* Enter Space Button */}
      {showButton && (
        <div className="enter-space-container">
          <button className="enter-space-button" onClick={handleEnterSpace}>
            Launch Exploration
          </button>
        </div>
      )}




    </div>
  )
}

