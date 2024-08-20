import "@styles/globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";  // Import Footer
import { AuthProvider } from "@context/AuthContext";

export const metadata = {
  title: "ELTS",
  description: "Discover & Share Event Locations",
};

const rootlayout = ({ children }) => {
  return (
    <AuthProvider>
      <html>
      <body className="flex flex-col min-h-screen custom-gradient"> {/* Set gradient background here */}
      <div className="flex-grow">
            <Nav />
            <hr/>
            <main className="w-full flex-center flex-col p-16">
              {children}
            </main>
          </div>
          <hr/>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
};

export default rootlayout;
