import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Github, Palette, Mail, Phone, Facebook, Youtube, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import './App.css'
//ALWAYS COMMENT OUT THE USESMOOTHSCROLL FUNCTION IF YOU ARE NOT USING IT
//ALWAYS COMMENT OUT THE USESMOOTHSCROLL FUNCTION IF YOU ARE NOT USING IT
//ALWAYS COMMENT OUT THE USESMOOTHSCROLL FUNCTION IF YOU ARE NOT USING IT
//NEVER FORGET TO COMMENT DEAR ME BECAUSE I AM A DUMMY AND I FORGET THINGS SOMETIMES
// Custom hook for smooth scrolling navigation
const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId, offset = 80) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Use scrollIntoView with smooth behavior and proper offset
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return scrollToSection
}

const katakanaChars = [
  'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
  'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', 'ガ', 'ギ', 'グ', 'ゲ',
  'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ',
  'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'
]

function App() {
  // State management
  // dont touch this its working fine dummy
  const [isLimboMasterOpen, setIsLimboMasterOpen] = useState(false)
  const [isLiveTwinsOpen, setIsLiveTwinsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('fantasy')
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('down')
  
  const audioRef = useRef(null)
  
  
  const scrollToSection = useSmoothScroll()
  
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible')
          entry.target.classList.remove('section-hidden')
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll('.intro, .about-me, .projects, .contacts')
    sections.forEach((section) => {
      section.classList.add('section-hidden')
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
  
  // Memoized event handlers omigotto
  const handleThemeChange = useCallback((theme) => {
    setCurrentTheme(theme)
    setIsThemeMenuOpen(false)
  }, [])
  
  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])
  
  const handleVolumeChange = useCallback((e) => {
    setVolume(parseFloat(e.target.value))
  }, [])
  
  const handleThemeMenuToggle = useCallback(() => {
    setIsThemeMenuOpen(prev => !prev)
  }, [])
  
  const handleCloseModal = useCallback((setter) => {
    return () => setter(false)
  }, [])
  
  // Generate matrix characters - using a fixed large number to ensure coverage (50 cols x 30 rows = 1500) 
  // did you know that the matrix is a real place in the world? i didnt know that until i watched the matrix movie and i have a cd too 
  const matrixChars = useMemo(() => 
    Array.from({ length: 1500 }, () => 
      katakanaChars[Math.floor(Math.random() * katakanaChars.length)]
    ), []
  )

  // Loading screen effect - check if first visit
  // literally on the exam the loading screen is the most important part of the website im joking by the way
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      setIsLoading(true)
      setLoadingProgress(0)
      
      // Simulate loading progress
      // jarvis stimulate it a bit 
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setIsLoading(false)
              localStorage.setItem('hasVisited', 'true')
              // Try to start audio after loading screen finishes
              // is someone really reading comments? well me afcourse
              if (currentTheme === 'fantasy' && audioRef.current) {
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.play().catch(err => {
                      console.log('Audio play after loading failed:', err)
                    })
                  }
                }, 200)
              }
            }, 300)
            return 100
          }
          // Slow down as it approaches 100
          // from 0-100 but slow. i wonder how many hours i spent on this loading screen
          const increment = prev < 50 ? 2 : prev < 80 ? 1.5 : 0.5
          return Math.min(prev + increment, 100)
        })
      }, 50)
      
      return () => clearInterval(interval)
    } else {
      setIsLoading(false)
      // If already visited and Fantasy theme is active, try to play audio
      // make sure to play Phantasy Star IV its my favorite game of all time
      if (currentTheme === 'fantasy' && audioRef.current) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(err => {
              console.log('Audio play on refresh failed:', err)
            })
          }
        }, 300)
      }
    }
  }, [])

  // Start audio on first user interaction (for autoplay restrictions) 
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (currentTheme === 'fantasy' && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.log('Audio play on interaction failed:', err)
        })
      }
      // Remove listeners after first interaction
      // extremely important code dont touch it
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    if (currentTheme === 'fantasy' && !isLoading) {
      document.addEventListener('click', handleFirstInteraction, { once: true })
      document.addEventListener('keydown', handleFirstInteraction, { once: true })
      document.addEventListener('touchstart', handleFirstInteraction, { once: true })
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [currentTheme, isLoading])

  // Audio control effects
  // EL MUSICO DE MI VIDA
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  // Play music when Fantasy theme is active its a banger not gonna lie
  useEffect(() => {
    if (currentTheme === 'fantasy' && audioRef.current && !isLoading) {
      // Try to play audio after loading screen finishes
      const tryPlayAudio = () => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.log('Audio play failed:', err)
              // Retry audio play if autoplay fails
              setTimeout(() => {
                if (audioRef.current && currentTheme === 'fantasy') {
                  audioRef.current.play().catch(() => {
                    console.log('Audio autoplay blocked - user interaction required')
                  })
                }
              }, 500)
            })
          }
        }
      }
      
      // Small delay to ensure audio element is ready or ill get a bad grade
      setTimeout(tryPlayAudio, 100)
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
    
    // Cleanup: pause audio when component unmounts or theme changes
    return () => {
      if (audioRef.current && currentTheme !== 'fantasy') {
        audioRef.current.pause()
      }
    }
  }, [currentTheme, isLoading])

  // Update body and html background based on theme its a bit of a pain in the ass but its worth it i think. who am i even talking to?
  useEffect(() => {
    const body = document.body
    const html = document.documentElement
    
    // Remove all theme classes first. kunwaere walang pasok 
    const themeClasses = ['matrix-theme-active', 'kind-panther-theme-active', 'fantasy-theme-active']
    body.classList.remove(...themeClasses)
    html.classList.remove(...themeClasses)
    
    // Apply theme-specific styles
    // i like fantasy theme just letting youknow hehe
    const themeConfig = {
      matrix: { bgColor: '#05050a', class: 'matrix-theme-active' },
      'kind-panther': { bgColor: '#f8b195', class: 'kind-panther-theme-active' },
      fantasy: { bgColor: '#000000', class: 'fantasy-theme-active' },
      default: { bgColor: '#ffffff', class: '' }
    }
    
    const config = themeConfig[currentTheme] || themeConfig.default
    
    body.style.backgroundColor = config.bgColor
    html.style.backgroundColor = config.bgColor
    
    if (config.class) {
      body.classList.add(config.class)
      html.classList.add(config.class)
    }
    
    // Cleanup: reset styles on unmount
    return () => {
      body.style.backgroundColor = ''
      html.style.backgroundColor = ''
      body.classList.remove(...themeClasses)
      html.classList.remove(...themeClasses)
    }
  }, [currentTheme])

  // Track scroll position for starship scrollbar
  useEffect(() => {
    let lastScrollTop = 0
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const maxScroll = documentHeight - windowHeight
      let percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      
      // Constrain percentage to keep ship within bounds (accounting for ship height)
      // Track height is calc(100vh - 100px), ship is 60px tall
      // We need to ensure the ship doesn't go beyond the track
      //MR PRESIDENT THE SHIP MUST NOT PASS THROUGH THE BORDER
      const trackHeight = windowHeight - 100 // Account for padding
      const shipHeight = 60
      const maxPercentage = ((trackHeight - shipHeight) / trackHeight) * 100
      percentage = Math.min(Math.max(percentage, 0), maxPercentage)
      
      // Determine scroll direction
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down')
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up')
      }
      
      lastScrollTop = scrollTop
      setScrollPosition(scrollTop)
      setScrollPercentage(percentage)
    }

    if (currentTheme === 'fantasy') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial call
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentTheme])
// this is some long ahh code, the indian youtube tutorials are sure making me a better programmer. or is it?
  return (
    <>
      {isLoading && (
        <div className="loading-screen loading-screen-fantasy">
          <div className="loading-container loading-container-fantasy">
            <div className="loading-profile-wrapper">
              <img 
                src="/images/ps4-profile-pic07.png" 
                alt="Profile" 
                className="loading-profile-image"
              />
            </div>
            <div className="loading-bar-wrapper">
              <div className="loading-bar loading-bar-fantasy">
                <div 
                  className="loading-bar-fill loading-bar-fill-fantasy" 
                  style={{ width: `${loadingProgress}%` }}
                >
                  <span className="loading-text loading-text-fantasy">Welcome to the new project</span>
                </div>
              </div>
              <div className="loading-percentage loading-percentage-fantasy">{Math.round(loadingProgress)}%</div>
            </div>
          </div>
        </div>
      )}
      <div className={
        currentTheme === 'matrix' ? 'matrix-wrapper' : 
        currentTheme === 'kind-panther' ? 'kind-panther-wrapper' : 
        currentTheme === 'fantasy' ? 'fantasy-wrapper' : 
        ''
      }>
      {currentTheme === 'matrix' && (
        <div className="jp-matrix">
          {matrixChars.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      )}
      {currentTheme === 'kind-panther' && (
        <div className="kind-panther-bg"></div>
      )}
      {currentTheme === 'fantasy' && (
        <>
          <div className="fantasy-bg"></div>
          <div className="fantasy-header-image">
            <img src="/images/ps4home.png" alt="Phantasy Star IV" className="ps4-home-img" />
          </div>
          <div className="fantasy-animation-overlay">
            <img src="/images/ps4about-ani.gif" alt="Animated Monster" className="ps4-animation-img" />
          </div>
          <div className="fantasy-scrollbar">
            <div className="scrollbar-track">
              <div 
                className="scrollbar-thumb"
                style={{ 
                  top: `clamp(0px, ${scrollPercentage}%, calc(100% - 60px))`
                }}
              >
                <div 
                  className={`starship-trail ${scrollDirection === 'up' ? 'trail-up' : 'trail-down'}`}
                ></div>
                <img 
                  src="/images/ps4-starship.png" 
                  alt="Starship" 
                  className="starship-image"
                />
              </div>
            </div>
          </div>
          <audio 
            ref={audioRef}
            src="/images/Machine Center.mp3" 
            loop 
            preload="auto"
            autoPlay
          />
        </>
      )}
      <nav className="site-nav">
        <div className="nav-inner">
          <div className="brand">KM</div>
          <div className="nav-links">
            {[
              { id: 'introduction', label: 'Home' },
              { id: 'about-me', label: 'About Me' },
              { id: 'projects', label: 'Projects' },
              { id: 'contacts', label: 'Contacts' }
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(id)
                }}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            {currentTheme === 'fantasy' && (
              <div className="audio-controls">
                <Button
                  variant="ghost"
                  size="icon"
                  className="audio-button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <div className="volume-control-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label="Volume control"
                  />
                </div>
              </div>
            )}
            <div className="theme-switcher">
              <Button
                variant="ghost"
                size="icon"
                className="theme-button"
                onClick={handleThemeMenuToggle}
                aria-label="Theme switcher"
              >
                <Palette size={20} />
              </Button>
              {isThemeMenuOpen && (
                <>
                  <div 
                    className="theme-menu-overlay" 
                    onClick={() => {
                      setIsThemeMenuOpen(false)
                    }}
                  />
                  <div 
                    className="theme-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { id: 'kind-panther', label: 'Kind Panther', preview: 'theme-gradient-preview', icon: null },
                      { id: 'fantasy', label: 'Fantasy', preview: 'theme-fantasy-preview', icon: null },
                      { id: 'matrix', label: 'Matrix', preview: 'theme-matrix-preview', icon: 'ア' }
                    ].map((theme) => (
                      <Button
                        key={theme.id}
                        variant="ghost"
                        className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleThemeChange(theme.id)
                        }}
                      >
                        <span className={theme.preview}>
                          {theme.icon}
                        </span>
                        <span>{theme.label}</span>
                        {currentTheme === theme.id && <span className="theme-check">✓</span>}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      // dont ask me how many divs i put in this code, i am just trying to make it look good and i am not sure if it is working. well it is working right?
      <main className={
        currentTheme === 'matrix' ? 'matrix-theme-content' : 
        currentTheme === 'kind-panther' ? 'kind-panther-theme-content' : 
        currentTheme === 'fantasy' ? 'fantasy-theme-content' : 
        ''
      }>
        <section id="introduction" className="intro">
          <div className="section-container">
            <header className="intro-header">
              <h1 className="intro-title">Welcome</h1>
            </header>

            <div className="intro-content">
              <div className="intro-text">
                <p>
                  Greetings, I'm Kurt and welcome to my project
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about-me" className="about-me">
          <div className="section-container">
            <h2 className="about-me-title">About Me</h2>
            <div className="about-me-content">
              <div className="about-me-image-wrapper">
                <div className="circular-frame">
                  <img src="/images/dabid.jpg" alt="Kurt David Martinez" className="about-me-image" />
                </div>
              </div>
              <div className="about-me-info">
                <div className="about-section">
                  <h3 className="about-section-title">About Me</h3>
                  <p className="about-section-text">
                    Hello, I'm Kurt David Martinez, a 20-year-old computer programmer from Cavite State University (CvSU).
                    I'm passionate about developing video games, designing websites and continuously expanding my knowledge in
                    computer programming. I'm also a Yugioh player and won many tournaments.
                  </p>
                </div>
                <div className="about-section">
                  <h3 className="about-section-title">Technical Skills</h3>
                  <p className="about-section-text">
                    Great with web designing and efficient on multiple computer languages like Java, Python and C++
                  </p>
                </div>
                <div className="about-section">
                  <h3 className="about-section-title">Education</h3>
                  <div className="education-content">
                    <p className="about-section-text">
                      <strong>High School:</strong> Eastern High School and Camella Bacoor National Highschool (Grade 7-10)
                    </p>
                    <p className="about-section-text">
                      <strong>SHS:</strong> San Nicholas III, Bacoor City (Grade 11-12)
                    </p>
                    <p className="about-section-text">
                      <strong>College:</strong> Cavite State University (2023-Present)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <div className="section-container">
            <h2 className="projects-title">Projects</h2>
            <div className="projects-grid">
              {[
                {
                  id: 'limbo-master',
                  name: 'Limbo Master',
                  description: 'A Game of Memory, Choose the correct key to WIN!. F O C U S',
                  onClick: () => setIsLimboMasterOpen(true),
                  type: 'modal'
                },
                {
                  id: 'live-twins',
                  name: 'Live Twins',
                  description: 'A simple web design log in page',
                  onClick: () => setIsLiveTwinsOpen(true),
                  type: 'modal'
                },
                {
                  id: 'enrollment',
                  name: 'Enrollment',
                  description: 'Enrollment system.',
                  onClick: () => window.open('https://github.com/SirKnight342/Enrollment', '_blank', 'noopener,noreferrer'),
                  type: 'link'
                },
                {
                  id: 'student-portal',
                  name: 'Student Portal',
                  description: 'Grading system.',
                  onClick: () => window.open('https://github.com/SirKnight342/student-portal', '_blank', 'noopener,noreferrer'),
                  type: 'link'
                },
                {
                  id: 'ygo-pro-guides',
                  name: 'YGO Pro Guides',
                  description: 'Yu-Gi-Oh! Pro Guides website.',
                  onClick: () => window.open('https://github.com/SirKnight342/ygoproguides-website', '_blank', 'noopener,noreferrer'),
                  type: 'link'
                }
              ].map((project) => (
                <Card
                  key={project.id}
                  className="project-card project-card-clickable"
                  onClick={project.onClick}
                >
                  <CardHeader>
                    <CardTitle className="project-name">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="project-desc">{project.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="contacts">
          <div className="section-container">
            <h2 className="contacts-title">Contacts</h2>
            <p className="contacts-description">Want to know more about me? Hit me up!</p>
            <div className="contacts-content">
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span className="contact-label">Email:</span>
              <a href="mailto:kaitokuruba342@gmail.com" className="contact-link">kaitokuruba342@gmail.com</a>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span className="contact-label">Phone:</span>
              <span className="contact-value">09268736489</span>
            </div>
            <div className="contact-item">
              <Facebook className="contact-icon" />
              <span className="contact-label">Facebook:</span>
              <a 
                href="https://www.facebook.com/Sirknight.342" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                Kurt David Martinez
              </a>
            </div>
            <div className="contact-item">
              <Youtube className="contact-icon" />
              <span className="contact-label">Youtube:</span>
              <a 
                href="https://www.youtube.com/@sirknight1743" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                SirKnight
              </a>
            </div>
          </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="footer-text">
          © 2025 Kurt David Martinez | Built with React, TailwindCSS, and Uiverse.io with shadcn/UI.
        </p>
      </footer>
      {isLimboMasterOpen && (
        <div className="modal-overlay" onClick={() => setIsLimboMasterOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost"
              size="icon"
              className="modal-close"
              onClick={() => setIsLimboMasterOpen(false)}
              aria-label="Close modal"
            >
              ×
            </Button>
            <h2 className="modal-title">Limbo Master</h2>
            <div className="video-container">
              <video 
                src="/images/limbothing.mp4" 
                controls 
                className="modal-video"
                preload="metadata"
              >
                Your browser does not support the video tag.
                // LMAO SKILL ISSUE BUDDY
              </video>
            </div>
            <div className="modal-footer">
              <Button 
                asChild
                variant="outline"
                className="github-button"
              >
                <a 
                  href="https://github.com/SirKnight342/Limbo-Master" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="github-icon" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
      {isLiveTwinsOpen && (
        <div className="modal-overlay" onClick={handleCloseModal(setIsLiveTwinsOpen)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost"
              size="icon"
              className="modal-close"
              onClick={handleCloseModal(setIsLiveTwinsOpen)}
              aria-label="Close modal"
            >
              ×
            </Button>
            <h2 className="modal-title">Live Twins</h2>
            <div className="video-container">
              <video 
                src="/images/live.mp4" 
                controls 
                className="modal-video"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="modal-footer">
              <Button 
                asChild
                variant="outline"
                className="github-button"
              >
                <a 
                  href="https://github.com/SirKnight342/Live-twins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="github-icon" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  )
}

export default App
// FINISHED ON LINE 7 6 9  FUNNI NUMBER AND SI MOLDER? T1 FIGHTING PLESSSSSSSSSSSSSSSS