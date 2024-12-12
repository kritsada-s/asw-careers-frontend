import Client from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "สร้างโปรไฟล์",
  description: "สร้างโปรไฟล์",
};

function page() {
  return (
    <div>
      <Client />
    </div>
  );
}

export default page;