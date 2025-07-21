import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import {
  FavoriteOutlined,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Home,
  Assignment,
  MenuBook,
  Login,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  ChevronRight,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        py: 6,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha('#fff', 0.1)} 0%, transparent 50%), 
                      radial-gradient(circle at 80% 20%, ${alpha('#fff', 0.1)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <FavoriteOutlined fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    FPT Junior High School
                  </Typography>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 3, 
                    opacity: 0.9, 
                    lineHeight: 1.6,
                    maxWidth: 300 
                  }}
                >
                  Providing comprehensive health management solutions for schools and educational institutions.
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  {[
                    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
                    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
                    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
                    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
                  ].map((social, index) => (
                    <motion.div
                      key={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        sx={{
                          color: 'white',
                          bgcolor: alpha('#fff', 0.1),
                          '&:hover': {
                            bgcolor: alpha('#fff', 0.2),
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Quick Links
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    { icon: <Home fontSize="small" />, label: 'Home', to: '/' },
                    { icon: <Login fontSize="small" />, label: 'Login', to: '/login' },
                  ].map((link) => (
                    <Box
                      key={link.label}
                      component={Link}
                      to={link.to}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        opacity: 0.9,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          opacity: 1,
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      <ChevronRight fontSize="small" sx={{ mr: 1, fontSize: '0.875rem' }} />
                      {link.icon}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {link.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Contact Us
                </Typography>
                <Stack spacing={2}>
                  {[
                    { icon: <LocationOn />, text: '123 Education St, School City' },
                    { icon: <Phone />, text: '(123) 456-7890' },
                    { icon: <Email />, text: 'health@school.edu' },
                    { icon: <AccessTime />, text: 'Mon-Fri: 8:00 AM - 5:00 PM' },
                  ].map((contact, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: alpha('#fff', 0.1),
                          color: 'white',
                          width: 32,
                          height: 32,
                          mr: 2,
                        }}
                      >
                        {React.cloneElement(contact.icon, { fontSize: 'small' })}
                      </Avatar>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {contact.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
          </Grid>

          {/* Copyright */}
          <motion.div variants={itemVariants}>
            <Divider 
              sx={{ 
                my: 4, 
                borderColor: alpha('#fff', 0.2),
                opacity: 0.6 
              }} 
            />
            <Box textAlign="center">
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} FPT Junior High School Health Management System. All rights reserved.
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;