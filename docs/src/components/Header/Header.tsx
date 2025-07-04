import './Header.scss';
import React from 'react';
import logo from './ExoGuitar.svg';
import { alpha, AppBar, Button, styled, Toolbar } from '@mui/material';
import { NavLink } from 'react-router';

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}))

const HeaderButton = ({title, href}:{title: string, href: string}) => (
    <NavLink to={href}>
        {({isActive})=> (
            <Button color={isActive ? "primary" : "info"} variant='text' size='small'>
                {title}
            </Button>
        )}
    </NavLink>
)

const Header = () => {

    return (
        <AppBar 
            className="header" 
            position="fixed" 
            enableColorOnDark 
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}>
            <StyledToolbar>
                <NavLink to="/">
                    <img 
                        src={logo} 
                        className="logo" 
                        alt="logo" />
                </NavLink>
                
                <nav>
                    <HeaderButton title="Generator" href="/generator" />
                    <HeaderButton title="Gallery" href="/gallery" />
                    <HeaderButton title="Unified BOM" href="/bom" />
                </nav>

            </StyledToolbar>
        </AppBar>
    );
}

export default Header;