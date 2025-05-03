import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Link,
  Divider,
  IconButton
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        bgcolor: '#FAF3E0', 
        py: 6,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 4, md: 2 }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Box sx={{ flex: 1.5 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#7D5A50',
                mb: 2,
                fontWeight: 600
              }}
            >
              About Us
            </Typography>
            <Typography 
              variant="body2" 
              paragraph
              sx={{ 
                color: '#B4846C',
                lineHeight: 1.7
              }}
            >
              Festivo is a smart event planning system designed to simplify bookings and scheduling. 
              We help you create seamless, stress-free events with ease, ensuring a smooth experience 
              from start to finish.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" sx={{ color: '#B4846C' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#B4846C' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#B4846C' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#B4846C' }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#7D5A50',
                mb: 2,
                fontWeight: 600
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" sx={{ color: '#B4846C' }}>
                Event Themes
              </Link>
              <Link href="#" underline="hover" sx={{ color: '#B4846C' }}>
                Event Planning
              </Link>
              <Link href="#" underline="hover" sx={{ color: '#B4846C' }}>
                Decorations
              </Link>
              <Link href="/FeedbackPage" underline="hover" sx={{ color: '#B4846C' }}>
                Customer Feedback
              </Link>
            </Stack>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#7D5A50',
                mb: 2,
                fontWeight: 600
              }}
            >
              Contact Info
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WhatsAppIcon sx={{ color: '#B4846C', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#B4846C' }}>
                  0707230078
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ color: '#B4846C', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#B4846C' }}>
                  festivo@gmail.com
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography 
          variant="caption" 
          align="center" 
          display="block"
          sx={{ color: '#B4846C' }}
        >
          © {new Date().getFullYear()} Festivo Event Planner. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;