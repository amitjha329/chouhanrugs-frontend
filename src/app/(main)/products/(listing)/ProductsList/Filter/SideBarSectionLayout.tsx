import React from 'react'

const SideBarSectionLayout = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100 p-5 mb-5">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b-[1px] border-gray-400">{title}</h2>
      {children}
    </div>
  )
}

export default SideBarSectionLayout