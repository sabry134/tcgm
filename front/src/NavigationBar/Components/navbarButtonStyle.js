export const navbarButtonStyle = {
  navbarButton: (disabled) => ({
    backgroundColor: disabled ? '#c4c4c4' : '#5d3a00',
    padding: '10px 20px',
    flexGrow: 1,
    margin: '0 10px',
    '&:hover': {
      backgroundColor: '#7e4f00',
    }
  }),
  navbarSmallButton: {
    backgroundColor: '#5d3a00',
    '&:hover': {
      backgroundColor: '#7e4f00',
    }
  }
}