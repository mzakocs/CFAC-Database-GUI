import { createMuiTheme, colors } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#478fcc"
    },
    secondary: {
      main: "#478fcc"
    },
    text: {
      primary: colors.grey[100],
      secondary: colors.grey[300]
    }
  },
});

export default theme;
