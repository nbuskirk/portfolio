import { useDeepMerge } from "./useDeepMerge";
import { themeProps } from "./useDeepMerge";

function App() {
  const defaultTheme = {
    palette: {
      main: "rgba(255,255,255,1)",
    },
  };

  const customTheme = {
    palette: {
      secondary: "rgba(255,200,200,1)",
    },
  };

  // const newTheme = {};
  // const arr = [];
  // for (const [key, value] of Object.entries(defaultTheme)) {
  //   arr.push({ [key]: value });
  // }
  // for (const [key, value] of Object.entries(customTheme)) {
  //   arr.push({ [key]: value });
  // }

  console.log(useDeepMerge(defaultTheme, customTheme, 1));
}

export default App;
