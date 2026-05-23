import profile from '../data/profile.json'

function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section id="about" className="max-w-5xl mx-auto px-6 pt-40 pb-24">
        <p className="text-sm font-medium text-indigo-600 mb-4 tracking-wide uppercase">Hi, I'm</p>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {profile.name}
        </h1>
        <p className="text-xl text-indigo-500 font-medium mb-6">{profile.title}</p>
        <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
          {profile.bio}
        </p>
        <div className="flex gap-4 mb-16">
          <a
            href="#experience"
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            See experience
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="px-6 py-3 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span
              key={skill}
              className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 text-gray-600 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
