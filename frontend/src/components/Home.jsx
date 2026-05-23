function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section id="about" className="max-w-5xl mx-auto px-6 pt-40 pb-24">
        <p className="text-sm font-medium text-indigo-600 mb-4 tracking-wide uppercase">Hola, soy</p>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Francesc Bisquerra
        </h1>
        <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
          Desarrollador de software apasionado por construir productos bien diseñados y fáciles de usar.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver proyectos
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
          >
            Contacto
          </a>
        </div>
      </section>
    </main>
  )
}

export default Home
