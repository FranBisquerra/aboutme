import profile from '../data/profile.json'

function Home() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <section id="about" className="max-w-5xl mx-auto px-6 pt-40 pb-24">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 tracking-wide uppercase">Hi, I'm</p>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {profile.name}
                </h1>
                <p className="text-xl text-indigo-500 dark:text-indigo-400 font-medium mb-6">{profile.title}</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-10">
                    {profile.bio}
                </p>
                <div className="flex gap-4 mb-16">
                    <a href="#experience" className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        See experience
                    </a>
                </div>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Home
