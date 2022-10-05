import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import CalculateIcon from '@mui/icons-material/Calculate';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import UserContext from '../user/UserContext';
import ConfirmLogoutDialog from '../user/ConfirmLogoutDialog';

const items = [
    {
        label: 'Athletes',
        Icon: DirectionsBikeIcon,
        path: '/athletes',
    },
    {
        label: 'Courses',
        Icon: RouteIcon,
        path: '/courses',
    },
    {
        label: 'Profile',
        Icon: PersonIcon,
        path: '/profile',
    },
    {
        label: 'Predictions',
        Icon: CalculateIcon,
        path: '/predictions',
    },
];

export default function SideMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(UserContext);
    const [openConfirmLogout, setOpenConfirmLogout] = useState(false);

    const createClickHandler = (path: string) => () => {
        // Navigate to new path if not already there
        if (matchPath(path, location.pathname) === null) {
            navigate(path);
        }
    };

    const handleConfirmLogoutClose = () => {
        setOpenConfirmLogout(false);
    };

    const handleConfirmLogoutConfirm = () => {
        logout();
        setOpenConfirmLogout(false);
    };

    const handleConfirmLogoutOpen = () => {
        setOpenConfirmLogout(true);
    };

    const renderItems = () => {
        return items.map((item) => (
            <ListItem disablePadding>
                <ListItemButton
                    onClick={createClickHandler(item.path)}
                    selected={matchPath(item.path, location.pathname) != null}
                >
                    <ListItemIcon>
                        <item.Icon />
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        secondary={item.label === 'Profile' && user?.username}
                    />
                </ListItemButton>
            </ListItem>
        ));
    };
    return (
        <>
            <ConfirmLogoutDialog
                open={openConfirmLogout}
                onClose={handleConfirmLogoutClose}
                onConfirm={handleConfirmLogoutConfirm}
            />
            <List
                sx={{
                    width: '200px',
                    borderRight: '1px solid',
                    borderRightColor: 'divider',
                }}
            >
                <ListItem
                    disablePadding
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 2,
                        paddingBottom: 1,
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                    }}
                >
                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            width: '36px',
                        }}
                    />
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>
                        TT Model
                    </Typography>
                </ListItem>
                {renderItems()}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleConfirmLogoutOpen}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );
}
