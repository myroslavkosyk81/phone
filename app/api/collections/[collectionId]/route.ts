import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectDb } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: { collectionId: string}}) => {
   try {
      await connectDb();
      const collection = await Collection.findById(params.collectionId);

      if(!collection) {
         return new NextResponse(JSON.stringify({ message: "Collection not found"}), {status: 404})
      }
      return NextResponse.json(collection, { status: 200})
   } catch (error) {
      console.log("[collectionId_GET]", error);
      return new NextResponse("Internal error", {status: 500})
   }
}

export const POST = async (req: NextRequest, {params}: {params: { collectionId: string}}) => {
   try {
      const { userId } = auth();
      if (!userId) {
         return new NextResponse("Unauthorized", {status: 401});
      };
      await connectDb();
      let collection = await Collection.findById(params.collectionId);
      if(!collection) {
         return new NextResponse("Collection not found", {status: 404})
      };
      const {title, description, image} = await req.json();

      if (!title || !image) {
         return new NextResponse("Title and image are required", { status: 400})
      };
      collection = await Collection.findByIdAndUpdate(params.collectionId, {title, description, image}, {new: true});
      await collection.save();
      return NextResponse.json(collection, { status: 200});
   } catch (error) {
      console.log("[collectionId_POST", error);
      return new NextResponse("Internal error", {status: 500})
   }
}

export const DELETE = async (req: NextRequest, { params }: {params: { collectionId: string}} ) => {
   try {
      const { userId } = auth()
      if (!userId) {
         return new NextResponse("Unathorized", {status: 401})
      }

      await connectDb();
      await Collection.findByIdAndDelete(params.collectionId);

      await Product.updateMany(
         {collections: params.collectionId},
         {$pull: {collections: params.collectionId}}
      );


      return new NextResponse("Collection is deleted", { status: 200});

   } catch (error) {
      console.log("[collectionId_DELETE]", error);
      return new NextResponse("Internal error", {status: 500})
   }
}