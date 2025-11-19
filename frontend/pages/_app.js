import "../styles/globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { UnitProvider } from "../contexts/UnitContext";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <UnitProvider>
        <Component {...pageProps} />
      </UnitProvider>
    </ThemeProvider>
  );
}
