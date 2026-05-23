import { useState, useEffect } from 'react'

function Navbar() {
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem('theme')
        if (stored) return stored === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    return (
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white tracking-tight">
                    <a href="#about">fbisquerra</a>
                </span>
                <ul className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                    <li><a href="#about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
                    <li>
                        <button
                            onClick={() => setDark(d => !d)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {dark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                </svg>
                            )}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
