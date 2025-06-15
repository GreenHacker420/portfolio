'use client'

import { useEffect, useState } from 'react'
import { fetchSkills, SkillFromAPI } from '@/services/skillsService'

export default function TestSkillsPage() {
  const [skills, setSkills] = useState<SkillFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const { skills: skillsData } = await fetchSkills()
        setSkills(skillsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Skills Data Test</h1>
          <p>Loading skills from database...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Skills Data Test</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Skills Data Test</h1>
        
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-8">
          <p className="text-green-400">✅ Successfully loaded {skills.length} skills from database!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: skill.color }}
                />
                <h3 className="text-xl font-semibold">{skill.name}</h3>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{skill.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-blue-400">{skill.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-green-400">{skill.level}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-yellow-400">{skill.experience} years</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color 
                    }}
                  />
                </div>
              </div>
              
              {skill.projects && skill.projects.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Projects:</h4>
                  <div className="flex flex-wrap gap-1">
                    {skill.projects.slice(0, 2).map((project, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-700 px-2 py-1 rounded"
                      >
                        {project}
                      </span>
                    ))}
                    {skill.projects.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{skill.projects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {skill.strengths && skill.strengths.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Strengths:</h4>
                  <div className="flex flex-wrap gap-1">
                    {skill.strengths.slice(0, 3).map((strength, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: `${skill.color}20`,
                          color: skill.color 
                        }}
                      >
                        {strength}
                      </span>
                    ))}
                    {skill.strengths.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{skill.strengths.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Source Verification</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">API Endpoint:</span> <span className="text-blue-400">/api/skills</span></p>
            <p><span className="text-gray-400">Database:</span> <span className="text-green-400">PostgreSQL via Prisma</span></p>
            <p><span className="text-gray-400">Total Skills:</span> <span className="text-yellow-400">{skills.length}</span></p>
            <p><span className="text-gray-400">Categories:</span> <span className="text-purple-400">{Array.from(new Set(skills.map(s => s.category))).join(', ')}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
