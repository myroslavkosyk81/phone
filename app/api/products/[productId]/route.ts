import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectDb } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: { productId: string}}) => {
   try {
      await connectDb();
      const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection});

      if(!product) {
         return new NextResponse(JSON.stringify({ message: "Product not found"}), {status: 404})
      }
      return NextResponse.json(product, { status: 200})
   } catch (error) {
      console.log("[productId_GET]", error);
      return new NextResponse("Internal error", {status: 500})
   }
};

export const POST = async (req: NextRequest, { params }: {params: {productId: string}}) => {
   try {
      const { userId } = auth()
      if (!userId) {
         return new NextResponse("Unathorized", {status: 401})
      }
      await connectDb()
      const product = await Product.findById(params.productId)
      if (!product) {
         return new NextResponse(JSON.stringify({ message: "Product not found"}), { status: 404})
      }
      const { title,
         description,
         media,
         category,
         collections,
         tags,
         sizes,
         colors,
         price,
         expense,} = await req.json()

      if(!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("Not enough data to create a product", { status: 400 });
         };
      //included in new data but not in previous data
      const addedCollection = collections.filter((collectionId: string) => !product.collections.includes(collectionId));

      //included in previous data but not iincluded in the new data
      const removedCollections = product.collections.filter((collectionId: string) => !collections.includes(collectionId));

         //update collections
      await Promise.all([
         //update added collection with this product
         ...addedCollection.map((collectionId: string) =>
         Collection.findByIdAndUpdate(collectionId, {
            $push: {products: product._id},
         })
         ),
         //update removed collection without!!!! this product
         ...removedCollections.map((collectionId: string) =>
         Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id},
         }))
      ]);

      //update product
      const updateProduct = await Product.findByIdAndUpdate(product._id, {
         title,
         description,
         media,
         category,
         collections,
         tags,
         sizes,
         colors,
         price,
         expense,
      }, {new: true}).populate({ path: "collections", model: Collection});

      await updateProduct.save();
      return NextResponse.json(updateProduct, { status: 200})

   } catch (error) {
      console.log("[productId_POST]", error)
      return new NextResponse("Internal error", {status: 500})
   }
}


export const DELETE = async (req: NextRequest, { params }: {params: { productId: string}} ) => {
   try {
      const { userId } = auth()
      if (!userId) {
         return new NextResponse("Unathorized", {status: 401})
      }

      await connectDb();
      const product = await Product.findById(params.productId);
      if (!product) {
         return new NextResponse(JSON.stringify({message: "Product not found"}), {status: 404})
      }
      await Product.findByIdAndDelete(product._id);
      
      // update collection
      await Promise.all(
         product.collections.map((collectionId: string) =>
            Collection.findByIdAndUpdate(collectionId, {
               $pull: { products: product._id},
            })
         )
      )



      
      return new NextResponse(JSON.stringify({ message: "Product is deleted"}), { status: 200});

   } catch (error) {
      console.log("[productId_DELETE]", error);
      return new NextResponse("Internal error", {status: 500})
   }
};