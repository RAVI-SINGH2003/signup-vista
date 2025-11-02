import { Link } from "react-router-dom";

const NotFound = () => {

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'hsl(var(--background))' }}>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>404</h1>
        <p className="mb-4 text-xl" style={{ color: 'hsl(var(--muted-foreground))' }}>Oops! Page not found</p>
        <Link to="/" style={{ color: 'hsl(var(--primary))' }} className="underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
