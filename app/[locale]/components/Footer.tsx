import { FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neural-dark text-white py-6">
      <div className="container mx-auto px-4">
        {/* Mobile Layout: Facebook above, Copyright below */}
        <div className="md:hidden flex flex-col items-center gap-8">
          <a
            href="https://www.facebook.com/groups/2597150567130470"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-neural-dark"
            aria-label="Facebook"
          >
            <FaFacebookF
              className="text-white hover:text-primary"
              size={32}
            />
          </a>
          <p className="text-sm text-center">
            © {new Date().getFullYear()} GARTS. All rights reserved.
          </p>
        </div>

        {/* Desktop Layout: Copyright center, Facebook right */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex-1"></div>

          <div className="flex-1 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} GARTS. All rights reserved.
            </p>
          </div>

          <div className="flex-1 flex justify-end">
            <a
              href="https://www.facebook.com/groups/2597150567130470"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-neural-dark"
              aria-label="Facebook"
            >
              <FaFacebookF
                className="text-white hover:text-primary"
                size={32}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
