
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error" | "warning";

interface CustomToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  id: string;
}

const variantIcons = {
  default: null,
  success: <CheckCircle className="h-5 w-5 text-cyan-400" />,
  error: <XCircle className="h-5 w-5 text-pink-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-400" />
};

const variantClasses = {
  default: "bg-indigo-900/90 dark:bg-gray-900/90",
  success: "bg-indigo-900/90 dark:bg-gray-900/90 border-l-4 border-cyan-400",
  error: "bg-indigo-900/90 dark:bg-gray-900/90 border-l-4 border-pink-500",
  warning: "bg-indigo-900/90 dark:bg-gray-900/90 border-l-4 border-amber-400"
};

export function CustomToast({ 
  variant = "default", 
  title, 
  description, 
  id 
}: CustomToastProps) {
  const { dismiss } = useToast();
  
  return (
    <div 
      className={cn(
        "rounded-md shadow-neon border border-pink-300/30 dark:border-pink-800/30 backdrop-blur-md p-4 mb-2 flex items-start w-full max-w-md animate-fade-in",
        variantClasses[variant]
      )}
      role="alert"
    >
      {variantIcons[variant] && (
        <div className="mr-3 flex-shrink-0 pt-0.5">
          {variantIcons[variant]}
        </div>
      )}
      
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-cyan-100">{title}</h3>
        {description && <p className="text-sm text-cyan-200/80 mt-1">{description}</p>}
      </div>
      
      <button 
        onClick={() => dismiss(id)}
        className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-pink-500/20 transition-colors"
        aria-label="Close toast"
      >
        <X className="h-4 w-4 text-cyan-300" />
      </button>
    </div>
  );
}

export function CustomToaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end">
      {toasts.map((toast) => (
        <CustomToast
          key={toast.id}
          id={toast.id}
          title={toast.title as string}
          description={toast.description as string}
          variant={toast.variant as ToastVariant}
        />
      ))}
    </div>
  );
}
