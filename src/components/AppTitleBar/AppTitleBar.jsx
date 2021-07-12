import React from 'react';
import styles from './AppTitleBar.styledJsx.scss';

export default function AppTitleBar(props) {
  const { title } = props;

  return (
    <div className="app-title-bar">
      <div data-testid="title" className="bar-header">{title}</div>
      <style jsx="true">{styles}</style>
    </div>
  );
}
