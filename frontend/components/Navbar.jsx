import Link from "next/link";
export default function navBar() {
  return (
    <>
      <nav className=" bg-white shadow-md rounded-md p-6 md:shadow-lg 2xl:p-9 ">
        <div className="flex items-center justify-between space-x-4  w-full font-medium md:justify-around md:text-xl 2xl:text-3xl 2xl:justify-evenly">
          <a
            className=" hover:bg-gray-50 hover:underline rounded-md"
            href="/listings"
          >
            {"  "}
            Listings{" "}
          </a>
          <a
            className="  hover:bg-gray-50 hover:underline rounded-md  "
            href="/saved"
          >
            {" "}
            Saved{" "}
          </a>
          <a
            className=" hover:bg-gray-50 hover:underline rounded-md"
            href="/add-house"
          >
            {" "}
            Add House{" "}
          </a>

          <a className=" bg-white rounded-lg border-full   hover:bg-gray-50 hover:underline">
            {" "}
            LogIn{" "}
          </a>
        </div>
      </nav>
    </>
  );
}
