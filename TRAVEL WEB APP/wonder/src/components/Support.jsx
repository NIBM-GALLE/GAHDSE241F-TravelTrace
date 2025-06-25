import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Link,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Navbar from './Navbar';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const translations = {
  en: {
    support: 'Support',
    contact: 'If you need help, we’re here! Contact us or use the chat below.',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    faqTitle: 'Frequently Asked Questions',
    FAQs: [
      { q: 'How do I create a trail?', a: 'Use the "Create" button and complete the form.' },
      { q: 'Can I make my trail private?', a: 'Yes, set privacy when creating or editing.' },
      { q: 'How to upload photos/videos?', a: 'Use the upload section during trail creation or edit.' },
      { q: 'Forgot password?', a: 'Click "Forgot Password" on the login page.' },
      { q: 'Find trails near me?', a: 'Use the "Nearby Trails" filter on home page.' },
    ],
    liveChat: 'Live Chat Support',
    placeholder: 'Type your message...',
  },
  si: {
    support: 'සහාය',
    contact: 'ඔබට උදව් අවශ්‍ය නම්, අපි සූදානම්! පහත චැට් හෝ අමතන්න.',
    email: 'ඊ‑මේල්',
    phone: 'දුරකථන',
    address: 'ලිපිනය',
    faqTitle: 'නිති අසන ප්‍රශ්න',
    FAQs: [
      { q: 'මාර්ගයක් නිර්මාණය කරන්නේ කෙසේද?', a: '"Create" බොත්තම ඔබා පෝරමය පුරවන්න.' },
      { q: 'මගේ මාර්ගය පුද්ගලික කළ හැකිද?', a: 'ඔව්, නිර්මාණය හෝ සංස්කරණයේදී පුද්ගලිකත්වය සකසන්න.' },
      { q: 'ඡායාරූප/වීඩියෝ උඩුගත කරන්නේ කෙසේද?', a: 'නිර්මාණය හෝ සංස්කරණයේදී උඩුගත කිරීම භාවිතා කරන්න.' },
      { q: 'මුරපදය අමතක වූයේද?', a: '"Forgot Password" බොත්තම ඔබන්න.' },
      { q: 'ආසන්න මාර්ගයන් සොයන්නෙ කෙසේද?', a: '"Nearby Trails" පෙරහන භාවිතා කරන්න.' },
    ],
    liveChat: 'සජීවී කතාබස් සහාය',
    placeholder: 'ඔබගේ පණිවිඩය මෙතැන ටයිප් කරන්න...',
  },
  ta: {
    support: 'ஆதரவு',
    contact: 'உங்களுக்கு உதவி தேவைப்படுகிறதா? கீழே உள்ள உரையாடலை பயன்படுத்தவும்.',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    address: 'முகவரி',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    FAQs: [
      { q: 'நான் பாதையை எப்படிச் உருவாக்குவது?', a: '"Create" பொத்தானை அழுத்தி படிவத்தை நிரப்பவும்.' },
      { q: 'நான் என் பாதையை தனிப்பட்டதாக வைத்திருக்க முடியுமா?', a: 'ஆம், உருவாக்கும்போது அல்லது திருத்தும்போது அமைக்கலாம்.' },
      { q: 'புகைப்படங்கள்/வீடியோக்களை எப்படி பதிவேற்றுவது?', a: 'உருவாக்கத்தில் அல்லது திருத்தத்தில் பதிவேற்ற விருப்பத்தை பயன்படுத்தவும்.' },
      { q: 'கடவுச்சொல்லை மறந்துவிட்டேன்?', a: '"Forgot Password" என்பதை கிளிக் செய்யவும்.' },
      { q: 'எனக்கு அருகிலுள்ள பாதைகளை எவ்வாறு கண்டறிவது?', a: '"Nearby Trails" தேர்வை பயன்படுத்தவும்.' },
    ],
    liveChat: 'நேரடி உரையாடல் ஆதரவு',
    placeholder: 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...',
  },
};

const Support = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const [messages, setMessages] = useState([{ sender: 'support', text: t.contact }]);
  const [input, setInput] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLangChange = (_, value) => {
    const newLang = value || 'en';
    setLang(newLang);
    setMessages([{ sender: 'support', text: translations[newLang].contact }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { sender: 'user', text: input },
      { sender: 'support', text: t.contact },
    ]);
    setInput('');
  };

  return (
    <>
      <Navbar title={t.support} backButton showBottomNav={false} />

      {/* Push toggle below navbar */}
      <Box sx={{ pt: { xs: 9, sm: 15 }, backgroundColor: '#fff', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ToggleButtonGroup
            value={lang}
            exclusive
            onChange={handleLangChange}
            aria-label="language"
            size="small"
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="si">SI</ToggleButton>
            <ToggleButton value="ta">TA</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 2, pb: 5, backgroundColor: '#F9F9FB' }}>
        <Container maxWidth="md">
          {/* Contact Details */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
              {t.support}
            </Typography>
            <Typography align="center" paragraph color="text.secondary">
              {t.contact}
            </Typography>
            <Typography sx={{ mt: 2 }}>📧 <Link href="mailto:support@traveltrace.com">{t.email}</Link></Typography>
            <Typography>📞 <Link href="tel:+94123456789">{t.phone}</Link></Typography>
            <Typography>📍 {t.address}: 123 Trail Street, Colombo</Typography>
          </Paper>

          {/* FAQs Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t.faqTitle}
            </Typography>
            {t.FAQs.map((faq, i) => (
              <Box key={i} sx={{ mt: 2 }}>
                <Typography fontWeight="medium">❓ {faq.q}</Typography>
                <Typography color="text.secondary">{faq.a}</Typography>
              </Box>
            ))}
          </Paper>

          {/* Live Chat */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ChatIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">{t.liveChat}</Typography>
            </Box>

            <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {messages.map((msg, i) => (
                <ListItem
                  key={i}
                  sx={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {msg.sender === 'user' ? <PersonIcon /> : <SupportAgentIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      bgcolor: msg.sender === 'user' ? '#DCF8C6' : '#e0e0e0',
                      borderRadius: 2,
                      p: 1,
                      maxWidth: '80%',
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleSend}>
                Send
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Support;
