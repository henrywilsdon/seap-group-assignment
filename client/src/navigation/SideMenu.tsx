import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

type Props = {};

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
];

export default function SideMenu({}: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const createClickHandler = (path: string) => () => {
        // Navigate to new path if not already there
        if (matchPath(path, location.pathname) === null) {
            navigate(path);
        }
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
                    <ListItemText>{item.label}</ListItemText>
                </ListItemButton>
            </ListItem>
        ));
    };
    return (
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
        </List>
    );
}
