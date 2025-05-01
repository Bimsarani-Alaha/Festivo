import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Birthday from '../../assets/birthday.jpg';
import Proposal from '../../assets/proposal 1.jpg';
import GenderReveal from '../../assets/gender 2.jpg';

const staticThemes = [
  {
    name: 'Birthday',
    image: Birthday,
    description: 'Celebrate birthdays in style with vibrant decorations, cakes, and fun themes.'
  },
  {
    name: 'Proposal',
    image: Proposal,
    description: 'Make your proposal unforgettable with a romantic and intimate setting.'
  },
  {
    name: 'Gender Reveal',
    image: GenderReveal,
    description: 'Reveal the big surprise with a magical and creative gender reveal event.'
  }
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: '#FAF8F1', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box
        sx={{
          bgcolor: '#FFF5D6',
          py: { xs: 6, md: 10 },
          px: 2,
          textAlign: 'center',
          borderRadius: { xs: 0, md: '0 0 30px 30px' },
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
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
              mb: 3
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
              fontWeight: 400
            }}
          >
            From dreamy proposals to joyful birthdays, Festivo brings your celebrations to life.
          </Typography>
          <Link to="/EventBooking">
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
                fontWeight: 500
              }}
            >
              Start Planning
            </Button>
          </Link>
        </Container>
      </Box>

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

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {staticThemes.map((theme, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: { xs: '100%', md: '30%' },
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 16px 40px rgba(229, 186, 115, 0.2)'
                },
                bgcolor: '#FFFFFF'
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={theme.image}
                alt={theme.name}
                sx={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
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
                    {theme.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#866A40' }}>
                    {theme.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 4, pb: 4 }}>
                  <Link
                    to={`/DisplayEventTheme/${encodeURIComponent(theme.name)}`}
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
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
                        fontWeight: 500
                      }}
                    >
                      Explore More
                    </Button>
                  </Link>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
};

export default Home;
