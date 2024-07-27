import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { styled } from '@mui/material/styles';

const CustomAppBar = styled(AppBar)({
    background: 'linear-gradient(45deg, #800080 30%, #00008B 90%)', // Purple to dark blue gradient
});

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export default function Welcome_Banner(props) {
    return (
        <React.Fragment>
            <CssBaseline />
            <HideOnScroll {...props}>
                <CustomAppBar>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{
                            flexGrow: 1,
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 700 // Apply bold font weight
                        }}>
                            ArtisticAlly
                        </Typography>
                        <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontStyle: 'italic' }}>
                            Connect, Collaborate, Create!
                        </Typography>
                    </Toolbar>
                </CustomAppBar>
            </HideOnScroll>
            <Toolbar />
            <Container>
                <Box sx={{ my: 2 }}>
                    {/* Additional content can go here */}
                </Box>
            </Container>
        </React.Fragment>
    );
}
