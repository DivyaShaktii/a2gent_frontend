import React from 'react';

const Sidebar = ({ projects, activeProjectId, onSelectProject, onNewProject }) => {
  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col h-screen flex-shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 text-xl font-bold text-primary tracking-tight border-b border-transparent">
        a2<span className="font-light text-text-primary">gent</span>
      </div>

      {/* New Project Button */}
      <div className="p-5">
        <button 
          onClick={onNewProject}
          className="w-full py-3 px-4 bg-primary-light text-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#eaddf0] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Project
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="text-xs font-bold text-text-secondary uppercase px-3 py-2 mt-2">
          Recent Projects
        </div>
        
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`p-3 mb-1 rounded-lg text-sm cursor-pointer flex items-center gap-3 transition-colors
              ${activeProjectId === project.id 
                ? 'bg-primary-light font-semibold text-primary' 
                : 'text-text-primary hover:bg-bg-app'
              }`}
          >
            <span className={activeProjectId === project.id ? "text-primary" : "text-text-secondary"}>#</span> 
            {project.name}
          </div>
        ))}
      </div>

      {/* User Profile (Bottom) */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-700 text-white flex items-center justify-center font-bold text-sm">
          JD
        </div>
        <div className="text-sm font-medium">John Doe</div>
      </div>
    </aside>
  );
};

export default Sidebar;