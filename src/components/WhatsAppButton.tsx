import { FiMessageCircle } from 'react-icons/fi';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254712345678"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40"
      aria-label="Chat on WhatsApp"
    >
      <FiMessageCircle className="text-2xl" />
    </a>
  );
}
