"use client"

import type React from "react"

interface SquareProps {
  alive: boolean
  contributionCount?: number
  onClick: () => void
  title: string
}

const Square: React.FC<SquareProps> = ({ alive, contributionCount = 0, onClick, title }) => {
  // Determine the intensity class based on GitHub's contribution levels
  let intensityClass = "square"
  if (contributionCount > 0) {
    if (contributionCount === 1) intensityClass = "square alive-1"
    else if (contributionCount >= 2 && contributionCount <= 3) intensityClass = "square alive-2"
    else if (contributionCount >= 4 && contributionCount <= 6) intensityClass = "square alive-3"
    else intensityClass = "square alive-4" // 7+ contributions
  }

  return (
    <div
      className={intensityClass}
      title={title}
    />
  )
}

export { Square }
