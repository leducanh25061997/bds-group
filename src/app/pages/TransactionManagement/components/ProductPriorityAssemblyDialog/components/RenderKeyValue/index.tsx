import { Box, Typography } from "@mui/material";
import React from 'react'

interface KeyValueProtype {
  title: string, 
  value: React.ReactNode
}

export const RenderKeyValue = React.memo((props: KeyValueProtype) => {
  const { title, value } = props

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        mt: 2,
        alignItems: 'end',
      }}
    >
      <Typography sx={{ color: '#A8ADB4', mr: 1 }}>{`${title}: `}</Typography>
      {value}
    </Box>
  );
});