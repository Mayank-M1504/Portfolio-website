import { useEffect, useRef, useState } from 'preact/hooks'
import './app.css'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [showFinalImage, setShowFinalImage] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [rocketFlying, setRocketFlying] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Ensure video is paused on load
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  // Reset rocket position when component mounts
  useEffect(() => {
    setRocketFlying(false)
  }, [])

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Trigger animation when user scrolls down a bit (e.g., 10px)
      if (scrollTop > 10 && !hasTriggered) {
        setHasTriggered(true)
        setIsAnimating(true)
        
        // Play video for 1 second
        if (videoRef.current) {
          videoRef.current.currentTime = 0
          videoRef.current.play().then(() => {
            // Start rocket animation when video starts playing
            setRocketFlying(true)
            
            // Pause after 1 second
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.pause()
              }
            }, 1000)
          }).catch(console.error)
        }

        // Start bright fade-in effect after a short delay
        setTimeout(() => {
          setShowTransition(true)
          
          // Show final image after fade-in completes
          setTimeout(() => {
            setShowFinalImage(true)
          }, 1000) // Duration of fade-in effect
        }, 500)
      }
    }

    // Add scroll listener to document
    document.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      document.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasTriggered])


  if (showFinalImage) {
    return (
      <div className="selection-page-container">
        {/* Space Background */}
        <div className="selection-background">
          <img src="/space.jpg" alt="Space Background" className="selection-bg-image" />
        </div>

        {/* HUD Interface */}
        <div className="hud-interface">
          {/* About Me Planet - Bottom Left */}
          <div className="planet-card about-me" onClick={() => console.log('About Me clicked')}>
            <img src="/planet1.png" alt="About Me" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">About Me</span>
              <div className="connector-line"></div>
            </div>
          </div>

          {/* Skills Planet - Top Left */}
          <div className="planet-card skills" onClick={() => console.log('Skills clicked')}>
            <img src="/planet2.png" alt="Skills" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Skills</span>
              <div className="connector-line"></div>
            </div>
          </div>

          {/* Projects Planet - Top Right */}
          <div className="planet-card projects" onClick={() => console.log('Projects clicked')}>
            <img src="/planet3.png" alt="Projects" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Projects</span>
              <div className="connector-line"></div>
            </div>
          </div>

          {/* Experience Planet - Bottom Right */}
          <div className="planet-card experience" onClick={() => console.log('Experience clicked')}>
            <img src="/planet4.png" alt="Experience" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Experience</span>
              <div className="connector-line"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-container">
      {/* Background Video */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="background-video"
          muted
          playsInline
          preload="auto"
        >
          <source src="/earth.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Bright overlay for transition effect */}
      {showTransition && (
        <div className="bright-overlay"></div>
      )}

      {/* Text at top-left */}
      <div className="title-text">
        Mayank's Portfolio
      </div>



      {/* Rocket at bottom center */}
      <div className={`rocket-container ${rocketFlying ? 'rocket-flying' : ''}`}>
        <img 
          src="/rocket.png" 
          alt="Rocket" 
          className="rocket"
        />
      </div>

      {/* Scrollable content below - blank sections only */}
      <div className="scroll-content">
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
        
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
        
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
        
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
        
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
        
        <div className="scroll-section blank-section">
          <div style={{ height: '100vh' }}></div>
        </div>
      </div>
    </div>
  )
}