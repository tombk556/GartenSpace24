import "@styles/globals.css";
import Nav from "@components/Nav";
import { AuthProvider } from "@context/AuthContext";

export const metadata = {
  title: "ELTS",
  description: "Discover & Share Event Locations",
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
