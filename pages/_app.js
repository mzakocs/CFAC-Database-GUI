import { ThemeProvider } from "@material-ui/core";
import "../styles/globals.css";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
