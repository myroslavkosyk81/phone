"use client"
import CollectionForm from '@/components/collections/CollectionForm';
import Loader from '@/components/custom_ui/Loader';

import React, { useEffect, useState } from 'react'

const CollectionDetails = ({ params }: { params: { collectionId: string }}) => {
   const [loading, setLoading] = useState(true);
   const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);

   const getCollectionDetails = async () => {
      try {
         const res = await fetch(`/api/collections/${params.collectionId}`, {
            method: "GET",
         })
         const data = await res.json();
         setCollectionDetails(data);
         console.log(data)
         setLoading(false);
      } catch (error) {
         console.log("[collectionId_GET]", error)
      }
   }
   useEffect(() => {
      getCollectionDetails()
   }, [])
  return loading ? <Loader /> : (
    <CollectionForm initialData={collectionDetails} />
  )
}

export default CollectionDetails