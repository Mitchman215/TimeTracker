import { Box, Stack } from '@mui/material'
import { FC, useState } from 'react'

export interface BarsProps {
  size: number
}

const Bars: FC<BarsProps> = ({ size }) => {
  return (
    <Stack className="w-1/4" direction="column">
      <Box
        className="bg-white"
        sx={{
          height: 275 - size,
        }}
      />
      <Box
        className="bg-violet-900"
        sx={{
          height: size,
        }}
      />
      <div>HIIIII</div>
    </Stack>
  )
}

export default Bars
