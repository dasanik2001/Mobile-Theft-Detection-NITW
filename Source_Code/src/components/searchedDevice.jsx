import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';


const SearchedDevice = ({deviceSearch}) => {
    return (
       
        <Card sx={{ maxWidth: 345,backgroundColor: "#161D2F" }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={deviceSearch.link}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.54)',
              color: 'white',
              padding: '10px',
            }}
          >
            <Typography variant="h5" >{deviceSearch.name}</Typography>
            <Typography variant="body2">{deviceSearch.vendor}</Typography>
          </Box>
        </Box>
        <CardContent>
          <Typography variant="body2"  sx={{color:"white"}}>
          {`${deviceSearch.id} is ${deviceSearch.active?"active" : "not active"}`}
          </Typography>
        </CardContent>
       
      </Card>
    );
};

export default SearchedDevice;