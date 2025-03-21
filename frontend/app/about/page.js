import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Über Gartenspace24</h1>
      <p className="mb-4 text-lg leading-relaxed">
        Gartenspace24 ist die digitale Plattform zur Vermittlung von Kleingärten – ganz egal ob zum Kauf, zur Miete oder zur Pacht. Wir verbinden Gartenbesitzer, Suchende und Kleingartenvereine auf einfache, effiziente und transparente Weise.
        Unser Ziel ist es, den Zugang zu grünen Rückzugsorten für alle Menschen zu erleichtern. Dabei legen wir Wert auf Nachhaltigkeit, Gemeinschaft und digitale Innovation.
        Mit Gartenspace24 wird die Suche nach dem perfekten Kleingarten genauso unkompliziert wie das Inserieren – dank moderner Technologien, fairer Gebühren und automatisierter Prozesse.
        Ob du deinen Garten anbieten möchtest oder auf der Suche nach deinem eigenen Stück Natur bist – bei uns bist du richtig!
      </p>

      <h2 className="text-2xl font-bold mb-4">Über mich</h2>
      
      <Image
        src="/assets/images/profile.jpg"
        alt="Tom – Gründer von Gartenspace24"
        width={500}
        height={500}
        className=" mb-6"
      />

      <p className="mb-4 text-lg leading-relaxed">
        Hallo! Ich bin Tom, Gründer von Gartenspace24 und leidenschaftlicher Befürworter des naturnahen Lebens in der Stadt.
        Die Idee zu Gartenspace24 entstand aus einem persönlichen Bedürfnis: Ich wollte einen Ort zum Abschalten, Gärtnern und Durchatmen – aber der Zugang zu Kleingärten war kompliziert, intransparent und analog. Das wollte ich ändern.
        Mit meiner Erfahrung in der Software-Enwicklung und meiner Begeisterung für digitale Lösungen habe ich Gartenspace24 ins Leben gerufen – eine Plattform, die moderne Technologie mit dem Wunsch nach Natur und Gemeinschaft verbindet.
        Ich bin überzeugt: Jeder Mensch sollte die Möglichkeit haben, einen grünen Rückzugsort zu finden. Genau dafür bauen wir Gartenspace24 – Schritt für Schritt, mit Herz und Vision.
        Danke, dass du Teil dieser Reise bist!
      </p>
    </div>
  )
}

export default page
