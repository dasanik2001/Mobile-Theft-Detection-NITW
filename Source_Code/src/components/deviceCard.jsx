import React, { useContext } from 'react';

import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';

const DeviceCard = ({imei, state, lat, long}) => {
    
    return (

        <Card sx={{ width: 250,backgroundColor: "#161D2F" }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="350"
            image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrEDii0UolHNw1xhnkKFCvs3lU6e6tP8Cip6Ccmpu5ow&s'
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
            <Typography variant="h5" >{imei}</Typography>
            {/* <Typography variant="body2">{device.vendor}</Typography> */}
          </Box>
        </Box>
        <CardContent>
          <Typography variant="body2"  sx={{color:"white"}}>
          {`${imei} is ${state?"LOST": "ACTIVE"}`}
          </Typography>

          <Typography variant="body2"  sx={{color:"white"}}>
          {(lat ==='' && long==='')? "Device Not Found": `Last Seen at ${lat} ${long}`}
          </Typography>
        </CardContent>
       
      </Card>


    );
};

export default DeviceCard;