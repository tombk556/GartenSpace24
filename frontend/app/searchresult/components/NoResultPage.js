import React from 'react'
import { useRouter } from 'next/navigation'

const NoResultPage = () => {
  const router = useRouter()

  const handleCreateAlert = () => {
    router.push('/publishadvert')
  }

  return (
    <div className="max-w-xl mx-auto text-center px-4 py-16">
      <h2 className="text-2xl font-semibold mb-4">Leider kein Treffer</h2>
      <p className="mb-6 text-lg">
        Tut uns leid, wir haben aktuell keinen Kleingarten in deiner Region gefunden 😞
      </p>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
        <h3 className="text-xl font-bold mb-2">Lass dich benachrichtigen!</h3>
        <p className="text-lg mb-4">
          Erstelle einen kostenlosen Suchauftrag und wir informieren dich, sobald ein passender Garten verfügbar ist.
        </p>
        <button
          onClick={handleCreateAlert}
          className="bg-[#009243] hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-2xl"
        >
          Suchauftrag erstellen
        </button>
      </div>
    </div>
  )
}

export default NoResultPage
