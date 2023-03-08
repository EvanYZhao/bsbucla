import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from "react-router";

const logos = [
    'https://i.ibb.co/4WSNT82/logo.png',
    'https://i.ibb.co/p2WNYs3/stache.png'
]

export default function Navbar() {
    const { user, googleSignOut } = UserAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

    const handleSignOut = async () => {
        try {
            await googleSignOut();
        } catch (error) {
            console.log(error);
        }
    };
    
    const [showSearch, setShowSearch] = useState(false);
    
    return (user ? 
    <header>
        <nav
            className="grid
                   grid-cols-3
                   w-full
                   py-4
                   md:py-0
                   px-6
                   text-lg text-gray-700
                   bg-neutral-800
                   h-16
                   "
        >
            <div className="flex justify-start items-center">
                <IconButton
                    onClick={(e) => { navigate('/home') }}
                >
                    <img referrerPolicy="no-referrer" 
                        className="object-scale-down 
                            h-10
                            " 
                        src={logos[0]}
                        alt="pfp"/>
                </IconButton>
            </div>
            <div className={"flex justify-center items-center " + (showSearch ? "invisible" : "invisible md:visible")}>
            <SearchBar width={500}/>
            </div>
            <div className="hidden w-full md:flex md:items-center md:w-auto flex justify-end h-100" id="menu">
                <ul
                    className="
                    pt-4
                    text-base text-gray-700
                    md:flex
                    md:justify-between 
                    md:pt-0"
                >
                    <li>
                    <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <img referrerPolicy="no-referrer" 
                         className="object-scale-down 
                                border-2
                                border-white
                                rounded-full 
                                h-10
                                " 
                         src={user?.photoURL} 
                         alt="pfp"/>
                    </IconButton>
                    </Tooltip>
                    
                        <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                            },
                            '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                    
                        <MenuItem onClick={handleClose} style={{ justifyContent: 'center'}}>
                        <img referrerpolicy="no-referrer" 
                         className="object-scale-down 
                                rounded-full 
                                h-8
                                mr-3
                                " 
                         src={user?.photoURL} 
                         alt="pfp"/>
                        <Typography>{user?.displayName}</Typography>
                        </MenuItem>
                        <Divider />
                        {/* <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                        </MenuItem> */}
                        <MenuItem onClick={handleSignOut}  style={{ justifyContent: 'center'}}>
                        Sign Out
                        </MenuItem>
                        </Menu>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    :
    <>
    </>
    )
}