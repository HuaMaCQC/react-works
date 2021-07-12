import React, { useState } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import styles from './App.styledJsx.scss';
import AppMenu from './components/AppMenu';
import AppFooter from './components/AppFooter';
import Home from './components/Home/Home';
import MemberList from './components/member/memberList/MemberList';
import MemberEdit from './components/member/memberEdit/MemberEdit';
import AppTitleBar from './components/AppTitleBar/AppTitleBar';
import './App.scss';

export default function App() {
  const menu = [
    {
      id: 1,
      name: '會員管理',
      option: [
        {
          id: 1,
          name: '會員列表',
          path: '/member-table',
        },
        {
          id: 2,
          name: '會員編輯',
          path: '/member-edit',
        },
        {
          id: 3,
          name: '訊息',
          path: '/message',
        },
      ],
    },
    {
      id: 2,
      name: '站內信',
      option: [
        {
          id: 4,
          name: '信件',
          path: '/letter',
        },
      ],
    },
  ];
  const user = { id: 1, name: 'HuaMa' };
  const routeComponent = [
    { id: 1, component: MemberList, path: '/member-table' },
    { id: 2, component: MemberEdit, path: '/member-edit' },
  ];
  const [menuShow, setMenuShow] = useState(true);
  const [title, setTitle] = useState();

  return (
    <div className="app">
      <div className="header">
        <AppHeader switchMenu={() => setMenuShow(!menuShow)} user={user} />
      </div>
      <div className="main">
        <HashRouter>
          <div className={`${menuShow ? '' : 'hide'} menu`} data-testid="menu">
            <AppMenu menu={menu} setTitle={setTitle} />
          </div>
          <div className={`${menuShow ? '' : 'menu-hide'} article`}>
            <div className="box">
              <div className="explore-bar">
                <AppTitleBar title={title} />
              </div>
              <div className="component">
                <Route path="/" component={Home} exact />
                {routeComponent.map(route => (
                  <Route
                    key={route.id}
                    path={route.path}
                    component={route.component}
                  />
                ))}
              </div>
            </div>
          </div>
        </HashRouter>
      </div>
      <div className="footer bg-secondary-1">
        <AppFooter />
      </div>
      <style jsx="true">{styles}</style>
    </div>
  );
}
