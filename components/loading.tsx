import { Loader } from "lucide-react"; // Import the Loader icon

// Define the props interface
interface LoadingSpinnerProps {
  message: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div className="bg-neutral-500/10 p-3 px-4 rounded-md flex items-center gap-x-2 text-sm text-neutral-800">
      <Loader className="animate-spin size-4" />
      <p>{message}</p>
    </div>
  );
};
