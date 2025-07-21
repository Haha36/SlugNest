export default function navBar() {
  return (
    <>
      <nav className=" bg-white shadow dark:bg-gray-800">
        <div className=" flex items-center justify-center p-4 text-gray-600 capitalize dark:text-gray-300">
          <a href="/add-house"> Listings </a>

          <a href="/listings"> Saved </a>

          <a href="/saved"> Add a House </a>
        </div>
      </nav>
    </>
  );
}
