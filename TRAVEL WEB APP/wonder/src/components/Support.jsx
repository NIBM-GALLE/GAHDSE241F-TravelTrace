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
  Stack,
  IconButton,
} from '@mui/material';
import Navbar from './Navbar';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';

const translations = {
  en: {
    support: 'Support',
    contact: 'If you need help, we’re here! Contact us or use the chat below.',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    faqTitle: 'Frequently Asked Questions',
    liveChat: 'Live Chat Support',
    placeholder: 'Type your message...',
    feedbackQuestion: 'How would you rate your website experience?',
    feedbackDetails: 'Please share in detail what we can improve your website experience..',
    feedbackPlaceholder: 'Write your feedback here',
    submit: 'Submit',
    FAQs: [
      { q: 'How do I create a trail?', a: 'Use the "Create" button and complete the form.' },
      { q: 'Can I make my trail private?', a: 'Yes, set privacy when creating or editing.' },
      { q: 'How to upload photos/videos?', a: 'Use the upload section during trail creation or edit.' },
      { q: 'Forgot password?', a: 'Click "Forgot Password" on the login page.' },
      { q: 'Find trails near me?', a: 'Use the "Nearby Trails" filter on home page.' },
    ],
  },
  si: {
    support: 'සහාය',
    contact: 'ඔබට උදව් අවශ්‍ය නම්, අපි සූදානම්! පහත චැට් හෝ අමතන්න.',
    email: 'ඊ‑මේල්',
    phone: 'දුරකථන',
    address: 'ලිපිනය',
    faqTitle: 'නිති අසන ප්‍රශ්න',
    liveChat: 'සජීවී කතාබස් සහාය',
    placeholder: 'ඔබගේ පණිවිඩය මෙතැන ටයිප් කරන්න...',
    feedbackQuestion: 'ඔබේ වෙබ් අත්දැකීම ගැන ඔබේ ඇගයීම කුමක්ද?',
    feedbackDetails: 'අපගේ වෙබ් අත්දැකීම වඩාත් යාකෘතිමත් කර ගැනීමට ඔබේ අදහස බෙදා ගන්න.',
    feedbackPlaceholder: 'ඔබේ අදහස මෙතැන ලියන්න',
    submit: 'යොමු කරන්න',
    FAQs: [
      { q: 'මාර්ගයක් නිර්මාණය කරන්නේ කෙසේද?', a: '"Create" බොත්තම ඔබා පෝරමය පුරවන්න.' },
      { q: 'මගේ මාර්ගය පුද්ගලික කළ හැකිද?', a: 'ඔව්, නිර්මාණය හෝ සංස්කරණයේදී පුද්ගලිකත්වය සකසන්න.' },
      { q: 'ඡායාරූප/වීඩියෝ උඩුගත කරන්නේ කෙසේද?', a: 'නිර්මාණය හෝ සංස්කරණයේදී උඩුගත කිරීම භාවිතා කරන්න.' },
      { q: 'මුරපදය අමතක වූයේද?', a: '"Forgot Password" බොත්තම ඔබන්න.' },
      { q: 'ආසන්න මාර්ගයන් සොයන්නෙ කෙසේද?', a: '"Nearby Trails" පෙරහන භාවිතා කරන්න.' },
    ],
  },
  ta: {
    support: 'ஆதரவு',
    contact: 'உங்களுக்கு உதவி தேவைப்படுகிறதா? கீழே உள்ள உரையாடலை பயன்படுத்தவும்.',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    address: 'முகவரி',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    liveChat: 'நேரடி உரையாடல் ஆதரவு',
    placeholder: 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...',
    feedbackQuestion: 'உங்கள் இணைய அனுபவத்தை மதிப்பீடு செய்யவும்:',
    feedbackDetails: 'எங்களை மேம்படுத்த என்ன செய்ய வேண்டும் என்பதைக் கூறவும்.',
    feedbackPlaceholder: 'உங்கள் கருத்தை இங்கே எழுதுங்கள்',
    submit: 'சமர்ப்பிக்கவும்',
    FAQs: [
      { q: 'நான் பாதையை எப்படிச் உருவாக்குவது?', a: '"Create" பொத்தானை அழுத்தி படிவத்தை நிரப்பவும்.' },
      { q: 'நான் என் பாதையை தனிப்பட்டதாக வைத்திருக்க முடியுமா?', a: 'ஆம், உருவாக்கும்போது அல்லது திருத்தும்போது அமைக்கலாம்.' },
      { q: 'புகைப்படங்கள்/வீடியோக்களை எப்படி பதிவேற்றுவது?', a: 'உருவாக்கத்தில் அல்லது திருத்தத்தில் பதிவேற்ற விருப்பத்தை பயன்படுத்தவும்.' },
      { q: 'கடவுச்சொல்லை மறந்துவிட்டேன்?', a: '"Forgot Password" என்பதை கிளிக் செய்யவும்.' },
      { q: 'எனக்கு அருகிலுள்ள பாதைகளை எவ்வாறு கண்டறிவது?', a: '"Nearby Trails" தேர்வை பயன்படுத்தவும்.' },
    ],
  },
};

const emojiOptions = [
  { icon: <SentimentVeryDissatisfied color="error" />, label: 'Very Bad' },
  { icon: <SentimentDissatisfied color="error" />, label: 'Bad' },
  { icon: <SentimentNeutral color="warning" />, label: 'Neutral' },
  { icon: <SentimentSatisfied color="success" />, label: 'Good' },
  { icon: <SentimentVerySatisfied color="primary" />, label: 'Excellent' },
];

const Support = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const [messages, setMessages] = useState([{ sender: 'support', text: t.contact }]);
  const [input, setInput] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

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

  const handleFeedbackSubmit = () => {
    if (!selectedEmoji && !feedbackText) return;

    const feedbackEntry = {
      emoji: selectedEmoji?.label,
      text: feedbackText,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    existing.push(feedbackEntry);
    localStorage.setItem('feedbacks', JSON.stringify(existing));

    setSelectedEmoji(null);
    setFeedbackText('');
    alert('Thanks for your feedback!');
  };

  return (
    <>
      <Navbar title={t.support} backButton showBottomNav={false} />

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

      <Box sx={{ px: 2, pb: 5, backgroundColor: '#F9F9FB' }}>
        <Container maxWidth="md">
          {/* Contact Info */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t.support}
            </Typography>
            <Typography align="center" paragraph>{t.contact}</Typography>
            <Typography>📧 <Link href="mailto:support@traveltrace.coms">{t.email}</Link></Typography>
            <Typography>📞 <Link href="tel:+94123456789">{t.phone}</Link></Typography>
            <Typography>📍 {t.address}: 123 Trail Street, Colombo</Typography>
          </Paper>

          {/* FAQs */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{t.faqTitle}</Typography>
            {t.FAQs.map((faq, i) => (
              <Box key={i} sx={{ mt: 2 }}>
                <Typography fontWeight="medium">❓ {faq.q}</Typography>
                <Typography color="text.secondary">{faq.a}</Typography>
              </Box>
            ))}
          </Paper>

          {/* Live Chat */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
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
                    <Avatar>{msg.sender === 'user' ? <PersonIcon /> : <SupportAgentIcon />}</Avatar>
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
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleSend}>Send</Button>
            </Box>
          </Paper>

          {/* Feedback Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>{t.feedbackQuestion}</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {emojiOptions.map((emoji, idx) => (
                <IconButton
                  key={idx}
                  onClick={() => setSelectedEmoji(emoji)}
                  sx={{
                    bgcolor: selectedEmoji?.label === emoji.label ? '#e0e0e0' : 'transparent',
                  }}
                >
                  {emoji.icon}
                </IconButton>
              ))}
            </Stack>

            <Typography gutterBottom>{t.feedbackDetails}</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t.feedbackPlaceholder}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleFeedbackSubmit}>
              {t.submit}
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Support;
