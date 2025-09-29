import { useEffect, useRef, useState } from 'preact/hooks'
import './app.css'

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)
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
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false)
  const [transitionVideoLoaded, setTransitionVideoLoaded] = useState(false)
  const [showExaminingText, setShowExaminingText] = useState(false)
  const [examiningText, setExaminingText] = useState('')
  const [showExaminingCursor, setShowExaminingCursor] = useState(true)
  const [showPlanetReturn, setShowPlanetReturn] = useState(false)
  const [showTransitionVideo, setShowTransitionVideo] = useState(false)
  const [textFading, setTextFading] = useState(false)
  const [showButton, setShowButton] = useState(true)

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

  // Typing effect for examining text
  useEffect(() => {
    if (!showExaminingText) {
      setExaminingText('')
      return
    }

    const fullText = "Examining planet..."
    let currentIndex = 0
    let timeoutId: number

    const typeText = () => {
      if (currentIndex < fullText.length) {
        setExaminingText(fullText.slice(0, currentIndex + 1))
        currentIndex++
        timeoutId = setTimeout(typeText, 120) // 120ms delay between characters
      } else {
        setShowExaminingCursor(true)
      }
    }

    // Start typing after a short delay
    const startTyping = setTimeout(() => {
      typeText()
    }, 300)

    return () => {
      clearTimeout(startTyping)
      clearTimeout(timeoutId)
    }
  }, [showExaminingText])

  // Cursor blinking effect for examining text
  useEffect(() => {
    if (!showExaminingText) return

    const interval = setInterval(() => {
      setShowExaminingCursor(prev => !prev)
    }, 500) // Blink every 500ms

    return () => clearInterval(interval)
  }, [showExaminingText])

  // Handle enter space button click
  const handleEnterSpace = () => {
    setTextFading(true)
    setShowButton(false)
    
    // After all elements fade out, show transition video
    setTimeout(() => {
      setShowTransitionVideo(true)
      
      // After transition video completes (2 seconds), show bright white animation
      // Keep video playing while bright animation starts
      setTimeout(() => {
        setShowTransition(true)
        
        // Show final image after fade-in completes
        setTimeout(() => {
          setShowFinalImage(true)
          // Hide transition video only after final image is shown
          setShowTransitionVideo(false)
        }, 1000) // Duration of fade-in effect
      }, 2000) // Duration of transition video
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
    
    // After planet scale animation, show black screen with typing
    setTimeout(() => {
      setShowPlanetTransition(false)
      setShowExaminingText(true)
      
      // After typing completes, show modal
      setTimeout(() => {
        setShowModal(true)
        setShowExaminingText(false)
      }, 3000) // Duration for typing animation
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
        

        {/* Selection Page Title */}
        <div className="selection-title">
          <h1 className="selection-main-title">Discover My Universe</h1>
        </div>

        {/* Back to Home Arrow */}
        {!showExaminingText && (
          <div className="back-arrow" onClick={handleBackToHome}>
            <div className="arrow-icon">↑</div>
          </div>
        )}

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
                src={`/planet${selectedPlanet === 'About Me' ? '1' : selectedPlanet === 'Skills' ? '2' : selectedPlanet === 'Projects' ? '3' : selectedPlanet === 'Experience' ? '4' : selectedPlanet === 'Certifications' ? '5' : '1'}.png`} 
                alt={selectedPlanet} 
                className="scaling-planet-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        )}

        {/* Black screen with examining text */}
        {showExaminingText && (
          <div className="examining-screen">
            <div className="examining-text">
              {examiningText}
              <span className={`typing-cursor ${showExaminingCursor ? 'visible' : 'hidden'}`}>_</span>
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
                src={`/planet${selectedPlanet === 'About Me' ? '1' : selectedPlanet === 'Skills' ? '2' : selectedPlanet === 'Projects' ? '3' : selectedPlanet === 'Experience' ? '4' : selectedPlanet === 'Certifications' ? '5' : '1'}.png`} 
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
                  src={`/planet${selectedPlanet === 'About Me' ? '1' : selectedPlanet === 'Skills' ? '2' : selectedPlanet === 'Projects' ? '3' : selectedPlanet === 'Experience' ? '4' : selectedPlanet === 'Certifications' ? '5' : '1'}.png`} 
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
                  {selectedPlanet === 'Skills' ? (
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
                  ) : selectedPlanet === 'Projects' ? (
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
                    </div>
                  ) : selectedPlanet === 'Experience' ? (
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
                  ) : selectedPlanet === 'Certifications' ? (
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
          className={`background-video ${backgroundVideoLoaded ? 'loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setBackgroundVideoLoaded(true)}
          onCanPlay={() => setBackgroundVideoLoaded(true)}
        >
          <source src="/space1.mp4" type="video/mp4" />
        </video>

        {/* HUD Interface */}
        <div className="hud-interface">
          {/* About Me Planet - Bottom Left */}
          <div className="planet-card about-me" onClick={(e) => handlePlanetClick('About Me', e)}>
            <img src="/planet1.png" alt="About Me" className="planet-image" loading="eager" decoding="async" />
            <div className="planet-label">
              <span className="label-text">Cosmic Profile</span>
            </div>
          </div>

          {/* Skills Planet - Top Left */}
          <div className="planet-card skills" onClick={(e) => handlePlanetClick('Skills', e)}>
            <img src="/planet2.png" alt="Skills" className="planet-image" loading="eager" decoding="async" />
            <div className="planet-label">
              <span className="label-text">Asteroid Belt of Skills</span>
            </div>
          </div>

          {/* Projects Planet - Top Right */}
          <div className="planet-card projects" onClick={(e) => handlePlanetClick('Projects', e)}>
            <img src="/planet3.png" alt="Projects" className="planet-image" loading="eager" decoding="async" />
            <div className="planet-label">
              <span className="label-text">Cosmic Creations</span>
            </div>
          </div>

          {/* Experience Planet - Bottom Right */}
          <div className="planet-card experience" onClick={(e) => handlePlanetClick('Experience', e)}>
            <img src="/planet4.png" alt="Experience" className="planet-image" loading="eager" decoding="async" />
            <div className="planet-label">
              <span className="label-text">Journey Through Space-Time</span>
            </div>
          </div>

          {/* Certifications Planet - Center Left */}
          <div className="planet-card certifications" onClick={(e) => handlePlanetClick('Certifications', e)}>
            <img src="/planet5.png" alt="Certifications" className="planet-image" loading="eager" decoding="async" />
            <div className="planet-label">
              <span className="label-text">Constellation of Proof</span>
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
          className={`background-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
        >
          <source src="/Intro.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Transition Video Overlay */}
      {showTransitionVideo && (
        <div className="transition-video-overlay">
          <video
            className={`transition-video ${transitionVideoLoaded ? 'loaded' : ''}`}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setTransitionVideoLoaded(true)}
            onCanPlay={() => setTransitionVideoLoaded(true)}
          >
            <source src="/Transition.mp4" type="video/mp4" />
          </video>
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