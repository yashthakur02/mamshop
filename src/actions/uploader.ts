"use server";
import fs from "node:fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadsDir = path.resolve("./public/uploads");

    // Create the directory if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });

    await fs.writeFile(path.join(uploadsDir, file.name), buffer);

    revalidatePath("/");
}