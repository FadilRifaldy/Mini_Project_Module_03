export default function SignUpPage() {
  return (
    <div className="bg-gray-950 flex justify-center">
      <div className="h-[80vh] grid grid-cols-2 place-items-center text-white w-7xl">
        <div>LOGO</div>
        <form className="flex flex-col gap-5 w-[90%]">
          <div className="flex justify-between w-full">
            <div className="w-[45%]">
              <div>Username</div>
              <input
                type="text"
                placeholder="Input Username Here"
                className="border-b border-white w-full"
              />
            </div>
            <div className="w-[45%]">
              <div>Email</div>
              <input
                type="text"
                placeholder="Input Email Here"
                className="border-b border-white w-full"
              />
            </div>
          </div>
          <div className="flex justify-between w-full">
            <div className="w-[45%]">
              <div>Password</div>
              <input
                type="password"
                placeholder="Input Password Here"
                className="border-b border-white w-full"
              />
            </div>
            <div className="w-[45%]">
              <div>Confirm Password</div>
              <input
                type="password"
                placeholder="Input Password Here"
                className="border-b border-white w-full"
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-[70%]">
              <div>Code Referral</div>
              <input
                type="text"
                placeholder="Input Code Here"
                className="border-b border-white w-full"
              />
            </div>
          </div>
          <div className="flex justify-evenly gap-2.5">
            <div>
              <input
                type="radio"
                id="customer"
                value="Customer"
                name="Category"
              />
              <label htmlFor="customer" className="hover:cursor-pointer">
                Customer
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="event"
                value="Event Organizer"
                name="Category"
              />
              <label htmlFor="event" className="hover:cursor-pointer">
                Event Organizer
              </label>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="hover:cursor-pointer bg-purple-600 rounded-2xl px-3 py-2 text-white place-items-center"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
