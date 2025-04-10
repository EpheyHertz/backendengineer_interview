export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">My Project</span></h1>
            <p className="text-gray-600 mt-3">Please click the buttons below to Register an account or login to your Dashboard</p>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/auth/login"
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition duration-200"
            >
              Log In
            </a>
            
            <a 
              href="/auth/register"
              className="block w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg text-center transition duration-200"
            >
              Sign Up
            </a>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Experience the future of productivity with our innovative platform</p>
          </div>
        </div>
      </div>

    </div>
  );
}