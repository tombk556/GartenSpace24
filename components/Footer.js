const Footer = () => {
    return (
      <footer className="w-full text-black py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} ELTS. All rights reserved.</p>
          <p>
            Discover & Share Event Locations. Follow us on{" "}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Twitter
            </a>
            ,{" "}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:underline"
            >
              Instagram
            </a>
            , and{" "}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
            .
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  