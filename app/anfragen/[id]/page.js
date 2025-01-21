"use client";

import React, { useEffect, useState } from "react";

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
     <div>
       {property && (
         <div>
            <p>{property.id}</p>
           <p>{property.description}</p>
         </div>
       )}
     </div>
   )
}

export default Page;
