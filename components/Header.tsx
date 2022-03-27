import Link from 'next/link'

function Header() {
  return (
    <header className="flex justify-center bg-gray-900 md:justify-between">
      <div className="flex items-center justify-center space-x-8">
        <Link href="/">
          <img
            className="mx-5 mt-5 mb-2 w-44 object-contain"
            src="/DudDreamer.png"
            alt="logo-is-here"
          />
        </Link>
        <div className="hidden items-center space-x-10 pb-2 font-medium text-white md:inline-flex">
          <h3 className="cursor-pointer">About</h3>
          <h3 className="cursor-pointer">Blogs</h3>
          <h3 className="cursor-pointer rounded-full bg-gray-100 px-4 py-1 text-gray-900 hover:bg-gray-200">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex hidden items-center items-center space-x-10 px-8 pb-2 font-medium text-white md:inline-flex">
        <h3 className="cursor-pointer">Sign in</h3>
        <h3 className="border-white-600 delay-50 cursor-pointer rounded-full border px-4 py-1 transition hover:bg-gray-100 hover:text-gray-900">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
