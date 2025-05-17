function Footer() {
  return (
    <footer className="bg-sky-600 p-8 mt-auto text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center md:text-left">
          {/* Texto de desenvolvedor e copyright */}
          <p className="text-lg md:text-xl font-medium mt-4">
            Desenvolvido por: <span className="text-gray-700">Eraldo Junior</span>
          </p>
          <p className="text-lg md:text-xl font-medium mt-2">
            &copy; 2024 Todos os direitos reservados.
          </p>

          {/* Ícones de redes sociais */}
          <div className="flex justify-center gap-6 mt-6 md:justify-start">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#030303] transition-all duration-300 transform hover:scale-110"
            >
              <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#080808] transition-all duration-300 transform hover:scale-110"
            >
              <i className="fa-brands fa-x-twitter text-2xl"></i>
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#080808] transition-all duration-300 transform hover:scale-110"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

