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
}
export const DELETE = async (req: NextRequest, { params }: {params: { productId: string}} ) => {
   try {
      const { userId } = auth()
      if (!userId) {
         return new NextResponse("Unathorized", {status: 401})
      }

      await connectDb();
      await Product.findByIdAndDelete(params.productId);
      return new NextResponse("Product is deleted", { status: 200});

   } catch (error) {
      console.log("[productId_DELETE]", error);
      return new NextResponse("Internal error", {status: 500})
   }
}