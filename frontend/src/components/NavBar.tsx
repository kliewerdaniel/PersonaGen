import { AppBar, Toolbar, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation, LinkProps } from 'react-router-dom';
import { styled } from '@mui/system';
import { TabProps } from '@mui/material/Tab'; // Import TabProps


const NavBar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const StyledTab = styled(Tab)<TabProps & LinkProps>(({ theme }) => ({ // Extend with LinkProps
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'none',
    '&.Mui-selected': {
      color: '#ffffff',
      backgroundColor: '#333333',
      borderRadius: theme.spacing(0.5),
    },
    '&:hover': {
      color: '#aaaaaa',
    },
  }));

  const StyledAppBar = styled(AppBar)({
    backgroundColor: '#000000',
    boxShadow: 'none',
  });

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Tabs value={currentPath} TabIndicatorProps={{ style: { backgroundColor: '#ffffff' } }}>
            <StyledTab label="Upload Sample" value="/" component={Link} to="/" />
            <StyledTab label="Personas" value="/personas" component={Link} to="/personas" />
            <StyledTab label="Blog Posts" value="/blog-posts" component={Link} to="/blog-posts" />
          </Tabs>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
