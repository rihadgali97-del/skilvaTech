import { useState } from 'react';
import { usePublicCourses } from '../hooks/usePublicData';
import { Section, SectionHeader, BrandButton, PublicBadge, CardSkeleton } from '../components/ui';

const levelColors = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };

const CoursesPage = () => {
  const [level, setLevel]   = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const { courses, pagination, loading } = usePublicCourses({
    limit: 9, page,
    ...(level  && { level }),
    ...(search && { search }),
  });

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d1117] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00d4d4]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-4">
            Learn & Grow
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master <span className="text-[#00d4d4]">In-Demand</span> Skills
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Hands-on courses taught by industry experts. Learn at your own pace and advance your career with real-world skills.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                         placeholder-slate-500 focus:outline-none focus:border-[#00d4d4]/50 text-sm"
            />
            <button type="submit"
              className="px-6 py-3 bg-[#00d4d4] hover:bg-[#00b3b3] text-white font-semibold rounded-xl text-sm transition-all">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#0d1f2d] border-y border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          {[
            { icon: '📚', label: `${pagination.total || 0} Courses` },
            { icon: '🎓', label: 'Expert Instructors' },
            { icon: '🏆', label: 'Certificate on Completion' },
            { icon: '⏰', label: 'Learn at Your Pace' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-slate-300 text-sm">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Courses list */}
      <Section>
        {/* Level filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {['', 'beginner', 'intermediate', 'advanced'].map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setPage(1); }}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all
                ${level === l ? 'bg-[#00d4d4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {l || 'All Levels'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-xl font-medium text-gray-600 mb-2">No courses found</p>
            <p className="text-sm mb-6">Try adjusting your search or filters.</p>
            <BrandButton onClick={() => { setSearch(''); setLevel(''); }}>Clear Filters</BrandButton>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden
                             hover:shadow-lg hover:border-[#00d4d4]/30 transition-all duration-300 group flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-44 bg-gradient-to-br from-[#0d1f2d] to-[#0d1117] flex items-center justify-center relative overflow-hidden">
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      : <span className="text-6xl">📚</span>
                    }
                    <div className="absolute top-3 left-3">
                      <PublicBadge color={levelColors[course.level] || 'gray'}>{course.level}</PublicBadge>
                    </div>
                    {course.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <PublicBadge color="teal">Featured</PublicBadge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#00b3b3] transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                      {course.description || 'A comprehensive course to advance your skills.'}
                    </p>

                    {/* Instructor */}
                    {course.instructor && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#00d4d4]/20 border border-[#00d4d4]/30 flex items-center justify-center text-xs font-bold text-[#00b3b3]">
                          {course.instructor.firstName?.[0]}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {course.instructor.firstName} {course.instructor.lastName}
                        </span>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span>📖 {course.lessonCount || 0} lessons</span>
                      {course.duration && <span>⏱ {course.duration} min</span>}
                      <span>👥 {course.enrollmentCount || 0} enrolled</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="font-bold text-gray-900">
                        {course.price ? `$${parseFloat(course.price).toFixed(2)}` : <span className="text-emerald-600">Free</span>}
                      </span>
                      <BrandButton href="/contact" size="sm">Enroll Now</BrandButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all">
                  ← Prev
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                      ${p === page ? 'bg-[#00d4d4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </Section>

      {/* CTA */}
      <section className="bg-[#0d1f2d] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
          <p className="text-slate-400 text-lg mb-8">We offer custom training programs tailored to your team's needs.</p>
          <BrandButton href="/contact" size="lg">Request Custom Training</BrandButton>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;