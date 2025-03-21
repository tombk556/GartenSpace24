import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Impressum</h1>

      <p className="mb-4 text-lg leading-relaxed">
        Tom Bischopink
        <br />
        Reichenbachstra&szlig;e 35
        <br />
        522
        <br />
        01069 Dresden
      </p>

      <h2 className="text-3xl font-bold mb-4">Kontakt</h2>
      <p>
        Telefon: +49015755026908
        <br />
        E-Mail: tombk@web.de
      </p>
      <p>
        Quelle: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a>
      </p>
    </div>
  );
};

export default page;
