import "@/styles/globals.css";
import store from "@/store/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Toaster position="bottom-right" />
      <Component {...pageProps} />;
    </Provider>
  );
}
