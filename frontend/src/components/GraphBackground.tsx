import { FC, useState } from 'react'
import { Box } from '@mui/material'

export interface GraphBackgroundProps {
  children: number[]
  width: number
  timestamps: string[]
}

const GraphBackground: FC<GraphBackgroundProps> = ({
  children,
  width,
  timestamps,
}) => {
  const axisPoints: number[] = []

  for (let i = 0; i < children.length; i++) {
    axisPoints.push(((i + 1) * width) / children.length)
  }
  return (
    <Box>
        
    </Box>
  )
}

export default GraphBackground
