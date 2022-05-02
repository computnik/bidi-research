import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'

import MenuItem from '@mui/material/MenuItem'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

import routes from '../client-routes'

const APP_NAME = 'MY APP 🧪'

const pages = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'Blog', to: '/blog' },
]

const AppName = () => (
  <>
    <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
      {APP_NAME}
    </Typography>
    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      {APP_NAME}
    </Typography>
  </>
)

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: inherit;
  }
`

const ResponsiveAppBar = () => {
  const [menuOpen, setMenuOpen] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setMenuOpen(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuOpen}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(menuOpen)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {routes.map(
                (route) =>
                  route.name && (
                    <StyledNavLink
                      to={route.path}
                      key={'navbar-menu-item-' + route.name}
                      children={({ isActive }) => {
                        return (
                          <MenuItem onClick={handleCloseNavMenu} selected={isActive}>
                            {route.name}
                          </MenuItem>
                        )
                      }}
                    />
                  ),
              )}
            </Menu>
          </Box>
          <AppName />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {routes.map(
              (route) =>
                // <Button key={'navbar-mobile-menu-item-' + page.name} component={StyledNavLink} to={page.to} variant="text">{page.name}</Button>
                route.name && (
                  <StyledNavLink
                    to={route.path}
                    key={'navbar-mobile-menu-item-' + route.name}
                    children={({ isActive }) => {
                      return (
                        <Button
                          key={route.name}
                          onClick={handleCloseNavMenu}
                          color="inherit"
                          variant={isActive ? 'outlined' : 'text'}
                        >
                          {route.name}
                        </Button>
                      )
                    }}
                  />
                ),
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
