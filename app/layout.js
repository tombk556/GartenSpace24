import "@styles/globals.css";
import Nav from "@components/Nav";
import { AuthProvider } from "@context/AuthContext";

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

const rootlayout = ({ children }) => {
  return (
    <AuthProvider>
      <html>
        <body>
            <div className="main">
              <div className="gradient" />
            </div>
            <main className="app">
              <Nav />
              {children}
            </main>
        </body>
      </html>
    </AuthProvider>
  );
};

export default rootlayout;
