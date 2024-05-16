import React from 'react';
import { MenuDatas } from '../components/Datas';
import { Link } from 'react-router-dom';
import pic from '../build/images/upLogo.jpg';

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

  return (
    <div className="bg-white xl:-lg py-6 px-4 xl:h-screen w-full border-r">
      <div className="mb-0">
        <Link to="/">
          <img
            src={pic}
            alt="logo"
            className="w-56 h-18 mx-auto rounded-lg"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-0">
        {MenuDatas.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`
              ${currentPath(item.path) === item.path ? 'bg-text' : ''}
              flex gap-4 items-center w-full p-4  rounded-lg hover:bg-gray-200 transition-all`}
          >
            <item.icon
              className={`text-xl text-subMain`}
            />
            <p
              className={`text-sm font-medium ${currentPath(item.path) === item.path
                ? 'text-subMain'
                : 'text-gray-500'
              } hover:text-blue-800`}
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
