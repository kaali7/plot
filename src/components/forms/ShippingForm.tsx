import { FiUser, FiPhone, FiMapPin } from 'react-icons/fi';

export const ShippingForm = () => {
  return (
    <div className="max-w-md mx-auto p-8 rounded-3xl bg-zinc-950 shadow-2xl border border-zinc-900/50">
      <h2 className="text-2xl font-bold tracking-tight text-white mb-8">Shipping</h2>
      
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        {/* Row 1: Name */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <FiUser className="w-[18px] h-[18px]" />
          </div>
          <input
            type="text"
            autoComplete="name"
            placeholder="Name"
            className="w-full pl-[46px] pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900"
          />
        </div>

        {/* Row 2: Phone Number & Type */}
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <FiPhone className="w-[18px] h-[18px]" />
            </div>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              className="w-full pl-[46px] pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900"
            />
          </div>
          <div className="relative w-32">
            <select 
              className="w-full h-full py-3.5 pl-4 pr-10 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900 appearance-none cursor-pointer text-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.75rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`
              }}
            >
              <option>Mobile</option>
              <option>Home</option>
              <option>Work</option>
            </select>
          </div>
        </div>

        {/* Row 3: Address */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <FiMapPin className="w-[18px] h-[18px]" />
          </div>
          <input
            type="text"
            autoComplete="street-address"
            placeholder="Address"
            className="w-full pl-[46px] pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900"
          />
        </div>

        {/* Row 4: City, State, Zip */}
        <div className="flex gap-4">
          <input
            type="text"
            autoComplete="address-level2"
            placeholder="City"
            className="flex-grow min-w-0 px-5 py-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900"
          />
          <div className="relative w-28">
            <select 
              autoComplete="address-level1"
              className="w-full h-full py-3.5 pl-4 pr-9 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900 appearance-none cursor-pointer text-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`
              }}
              defaultValue=""
            >
              <option value="" disabled hidden>State</option>
              <option value="CA">CA</option>
              <option value="NY">NY</option>
              <option value="TX">TX</option>
              <option value="FL">FL</option>
              {/* Add more as needed */}
            </select>
          </div>
          <input
            type="text"
            autoComplete="postal-code"
            placeholder="Zip"
            className="w-24 px-4 py-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:bg-zinc-900 text-center"
          />
        </div>

        {/* Row 5: Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-2">
          <button 
            type="button" 
            className="px-6 py-3 rounded-2xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Back to cart
          </button>
          <button 
            type="submit" 
            className="px-10 py-3 rounded-2xl bg-[#0088ff] text-white hover:bg-[#0077e6] transition-all duration-200 text-sm font-semibold shadow-[0_4px_14px_0_rgba(0,136,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,136,255,0.23)] hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-[#0088ff] focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Proceed
          </button>
        </div>
      </form>
    </div>
  );
};
