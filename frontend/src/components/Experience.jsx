import profile from '../data/profile.json'

function formatDate(dateStr) {
    if (!dateStr) return 'Present'
    const [year, month] = dateStr.split('-')
    return new Date(year, month - 1).toLocaleDateString('en-GB', {month: 'short', year: 'numeric'})
}

function Experience() {
    return (
        <section id="experience" className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-12">Experience</h2>
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"/>
                <div className="space-y-10">
                    {profile.experience.map((job, i) => (
                        <div key={i} className="pl-8 relative">
                            <div
                                className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"/>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                                <div>
                                    <span className="font-semibold text-gray-900">{job.role}</span>
                                    <span className="text-gray-500 mx-2">·</span>
                                    <span className="text-gray-600">{job.company}</span>
                                </div>
                                <span className="text-sm text-gray-400 shrink-0">
                                  {formatDate(job.start)} – {formatDate(job.end)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{job.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-20 mb-12">Education</h2>
            {profile.education.map((edu, i) => (
                <div key={i} className="pl-8 relative">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"/>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"/>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                        <div>
                            <span className="font-semibold text-gray-900">{edu.degree}</span>
                            <span className="text-gray-500 mx-2">·</span>
                            <span className="text-gray-600">{edu.institution}</span>
                        </div>
                        <span className="text-sm text-gray-400 shrink-0">{edu.start} – {edu.end}</span>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Experience
