import { useQuery } from '@tanstack/react-query';
import { 
  Container, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Typography,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Chip
} from '@mui/material';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { fetchAllEventThemes } from '../../api/eventThemeApi';
import Logo from '../../assets/Logo.jpg'
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { data: eventThemeData, isFetching } = useQuery({
    queryKey: ['eventThemes'],
    queryFn: fetchAllEventThemes,
  });


  return (
    <Box sx={{ bgcolor: '#FAF8F1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: '#FFF5D6', 
          py: { xs: 6, md: 10 },
          px: 2,
          textAlign: 'center',
          borderRadius: { xs: 0, md: '0 0 30px 30px' },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '40%',
            background: 'linear-gradient(to top, rgba(250, 234, 177, 0.15), transparent)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#614A29',
              mb: 3,
              position: 'relative',
              zIndex: 2
            }}
          >
            Create Unforgettable Moments
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              color: '#866A40',
              mb: 5,
              mx: 'auto',
              maxWidth: '700px',
              position: 'relative',
              zIndex: 2,
              fontWeight: 400
            }}
          >
            From dreamy weddings to joyful birthdays, Festivo helps you plan and execute the perfect event. 
            Browse our curated themes and start creating memories that last a lifetime.
          </Typography>
          <Link to="/EventBooking"><Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#E5BA73', 
              color: '#FFF',
              '&:hover': { bgcolor: '#D4A85F' },
              borderRadius: 28,
              px: 5,
              py: 1.8,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: '0 6px 16px rgba(229, 186, 115, 0.4)',
              position: 'relative',
              zIndex: 2
            }}
          >
            Start Planning
          </Button></Link>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: 8, flex: 1 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          sx={{ 
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: '#614A29',
            mb: 2
          }}
        >
          Explore Our Themes
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center"
          sx={{ 
            color: '#866A40',
            mb: 6,
            maxWidth: '700px',
            mx: 'auto',
            fontSize: '1.1rem'
          }}
        >
          Find the perfect setting for your special occasion
        </Typography>
        
        {isFetching ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress sx={{ color: '#E5BA73' }} />
          </Box>
        ) : (
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4} 
            useFlexGap
            sx={{ mb: 8 }}
          >
            {eventThemeData?.map((event: any, index: any) => (
              <Card 
                key={index} 
                sx={{ 
                  flex: 1, 
                  minWidth: { xs: '100%', md: '30%' },
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 16px 40px rgba(229, 186, 115, 0.2)'
                  },
                  border: '1px solid rgba(229, 186, 115, 0.2)',
                  bgcolor: '#FFFFFF'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="320"
                    image={event.imageUrl || Logo}
                    alt={event.eventName}
                    sx={{ 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      filter: 'brightness(1.03)'
                    }}
                  />
                  <Chip 
                    label="Popular" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16, 
                      bgcolor: '#E5BA73',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      px: 1,
                      display: index === 1 ? 'flex' : 'none'
                    }} 
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      color: '#614A29',
                      mb: 1
                    }}
                  >
                    {event.eventName}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ color: '#866A40', mb: 2 }}
                  >
                    {event.description || "Create unforgettable memories with our beautifully designed themes and professional event planning services."}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 4, pb: 4 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      bgcolor: '#E5BA73', 
                      '&:hover': { bgcolor: '#D4A85F' },
                      borderRadius: 28,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      boxShadow: '0 4px 12px rgba(229, 186, 115, 0.2)'
                    }}
                  >
                    Explore More
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
        
        {/* Featured Services Section */}
        <Box 
          sx={{ 
            my: 10, 
            py: 6, 
            px: { xs: 2, md: 4 },
            borderRadius: 8,
            bgcolor: '#FFF5D6',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#614A29',
              mb: 2
            }}
          >
            Our Services
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center"
            sx={{ 
              color: '#866A40',
              mb: 6,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            End-to-end event solutions tailored to your needs
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            useFlexGap
          >
            {[
              { 
                title: "Event Design", 
                description: "Custom themes and décor for any occasion" 
              },
              { 
                title: "Venue Selection", 
                description: "Find the perfect location for your event" 
              },
              { 
                title: "Full Planning", 
                description: "End-to-end coordination and execution" 
              }
            ].map((service, index) => (
              <Paper 
                key={index}
                elevation={0}
                sx={{ 
                  p: 4, 
                  flex: 1,
                  borderRadius: 6,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(229, 186, 115, 0.3)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(229, 186, 115, 0.2)'
                  }
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#614A29',
                    mb: 2
                  }}
                >
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#866A40', fontSize: '1rem' }}>
                  {service.description}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
        
        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 10, 
            mb: 4,
            p: 6,
            borderRadius: 8,
            bgcolor: 'rgba(229, 186, 115, 0.15)',
            border: '1px solid rgba(229, 186, 115, 0.3)'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#614A29',
              mb: 2
            }}
          >
            Ready to Create Memories?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#866A40', 
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem'
            }}
          >
            Let our team of expert planners help you create the perfect event
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#E5BA73', 
              color: '#FFF',
              '&:hover': { bgcolor: '#D4A85F' },
              borderRadius: 28,
              px: 5,
              py: 1.8,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: '0 6px 16px rgba(229, 186, 115, 0.4)'
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Home;