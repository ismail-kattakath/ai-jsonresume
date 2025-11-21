import { MdPictureAsPdf } from "react-icons/md";

interface PrintButtonProps {
  name?: string;
  documentType?: "Resume" | "CoverLetter";
}

export default function PrintButton({ name, documentType = "Resume" }: PrintButtonProps) {
  const handlePrint = () => {
    // Convert name to ProperCase without spaces or underscores
    const formatName = (name: string) => {
      return name
        .split(/[\s_-]+/) // Split by spaces, underscores, or hyphens
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    };

    // Set document title for PDF filename
    if (name) {
      const originalTitle = document.title;
      const formattedName = formatName(name);
      document.title = `${formattedName}-${documentType}`;

      // Print
      window.print();

      // Restore original title after print dialog closes
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    } else {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      aria-label="Print"
      className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 animate-pulse hover:animate-none cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    >
      <MdPictureAsPdf className="text-lg group-hover:scale-110 transition-transform" />
      <span>Print</span>
    </button>
  );
}
