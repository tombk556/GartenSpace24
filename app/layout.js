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
        <body className="flex flex-col min-h-screen custom-gradient">
          <div className="flex-grow">
            <Nav />
            <main className="w-full flex-center flex-col p-16 pt-28"> {/* Adjusted padding-top to pt-28 */}
              {children}
            </main>
          </div>
          <hr className="border-gray-300"/>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
};


export default rootlayout;
