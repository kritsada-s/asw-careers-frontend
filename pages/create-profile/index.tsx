import Client from "./client";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "สร้างโปรไฟล์",
  description: "สร้างโปรไฟล์",
};

function page() {
  return (
    <div id="createProfile">
      {/* <Client /> */}
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-bold text-neutral-700">Coming Soon</h1>
      </div>
    </div>
  );
}

export default page;
