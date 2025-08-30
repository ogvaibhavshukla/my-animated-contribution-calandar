"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Square } from "@/components/square"

const YOUR_GITHUB_USERNAME = "ogvaibhavshukla" // Replace with actual username

interface ContributionCalendarProps {
  data?: number[][]
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ data }) => {
  const ROWS = 7
  const COLS = 52

  // Pattern types
  const PATTERNS = {
    GAME_OF_LIFE: "gameOfLife",
    RIPPLE: "ripple",
    WAVE: "wave",
    RAIN: "rain",
    SPIRAL: "spiral",
    NOISE: "noise",
    RULE30: "rule30",
    IMAGE: "image", // Add this new pattern
  }

  // Initialize empty grid
  const createEmptyGrid = () => {
    return new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0))
  }

  // Create random initial state
  const createRandomGrid = () => {
    return new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0).map(() => (Math.random() > 0.7 ? 1 : 0)))
  }

  const [grid, setGrid] = useState(createEmptyGrid)
  const [isRunning, setIsRunning] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [currentPattern, setCurrentPattern] = useState(PATTERNS.GAME_OF_LIFE)
  const [patternState, setPatternState] = useState({}) // For pattern-specific state
  const [animationSpeed, setAnimationSpeed] = useState(150) // Milliseconds per frame
  const [maxGenerations, setMaxGenerations] = useState(500) // Max generations before auto-stopping
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const [isActivated, setIsActivated] = useState(true) // Controls removed; keep true for internal toggles if needed
  const [baselineGrid, setBaselineGrid] = useState<number[][] | null>(null) // Restored when pausing
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [githubData, setGithubData] = useState<number[][] | null>(null)
  const [isLoadingGithub, setIsLoadingGithub] = useState(false)
  const [showRealData, setShowRealData] = useState(true)
  const [dynamicMonthLabels, setDynamicMonthLabels] = useState<string[]>([])
  const [githubDateRange, setGithubDateRange] = useState<{startDate: string, endDate: string} | null>(null)

  // Avoid hydration mismatch by randomizing only on the client after mount
  useEffect(() => {
    setGrid(createRandomGrid())
  }, [])

  // Fetch GitHub data on component load
  useEffect(() => {
    fetchGithubContributions()
  }, [])

  // Conway's Game of Life
  const countNeighbors = useCallback((grid: number[][], row: number, col: number) => {
    let count = 0
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
        count += grid[newRow][newCol]
      }
    }
    return count
  }, [])

  const gameOfLifeStep = useCallback(
    (currentGrid: number[][]) => {
      const newGrid = createEmptyGrid()
      let hasChanged = false
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const neighbors = countNeighbors(currentGrid, row, col)
          const currentCell = currentGrid[row][col]

          if (currentCell === 1) {
            newGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0
          } else {
            newGrid[row][col] = neighbors === 3 ? 1 : 0
          }
          if (newGrid[row][col] !== currentCell) {
            hasChanged = true
          }
        }
      }
      return { newGrid, hasChanged }
    },
    [countNeighbors],
  )

  // Circular Ripple Effect
  const rippleStep = useCallback((currentGrid: number[][], state: any) => {
    const newGrid = createEmptyGrid()
    const { ripples = [] } = state

    // Add new ripple occasionally
    const newRipples = [...ripples]
    if (Math.random() < 0.05) {
      newRipples.push({
        centerRow: Math.floor(Math.random() * ROWS),
        centerCol: Math.floor(Math.random() * COLS),
        radius: 0,
        maxRadius: Math.random() * 15 + 5,
      })
    }

    // Update existing ripples
    for (let i = newRipples.length - 1; i >= 0; i--) {
      const ripple = newRipples[i]
      ripple.radius += 0.5

      if (ripple.radius > ripple.maxRadius) {
        newRipples.splice(i, 1)
        continue
      }

      // Draw ripple
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const distance = Math.sqrt(Math.pow(row - ripple.centerRow, 2) + Math.pow(col - ripple.centerCol, 2))

          if (Math.abs(distance - ripple.radius) < 1) {
            newGrid[row][col] = 1
          }
        }
      }
    }

    setPatternState({ ripples: newRipples })
    return { newGrid, hasChanged: true } // Ripples always change
  }, [])

  // Wave Pattern
  const waveStep = useCallback((currentGrid: number[][], state: any) => {
    const newGrid = createEmptyGrid()
    const time = state.time || 0

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const wave1 = Math.sin(col * 0.2 + time * 0.1)
        const wave2 = Math.sin(row * 0.3 + time * 0.15)
        const combined = (wave1 + wave2) / 2

        newGrid[row][col] = combined > 0.3 ? 1 : 0
      }
    }

    setPatternState({ time: time + 1 })
    return { newGrid, hasChanged: true }
  }, [])

  // Rain Effect
  const rainStep = useCallback((currentGrid: number[][], state: any) => {
    const newGrid = [...currentGrid.map((row) => [...row])]

    // Add new raindrops at top
    for (let col = 0; col < COLS; col++) {
      if (Math.random() < 0.05) {
        newGrid[0][col] = 1
      }
    }

    // Move existing drops down
    for (let row = ROWS - 1; row > 0; row--) {
      for (let col = 0; col < COLS; col++) {
        if (currentGrid[row - 1][col] === 1) {
          newGrid[row][col] = 1
          newGrid[row - 1][col] = 0
        }
      }
    }

    // Clear bottom row
    for (let col = 0; col < COLS; col++) {
      if (Math.random() < 0.3) {
        newGrid[ROWS - 1][col] = 0
      }
    }

    return { newGrid, hasChanged: true }
  }, [])

  // Spiral Pattern
  const spiralStep = useCallback((currentGrid: number[][], state: any) => {
    const newGrid = createEmptyGrid()
    const time = state.time || 0
    const centerRow = ROWS / 2
    const centerCol = COLS / 2

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const dx = col - centerCol
        const dy = row - centerRow
        const angle = Math.atan2(dy, dx)
        const distance = Math.sqrt(dx * dx + dy * dy)

        const spiralValue = Math.sin(angle * 3 + distance * 0.5 - time * 0.2)
        newGrid[row][col] = spiralValue > 0.5 ? 1 : 0
      }
    }

    setPatternState({ time: time + 1 })
    return { newGrid, hasChanged: true }
  }, [])

  // Random Noise
  const noiseStep = useCallback((currentGrid: number[][]) => {
    const newGrid = createEmptyGrid()

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        newGrid[row][col] = Math.random() > 0.8 ? 1 : 0
      }
    }

    return { newGrid, hasChanged: true }
  }, [])

  // Rule 30 Cellular Automaton
  const rule30Step = useCallback((currentGrid: number[][]) => {
    const newGrid = [...currentGrid.map((row) => [...row])]

    // Apply Rule 30 to middle row
    const middleRow = Math.floor(ROWS / 2)
    const currentRow = currentGrid[middleRow]

    for (let col = 1; col < COLS - 1; col++) {
      const left = currentRow[col - 1]
      const center = currentRow[col]
      const right = currentRow[col + 1]

      // Rule 30: 111->0, 110->0, 101->0, 100->1, 011->1, 010->1, 001->1, 000->0
      const pattern = (left << 2) | (center << 1) | right
      newGrid[middleRow][col] = [0, 1, 1, 1, 1, 0, 0, 0][pattern]
    }

    // Shift other rows
    for (let row = 0; row < ROWS; row++) {
      if (row !== middleRow) {
        for (let col = COLS - 1; col > 0; col--) {
          newGrid[row][col] = currentGrid[row][col - 1]
        }
        newGrid[row][0] = 0
      }
    }

    return { newGrid, hasChanged: true }
  }, [])

  // Image/GIF Pattern
  const imageStep = useCallback(
    (currentGrid: number[][]) => {
      const newGrid = createEmptyGrid()

      if (!imageElement || !canvasRef.current) {
        return { newGrid, hasChanged: false }
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        return { newGrid, hasChanged: false }
      }

      // Set canvas size to match grid
      canvas.width = COLS
      canvas.height = ROWS

      // Draw image frame to canvas
      ctx.drawImage(imageElement, 0, 0, COLS, ROWS)

      // Get image data
      const imageData = ctx.getImageData(0, 0, COLS, ROWS)
      const data = imageData.data

      // Convert pixels to grid cells based on brightness
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const pixelIndex = (row * COLS + col) * 4
          const r = data[pixelIndex]
          const g = data[pixelIndex + 1]
          const b = data[pixelIndex + 2]

          // Calculate brightness (0-255)
          const brightness = (r + g + b) / 3

          // Convert to binary based on threshold
          newGrid[row][col] = brightness > 128 ? 1 : 0
        }
      }

      return { newGrid, hasChanged: true }
    },
    [imageElement, ROWS, COLS],
  )

  // Pattern execution
  const executePattern = useCallback(
    (currentGrid: number[][], pattern: string, state: any) => {
      switch (pattern) {
        case PATTERNS.GAME_OF_LIFE:
          return gameOfLifeStep(currentGrid)
        case PATTERNS.RIPPLE:
          return rippleStep(currentGrid, state)
        case PATTERNS.WAVE:
          return waveStep(currentGrid, state)
        case PATTERNS.RAIN:
          return rainStep(currentGrid, state)
        case PATTERNS.SPIRAL:
          return spiralStep(currentGrid, state)
        case PATTERNS.NOISE:
          return noiseStep(currentGrid)
        case PATTERNS.RULE30:
          return rule30Step(currentGrid)
        case PATTERNS.IMAGE:
          return imageStep(currentGrid)
        default:
          return { newGrid: currentGrid, hasChanged: false }
      }
    },
    [gameOfLifeStep, rippleStep, waveStep, rainStep, spiralStep, noiseStep, rule30Step, imageStep],
  )

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    const now = performance.now()
    const elapsed = now - lastUpdateTimeRef.current

    if (elapsed > animationSpeed) {
      lastUpdateTimeRef.current = now - (elapsed % animationSpeed)

      setGrid((currentGrid) => {
        const { newGrid, hasChanged } = executePattern(currentGrid, currentPattern, patternState)

        if (currentPattern === PATTERNS.GAME_OF_LIFE && !hasChanged) {
          setIsRunning(false) // Auto-pause if Game of Life becomes stable
          return currentGrid // No change, return old grid to prevent re-render
        }

        if (generation >= maxGenerations) {
          setIsRunning(false) // Auto-pause if max generations reached
          return currentGrid
        }

        setGeneration((gen) => gen + 1)
        return newGrid
      })
    }

    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [isRunning, animationSpeed, executePattern, currentPattern, patternState, generation, maxGenerations])

  useEffect(() => {
    // Only start the animation if the controls are activated and animation is set to run
    if (!isActivated) {
      // If controls are not activated, ensure animation is stopped
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    if (isRunning) {
      lastUpdateTimeRef.current = performance.now()
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRunning, animate, isActivated])

  // GitHub data fetching function
  const fetchGithubContributions = async () => {
    setIsLoadingGithub(true)
    try {
      const response = await fetch(`/api/contributions?login=${YOUR_GITHUB_USERNAME}`)
      const data = await response.json()
      
      if (data.grid) {
        setGithubData(data.grid)
        setGrid(data.grid) // Replace animated grid with real data
        
        // Set dynamic month labels and date range
        if (data.monthLabels) {
          setDynamicMonthLabels(data.monthLabels)
        }
        if (data.startDate && data.endDate) {
          setGithubDateRange({ startDate: data.startDate, endDate: data.endDate })
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
    } finally {
      setIsLoadingGithub(false)
    }
  }

  // Active letter index from the word "Animated" or null when paused
  const [activeLetterIndex, setActiveLetterIndex] = useState<number | null>(null)

  const resetGrid = () => {
    setIsRunning(false)
    setGrid(createEmptyGrid())
    setGeneration(0)
    setPatternState({})
  }

  const randomizeGrid = () => {
    setIsRunning(false)
    setGrid(createRandomGrid())
    setGeneration(0)
    setPatternState({})
  }

  const changePattern = (newPattern: string) => {
    setCurrentPattern(newPattern)
    setGeneration(0)
    setPatternState({})

    // Set appropriate initial state for each pattern
    if (newPattern === PATTERNS.GAME_OF_LIFE || newPattern === PATTERNS.NOISE) {
      setGrid(createRandomGrid())
    } else if (newPattern === PATTERNS.RULE30) {
      const newGrid = createEmptyGrid()
      newGrid[Math.floor(ROWS / 2)][Math.floor(COLS / 2)] = 1 // Single cell in middle for Rule 30
      setGrid(newGrid)
    } else if (newPattern === PATTERNS.IMAGE) {
      const newGrid = createEmptyGrid()
      setGrid(newGrid)

      // Initialize image if not already done
      if (!imageElement) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = "/elm.gif" // Updated to use your GIF
        img.onload = () => {
          setImageElement(img)
        }
      }
    } else {
      setGrid(createEmptyGrid())
    }

  }

  // Letter click handler for the word "Animated"
  const animateLetterPatterns = [
    PATTERNS.GAME_OF_LIFE, // A (first)
    PATTERNS.NOISE,        // N
    PATTERNS.WAVE,         // I (interference)
    PATTERNS.SPIRAL,       // M
    PATTERNS.RULE30,       // A (second)
    PATTERNS.RAIN,         // T
    PATTERNS.RIPPLE,       // E
  ]

  const handleAnimatedLetterClick = (letterIndex: number) => {
    setShowRealData(false) // Switch to animation mode when clicking letters
    const newPattern = animateLetterPatterns[letterIndex]

    if (!isRunning) {
      // Start: save baseline and run
      setBaselineGrid(grid.map((row) => [...row]))
      changePattern(newPattern)
      setIsRunning(true)
      setActiveLetterIndex(letterIndex)
      return
    }

    if (activeLetterIndex === letterIndex) {
      // Pause: restore baseline grid
      setIsRunning(false)
      if (baselineGrid) {
        setGrid(baselineGrid.map((row) => [...row]))
      }
      setActiveLetterIndex(null)
      return
    }

    // Switch pattern while running
    changePattern(newPattern)
    setActiveLetterIndex(letterIndex)
  }



  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const staticMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  // Always use standard Jan-Dec for 2025 calendar year
  const monthLabels = staticMonthLabels

  // Pixel dimensions for optimized squares (15px squares, 3px gaps)
  const SQUARE_PX = 12
  const GAP_PX = 3
  const GRID_PIXEL_WIDTH = COLS * SQUARE_PX + (COLS - 1) * GAP_PX
  const LEFT_GUTTER_PX = 32
  const MIN_CARD_PIXEL_WIDTH = 1015
  const CARD_PIXEL_WIDTH = Math.max(LEFT_GUTTER_PX + GRID_PIXEL_WIDTH, MIN_CARD_PIXEL_WIDTH)

  const patternNames = {
    [PATTERNS.GAME_OF_LIFE]: "Conway's Game of Life",
    [PATTERNS.RIPPLE]: "Circular Ripples",
    [PATTERNS.WAVE]: "Wave Pattern",
    [PATTERNS.RAIN]: "Rain Effect",
    [PATTERNS.SPIRAL]: "Spiral Pattern",
    [PATTERNS.NOISE]: "Random Noise",
    [PATTERNS.RULE30]: "Rule 30 Automaton",
    [PATTERNS.IMAGE]: "GIF Pattern",
  }

  const statusText = isRunning
    ? "Running"
    : currentPattern === PATTERNS.GAME_OF_LIFE && !grid.flat().some((cell) => cell === 1)
      ? "Empty Grid"
      : currentPattern === PATTERNS.GAME_OF_LIFE && generation > 0 && !grid.flat().some((cell) => cell === 1)
        ? "Stable (All Dead)"
        : currentPattern === PATTERNS.GAME_OF_LIFE &&
            generation > 0 &&
            !executePattern(grid, currentPattern, patternState).hasChanged
          ? "Stable"
          : generation >= maxGenerations
            ? "Max Generations Reached"
            : "Paused"

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 select-none">
            {Array.from("Activity").map((ch, idx) => (
              <span
                key={`activity-${idx}`}
                onClick={() => handleAnimatedLetterClick(idx)}
                className={`cursor-pointer transition-colors ${
                  activeLetterIndex === idx ? "text-blue-600" : "hover:text-blue-500"
                }`}
                title={`Click to ${activeLetterIndex === idx ? "pause & restore" : "start"} ${patternNames[animateLetterPatterns[idx]]}`}
              >
                {ch}
              </span>
            ))}
          </h1>

        </div>

        {/* Controls removed: grid acts as interactive canvas with simple keyboard/mouse interactions */}

        {/* The main grid remains visible */}
        <div
          className="bg-white dark:bg-gray-800 rounded-lg mt-3"
          style={{ width: "fit-content", maxWidth: "100%", overflowX: "auto" }}
        >
          {/* Month labels aligned to grid width like GitHub
         <div className="flex mb-1 items-start">
            Left gutter same as GitHub: 32px
            <div style={{ width: LEFT_GUTTER_PX }} />
            <div
              className="font-normal text-gray-600 dark:text-gray-400"
              style={{ 
                fontSize: "15px",
                display: "flex", 
                gap: "3.45em",
                paddingLeft: "13px"
              }}
            >
              {monthLabels.map((month) => (
                <span key={month} className="text-center font-normal" style={{ letterSpacing: "0.025em" }}>
                  {month}
                </span>
              ))}
            </div>
          </div> */}

          {/* <div className="flex"> */}
            {/* Day labels */}
            {/* <div
              className="mr-3 font-normal text-gray-600 dark:text-gray-400"
              style={{ 
                display: "grid", 
                gridTemplateRows: `repeat(7, ${SQUARE_PX}px)`, 
                gap: `${GAP_PX}px`,
                alignItems: "center"
              }}
            >
              {dayLabels.map((day) => (
                <span 
                  key={day} 
                  className={`${day === "Mon" || day === "Wed" || day === "Fri" ? "" : "opacity-0"}`}
                  style={{ 
                    lineHeight: "1",
                    fontSize: "15px",
                    letterSpacing: "0.025em"
                  }}
                >
                  {day}
                </span>
              ))}
            </div> */}
          {/* </div> */}

          {/* Pattern Grid with border */}
          <div className="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2" style={{ gap: `${GAP_PX}px` }}>
            {Array.from({ length: COLS }, (_, colIndex) => (
              <div key={colIndex} className="flex flex-col" style={{ gap: `${GAP_PX}px` }}>
                {Array.from({ length: ROWS }, (_, rowIndex) => (
                  <Square
                    key={`${rowIndex}-${colIndex}`}
                    alive={grid[rowIndex][colIndex] > 0}
                    contributionCount={grid[rowIndex][colIndex]}
                    onClick={() => {}}
                    title={`Cell (${rowIndex}, ${colIndex}): ${grid[rowIndex][colIndex] > 0 ? `${grid[rowIndex][colIndex]} contribution${grid[rowIndex][colIndex] > 1 ? 's' : ''}` : "No contributions"}`}
                  />
                ))}
              </div>
            ))}
          </div>


        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  )
}

export default ContributionCalendar
