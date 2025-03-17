"use client";

import React, { useEffect, useState } from "react";
import PropertyHeader from "../components/PropertyHeader";
import PlacePriceCard from "../components/PlacePriceCard";

const Page = () => {
  const [id, setId] = useState("");
  const [property, setProperty] = useState(null);

   useEffect(() => {
     const id = window.location.pathname.split("/").pop();
     setId(id);
 
     const fetchProperty = async () => {
       try {
         const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/advert/get_advert/${id}`
         );
         const data = await response.json();
         setProperty(data);
 
       } catch (error) {
         console.error("Error fetching properties:", error);
       }
     };
 
     fetchProperty();
   }, []);


   return (
     <div className="container mx-auto p-4">
     <hr className="mt-2" />
     {property && <PropertyHeader property={property} />}
     <hr className="mt-2" />
     {property && <PlacePriceCard property={property} />}
     </div>
   )
}

export default Page;
