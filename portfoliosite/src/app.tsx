import { useEffect, useRef, useState } from 'preact/hooks'
import './app.css'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [showFinalImage, setShowFinalImage] = useState(false)
  const [rocketFlying, setRocketFlying] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
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

  // Typing effect for title text
  useEffect(() => {
    const fullText = "Mayank's Portfolio"
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

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Trigger animation when user scrolls down a bit (e.g., 10px)
      if (scrollTop > 10 && !hasTriggered) {
        setHasTriggered(true)
        
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

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.classList.contains('planet-card') || 
                    target.classList.contains('back-arrow') ||
                    target.closest('.planet-card') ||
                    target.closest('.back-arrow'))) {
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
    
    // After bright transition, show full-screen modal
    setTimeout(() => {
      setShowModal(true)
      setShowPlanetTransition(false)
    }, 1000) // Duration of bright transition
  }

  // Function to close modal
  const handleCloseModal = () => {
    setIsClosing(true)
    
    // After animation completes, hide modal
    setTimeout(() => {
      setShowModal(false)
      setSelectedPlanet('')
      setIsClosing(false)
    }, 600) // Duration of close animation
  }

  // Function to handle back to home
  const handleBackToHome = () => {
    setShowBackTransition(true)
    
    // After fade transition, reset all states to go back to home
    setTimeout(() => {
      setShowFinalImage(false)
      setShowTransition(false)
      setRocketFlying(false)
      setHasTriggered(false)
      setDisplayedText('')
      setDisplayedSubtitle('')
      setShowCursor(false)
      setShowSubtitleCursor(false)
      setShowBackTransition(false)
      
      // Reset video
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      
      // Restart typing effects by incrementing the key
      setTypingKey(prev => prev + 1)
    }, 1000) // Duration of fade transition
  }

  if (showFinalImage) {
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
          <img src="/space.jpg" alt="Space Background" className="selection-bg-image" />
        </div>

        {/* Back to Home Arrow */}
        <div className="back-arrow" onClick={handleBackToHome}>
          <div className="arrow-icon">↑</div>
        </div>

        {/* Bright overlay for back transition */}
        {showBackTransition && (
          <div className="bright-overlay"></div>
        )}

        {/* Bright overlay for planet transition */}
        {showPlanetTransition && (
          <div className="bright-overlay"></div>
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
                  src={`/planet${selectedPlanet === 'About Me' ? '1' : selectedPlanet === 'Skills' ? '2' : selectedPlanet === 'Projects' ? '3' : '4'}.png`} 
                  alt={selectedPlanet} 
                  className="fullscreen-planet-image" 
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
                  {selectedPlanet === 'Skills' ? (
                    <div className="skills-content">
                      <div className="skills-category">
                        <h3 className="category-title">Frontend</h3>
                        <div className="skills-list">
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* HTML logo will go here */}
                            </div>
                            <span className="skill-text">HTML</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* CSS logo will go here */}
                            </div>
                            <span className="skill-text">CSS</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* JavaScript logo will go here */}
                            </div>
                            <span className="skill-text">JavaScript</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* React.js logo will go here */}
                            </div>
                            <span className="skill-text">React.js</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* Next.js logo will go here */}
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
                              {/* Python logo will go here */}
                            </div>
                            <span className="skill-text">Python</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* Node.js logo will go here */}
                            </div>
                            <span className="skill-text">Node.js</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* Spring Boot logo will go here */}
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
                              {/* SQL logo will go here */}
                            </div>
                            <span className="skill-text">SQL</span>
                          </div>
                          <div className="skill-item">
                            <div className="skill-logo">
                              {/* Firebase logo will go here */}
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
                              {/* Prompt Engineering logo will go here */}
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
                              {/* Canva logo will go here */}
                            </div>
                            <span className="skill-text">Canva</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedPlanet === 'About Me' ? (
                    <div className="about-content">
                      <div className="about-section">
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
                            <span className="contact-text">+91-9483234360</span>
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
                  ) : selectedPlanet === 'Projects' ? (
                    <div className="projects-content">
                      <div className="project-item">
                        <h3 className="project-title">Awesome.Co Website</h3>
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
                            {/* Tech stack icons will be added here */}
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
                            {/* Tech stack icons will be added here */}
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
                            {/* Tech stack icons will be added here */}
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
                            {/* Tech stack icons will be added here */}
                          </div>
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

        {/* Background Video */}
        <video
          ref={backgroundVideoRef}
          className={`background-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/space.mp4" type="video/mp4" />
        </video>

        {/* HUD Interface */}
        <div className="hud-interface">
          {/* About Me Planet - Bottom Left */}
          <div className="planet-card about-me" onClick={(e) => handlePlanetClick('About Me', e)}>
            <img src="/planet1.png" alt="About Me" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">About Me</span>
            </div>
          </div>

          {/* Skills Planet - Top Left */}
          <div className="planet-card skills" onClick={(e) => handlePlanetClick('Skills', e)}>
            <img src="/planet2.png" alt="Skills" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Skills</span>
            </div>
          </div>

          {/* Projects Planet - Top Right */}
          <div className="planet-card projects" onClick={(e) => handlePlanetClick('Projects', e)}>
            <img src="/planet3.png" alt="Projects" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Projects</span>
            </div>
          </div>

          {/* Experience Planet - Bottom Right */}
          <div className="planet-card experience" onClick={(e) => handlePlanetClick('Experience', e)}>
            <img src="/planet4.png" alt="Experience" className="planet-image" />
            <div className="planet-label">
              <span className="label-text">Experience</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-container">
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
        {displayedText}
        <span className={`typing-cursor ${showCursor ? 'visible' : 'hidden'}`}>_</span>
      </div>

      {/* Subtitle text below main title */}
      <div className="subtitle-text">
        {displayedSubtitle}
        <span className={`typing-cursor ${showSubtitleCursor ? 'visible' : 'hidden'}`}>_</span>
      </div>

      {/* Vertical scroll instruction text on the right */}
      <div className="scroll-instruction">
        <div className="vertical-text">scroll to start journey</div>
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