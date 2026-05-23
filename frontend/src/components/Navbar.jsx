function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-semibold text-gray-900 tracking-tight">fbisquerra</span>
        <ul className="flex gap-8 text-sm text-gray-600">
          <li><a href="#about" className="hover:text-gray-900 transition-colors">Sobre mí</a></li>
          <li><a href="#projects" className="hover:text-gray-900 transition-colors">Proyectos</a></li>
          <li><a href="#contact" className="hover:text-gray-900 transition-colors">Contacto</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
