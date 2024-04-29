import React from 'react';
import { MenuDatas } from '../components/Datas';
import { Link } from 'react-router-dom';
import pic from '../build/images/logo.jpg'
function Sidebar() {
  // active link
  const currentPath = (path) => {
    const currentPath =
      window.location.pathname.split('/')[1] === path.split('/')[1];
    if (currentPath) {
      return path;
    }
    return null;
  };
  // object-contain
  return (
    <div className="bg-white xl:shadow-lg py-6 px-4 xl:h-screen w-full border-r border-border">
      <Link to="/">
        <img
          src={pic}
          alt="logo"
          className="w-48 h-15 ml-4  rounded-lg "
        />
      </Link>
      <div className="flex-colo gap-2 mt-12">
        {MenuDatas.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`
            ${currentPath(item.path) === item.path ? 'bg-text' : ''}
            flex gap-4 transitions group items-center w-full p-4 rounded-lg hover:bg-gray-200`}
          >
            <item.icon
              className={`text-xl text-subMain
            `}
            />
            <p
              className={`text-sm font-medium ${currentPath(item.path) === item.path
                ? 'text-subMain'
                : 'text-gray-500'
                } group-hover:text-blue-800`}
            >
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
