import Client from "./client";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "สร้างโปรไฟล์",
  description: "สร้างโปรไฟล์",
};

function page() {
  return (
    <div id="createProfile" className="bg-gradient-to-b from-blue-100/50 to-white">
      <Client />
    </div>
  );
}

export default page;
