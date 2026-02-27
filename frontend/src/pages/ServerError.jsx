import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';

const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">500</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4">Server Error</h2>
          <p className="text-gray-600 mt-2">
            Oops! Something went wrong on our end. We're working to fix it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Error persisting?{' '}
            <a href="mailto:support@jobmatchai.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
