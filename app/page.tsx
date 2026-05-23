import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="relative h-screen w-screen">
        <div className="bg-yellow-600 absolute top-0 h-[6%] left-0 right-0 rounded-sm ">
          Header
        </div>
        <div className="bg-green-600 absolute top-[6%] left-0 w-[18%] h-[83.5%] rounded-sm m-[1%] ">
          Left Sidebar
        </div>
        <div className="bg-red-600 absolute top-[6%] right-[19%] left-[19%] h-[86%] rounded-sm m-[1%] ">
          Main Content
        </div>
        <div className="bg-blue-600  absolute top-[6%] right-0 w-[18%] h-[86%] rounded-sm m-[1%] ">
          Right Sidebar
        </div>
        <div className="bg-orange-600 absolute bottom-0 left-0 right-0 h-[8%] rounded-sm ">
          Footer
        </div>
      </div>
    </div>
  );
}
