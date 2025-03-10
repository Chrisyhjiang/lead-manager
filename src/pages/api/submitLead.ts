import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import type { Fields, Files } from "formidable";
import { Lead } from "../../types/index";

// Disable bodyParser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const formidable = await import("formidable");

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    const { fields, files }: { fields: Fields; files: Files } =
      await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

    const resumeFile = files.resume?.[0];

    if (!resumeFile) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Read the file as a buffer (if you want to process it manually)
    const fileData = await fs.readFile(resumeFile.filepath);

    // Clean up the uploaded file if necessary
    await fs.unlink(resumeFile.filepath);

    const newLead: Lead = {
      id: crypto.randomUUID(),
      firstName: fields.firstName?.toString() || "",
      lastName: fields.lastName?.toString() || "",
      country: fields.country?.toString() || "",
      email: fields.email?.toString() || "",
      linkedin: fields.linkedin?.toString() || undefined,
      status: "Pending",
      submitted: new Date(),
      message: fields.message?.toString() || "",
    };

    console.log("New lead submitted:", newLead);

    // Return lead so frontend can store it in sessionStorage
    return res.status(200).json({
      message: "Form submitted successfully!",
      lead: newLead,
      resume: fileData.toString("base64"), // Optional: Send file data
    });
  } catch (error) {
    console.error("Error handling form submission:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
